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

    },
    type : {
        type : String,
        enum : {
            values : ["Credit","Debit"],
            message : "Type can bs either credit or debit",
        },
        required : [true, "Ledger type is required"],
        immutable : true
    }
})

//to prevent ledger make a function
function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdated',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);



const ledgerModel = mongoose.model('ledger',ledgerSchema);
module.exports = ledgerModel;

