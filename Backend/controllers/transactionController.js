import jwt from "jsonwebtoken";
import emailService from "../services/emailService.js";
import Transaction from "../model/transation.js";
import ledgerModel from "../model/ledger.js";
import Account from "../model/account.js";
import mongoose from "mongoose";

// =========================
// NORMAL TRANSACTION
// =========================
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount, idempotencyKey are required",
    });
  }

  const fromUserAccount = await Account.findById(fromAccount);
  const toUserAccount = await Account.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  // idempotency check
  const existing = await Transaction.findOne({ idempotencyKey });
  if (existing) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existing,
    });
  }

  // status check
  if (
    fromUserAccount.status !== "Active" ||
    toUserAccount.status !== "Active"
  ) {
    return res.status(400).json({
      message: "Both accounts must be active",
    });
  }

  // balance check
  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance: ${balance}`,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ IMPORTANT FIX (array)
    const transactionArr = await Transaction.create(
      [{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "Pending",
      }],
      { session }
    );

    const transaction = transactionArr[0];

    // CREDIT
    await ledgerModel.create(
      [{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "Credit",
      }],
      { session }
    );

    // DEBIT
    await ledgerModel.create(
      [{
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "Debit",
      }],
      { session }
    );

    transaction.status = "Completed";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // email (optional)
    try {
      await emailService.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        toAccount
      );
    } catch (e) {
      console.log("Email error:", e);
    }

    return res.status(201).json({
      message: "Transaction successful",
      transaction,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);

    return res.status(500).json({
      message: "Transaction failed",
    });
  }
}

// =========================
// SYSTEM INITIAL FUNDS
// =========================
async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount, idempotencyKey are required",
    });
  }

  const toUserAccount = await Account.findById(toAccount);

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // system user ka account
  const fromUserAccount = await Account.findOne({
    user: req.user._id,
    status: "Active",
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ✅ FIX: transaction create
    const transactionArr = await Transaction.create(
      [{
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "Pending",
      }],
      { session }
    );

    const transaction = transactionArr[0];

    // DEBIT (system se paisa gaya)
    await ledgerModel.create(
      [{
        account: fromUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "Debit",
      }],
      { session }
    );

    // CREDIT (user ko mila)
    await ledgerModel.create(
      [{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "Credit",
      }],
      { session }
    );

    transaction.status = "Completed";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Initial funds added successfully",
      transaction,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);

    return res.status(500).json({
      message: "Initial fund transaction failed",
    });
  }
}

export default { createTransaction, createInitialFundsTransaction };