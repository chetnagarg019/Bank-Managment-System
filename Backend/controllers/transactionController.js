import jwt from "jsonwebtoken";
import emailService from "../services/emailService.js";
import Transaction from "../model/transation.js";
import ledgerModel from "../model/ledger.js";
import Account from "../model/account.js";
import transation from "../model/transation.js";


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
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromaccount or toAccount"
        })
    }

    //step-2 validate idempotenccy key
    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey : idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "Completed"){
            res.status(200).json({
                message : "Transaction already processed",
                transation : isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "Pending"){
            res.status(200).json({
                message : "Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists.status === "Failed"){
            res.status(400).json({
                message : "Transaction Failed",
            })
        }

          if(isTransactionAlreadyExists.status === "Reversed"){
            res.status(500).json({
                message : "Transaction was reversed,try again",
            })
        }

    }

    // 

    









}