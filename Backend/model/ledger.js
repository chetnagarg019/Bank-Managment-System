//Ledger → saari transactions ka record Ye source of truth hai (final sach yahi hota hai)
import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId, //kisi account se link
        ref : "account",
        required : [true,"Ledger must be associated with an account"],
        index : true,
        immutable : true
    },
    amount : {
        type : Number,
        required : [true,"Amount is required for creating a ledger entry"],
        immutable : true
    }, //kitna paisa move hua immutable → change nahi kar sakte baad me
    transaction : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "transaction",
        required : [true,"Ledger must be associated with an account"],
        index : true,
        immutable : true

    }, //“Ye entry kis transaction ki wajah se bani”
    type : {
        type : String,
        enum : {
            values : ["Credit","Debit"],
            message : "Type can bs either credit or debit",
        },
        required : [true, "Ledger type is required"],
        immutable : true
    } //paisa aaya (Credit)  paisa aaya (Credit)
})

//to prevent ledger make a function
function preventLedgerModification() {
    throw new Error("Ledger entries are immutable and cannot be modified or deleted");
} // agr koi ledger ko update kre delt kre to error throw ho 

ledgerSchema.pre('findOneAndUpdated',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);



const ledgerModel = mongoose.model('ledger',ledgerSchema);
export default { ledgerModel }

// Ye model ensure karta hai:

// ✔️ Har entry account se linked ho
// ✔️ Har entry transaction se linked ho
// ✔️ Data kabhi change na ho
// ✔️ System secure rahe

