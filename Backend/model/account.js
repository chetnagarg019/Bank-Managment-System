import mongoose from "mongoose";
import ledger from "./ledger.js";

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //Ye dusre collection ke document ka id store karega.Account → User se connected hai
      ref: "User", //Ye User model ko refer karta hai.
      required: [true, "Account must be associated with user"],
      index: true, //Ye database index create karta hai. iska benifit search fast ho jata hai
    },
    status: {
      type: String,
      enum: {
        //enum ka matlab:
        values: ["Active", "Frozen", "Closed"], //Status sirf in values me se hi ho sakta hai.
        message: "Status can be active,frozen or closed",
      },
      default: "Active",
    },
    currency: {
      //Ye field batata hai account ki currency.
      type: String,
      required: [true, "Currency is required for creating an acccount"],
      default: "INR", //Agar currency nahi di to:
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 }); //Ye compound index hai. Matlab database fast search karega jab query ho:

accountSchema.methods.getBalance = async function () {
  const balanceData = await ledger.aggregate([
  { $match: { account: this._id } },
  {
    $group: {
      _id: null,
      totalDebit: {
        $sum: {
          $cond: [{ $eq: ["$type", "Debit"] }, "$amount", 0],
        },
      },
      totalCredit: {
        $sum: {
          $cond: [{ $eq: ["$type", "Credit"] }, "$amount", 0],
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      balance: { $subtract: ["$totalCredit", "$totalDebit"] },
    },
  },
]);

  if(balanceData.length === 0) return 0;

  return balanceData[ 0 ].balance
};

const Account = mongoose.model("Account", accountSchema);
export default Account;

//is file me load  