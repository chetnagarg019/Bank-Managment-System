import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId, //Ye dusre collection ke document ka id store karega.Account → User se connected hai
        ref : "User", //Ye User model ko refer karta hai.
        required : [true, "Account must be associated with user"],
        index : true //Ye database index create karta hai. iska benifit search fast ho jata hai

    },
    status : {
        type : String,
        enum : { //enum ka matlab:
            values : ["Active","Frozen","Closed"], //Status sirf in values me se hi ho sakta hai.
            message : "Status can be active,frozen or closed",
        },
        default : "Active"
    },
    currency : { //Ye field batata hai account ki currency.
        type : String,
        required : [true, "Currency is required for creating an acccount"],
        default : "INR" //Agar currency nahi di to:
    }
},{
    timestamps : true
})

accountSchema.index({ user : 1, status : 1 }) //Ye compound index hai. Matlab database fast search karega jab query ho:

const Account = mongoose.model("Account",accountSchema);
export default Account;