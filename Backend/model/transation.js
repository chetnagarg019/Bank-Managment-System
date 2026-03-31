import mongoose from "mongoose";

const transationSchema = new mongoose.Schema({

    fromAccount:{
        type : mongoose.Schema.ObjectId,
        ref : "account",
        required : [true,"Transaction must be associated with a from account"],
        index : true
    },
    toAccount:{
        type : mongoose.Schema.ObjectId,
        ref : "account",
        required : [true,"Transaction must be associated with a to account"],
        index : true
    },
    status : {
        type : String,
        enum : {
            values : ["Pending", "Completed","Failed","Reversed"],
            message : "Status can be either pending, complete, failed or reversed",
        },
        default : "Pending"
    },
    amount : {
        type : Number,
        required : [true,"Amount must be required for create a transcation"],
        min : [0,"Transcation amount cannot be  negative"]
    },
    idempotencyKey : {
        type : String,
        required : [true,"key be required for create a transcation"],
        index : true,
        unique : true
    }

},{
    timestamps : true
})

const Transaction = mongoose.model("transaction",transationSchema)

export default { Transaction }
