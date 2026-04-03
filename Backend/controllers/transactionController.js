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
    if(fromUserAccount.status !== "Active" || toUserAccount !== "Active"){
        return res.status(400).json({
            message : "both from account and to account must be active to process transaction"
        })

    } 

    //4.drive sender ledger check krna hai sender ke paas utna balance hai bhi ya nhii 

    
 








}

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
