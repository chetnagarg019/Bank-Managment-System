import Account from "../model/account.js";


async function createAccount(req,res) {
    const user = req.user;

    const account = await Account.create({
        user : user._id
    })

    res.status(201).json({
        account
    })
}

export default { createAccount } // it is a create account method that 