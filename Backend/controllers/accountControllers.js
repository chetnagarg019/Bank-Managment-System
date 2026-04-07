import Account from "../model/account.js";


async function createAccount(req,res) {
    const user = req.user; //directly current logged-in user ko access kar rahi hai

    const account = await Account.create({
        user : user._id
    })

    res.status(201).json({
        account
    })
}

export default { createAccount } 

//“Ye function authenticated user ke liye ek account create karta hai aur usko DB me user se link karta hai”