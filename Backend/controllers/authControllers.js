import User from "../model/user.js"

async function registerUser(req,res) {
    try{
        const { name,email,password } = req.body;

        const existingUser = await User.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message : "Email already exists" });
        }

        const hash = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password : hash,
        });

        res.status(200).json({
            message : "signup Succesfully",
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
            },
        });




    }catch(error){
         res.status(500).json({ message: "Server error" });
    }
}

export default { registerUser }

