//Ledger → saari transactions ka record
import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : [true,"Ledger must be associated with an account"],
        index : true,
        immutable : true
    },
    amount : {
        type : Number,
        rexquired : [true,"Amount is required for creating a ledger entry"],
        immutable : true
    },
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transation",
        required : [true,"Ledger must be associated with an account"],
        index : true,
        immutable : true

        

    }
})