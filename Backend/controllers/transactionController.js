import jwt from "jsonwebtoken";
import emailService from "../services/emailService.js";
import Transaction from "../model/transation.js";
import ledgerModel from "../model/ledger.js";
import Account from "../model/account.js";
import mongoose from "mongoose";


async function createTransaction(req,res) {

    //step-1 validate request 

    const { fromAccount, toAccount, amount,idempotencyKey } = req.body;

    if(!fromAccount ||  !toAccount ||  !amount || !idempotencyKey ){
        return res.status(400).json({
            message : "fromAccount, toAccount, amount,idempotencyKey are required"
        })
    }

    const fromUserAccount = await Account.findOne({ 
        _id : fromAccount,
    }) 

    const toUserAccount = await Account.findOne({
         _id : toAccount,
    }) //DB se dono accounts nikaale

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromaccount or toAccount"
        })
    } //dono me se koib bhi account nhi mila to invalid 

    //step-2 validate idempotenccy key
    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey : idempotencyKey
    }) //user ne 2 baar same request bhej di (network issue, double click) Without this: paise 2 baar transfer ho jayenge

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "Completed"){
            return res.status(200).json({
                message : "Transaction already processed",
                transation : isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "Pending"){
            return res.status(200).json({
                message : "Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists.status === "Failed"){
            return res.status(400).json({
                message : "Transaction Failed",
            })
        }

          if(isTransactionAlreadyExists.status === "Reversed"){
            return res.status(500).json({
                message : "Transaction was reversed,try again",
            })
        }

    }

    //check account status
    if(fromUserAccount.status !== "Active" || toUserAccount.status !== "Active"){
        return res.status(400).json({
            message : "both from account and to account must be active to process transaction"
        })

    } 

    //4.drive sender ledger check krna hai sender ke paas utna balance hai bhi ya nhii 
    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return  res.status(400).json({
            message : `Insufficent balance current balance is ${balance} and amount is ${amount}`
        })
    }

    // 5.create transcation pending 
    //ek temporary transaction environment start ho gaya Ab jo bhi operations honge:wo temporary state me rahenge DB me permanently tabhi jayenge jab commit hoga
    const session = await mongoose.startSession()
    session.startTransaction(); //ya to sv kuch complete hoga ya kuch bhi nhi 

    const transaction = await Transaction.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : "Pending"
    },{ session })

    //credit entry
     const credit = await ledgerModel.create({
        account : toAccount,
        amount : amount,
        transaction: transaction._id,
        type : "Credit" 
    },{ session })
    
    


    //debit entry
    const debit = await ledgerModel.create({
        account : fromAccount,
        amount : amount,
        transaction: transaction._id,
        type : "Debit" 
    },{ session })

    //Transaction complete mark karna
    transaction.status = "Completed"
    await transaction.save({ session }) //“Sab steps successfully ho gaye”

    await session.commitTransaction() //// Sabko ek saath DB me permanently save kar deta hai
    session.endSession() //session close
    


    //10 send email notification










}

//Ye route keh raha hai:

// “Sirf logged-in user hi transaction create kar sakta hai”

export default { createTransaction }

//✔️ Duplicate transaction na ho
// ✔️ Invalid account use na ho
// ✔️ Balance safe rahe
// ✔️ System crash me bhi data safe rahe

//10 steps
//1.validate request
//2.valid idempotency key
//3.check account status
//4.drive sender balance from ledger
//5.create transaction(pending)
//6. create debit ledger entry 
//7. create credit ledger entry
//8.mark transaction complete
//9.commit mongoDb session
//10.send email notifaction

//..
//..
//..
//..
//.. 
//ledger //model 
//trabsaction //model
//..
//..
//..
//..
//email
//..
