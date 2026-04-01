import jwt from "jsonwebtoken";
import emailService from "../services/emailService.js";
import Transaction from "../model/transation.js";
import ledgerModel from "../model/ledger.js";
import Account from "../model/account.js";


async function createTransaction(req,res) {

    const { fromAccount, toAccount, amount,idempotencyKey } = req.body;

    if(!fromAccount ||  !toAccount ||  !amount || !idempotencyKey ){
        return res.status(400).json({
            message : "fromAccount, toAccount, amount,idempotencyKey are required"
        })
    }

    


}