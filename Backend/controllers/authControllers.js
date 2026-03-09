import User from "../model/user.js";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email : email });

    if (existingUser) {
      return res.status(422).json({
        message: "Email already exists",
        status : "failed"
        });
    }

    // const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password,
    });

    //create token
    const token = jwt.sign( // ye 3 chize leta hai 
    { id: user._id,}, //Payload (Token ke andar kya store hoga)
    process.env.JWT_SECRET, //Ye secret key hoti hai jo token ko sign karti hai. Server jab token banata hai to secret key use karta hai.
    { expiresIn: "7d" } //Matlab token 7 din me expire ho jayega.
  );

  res



    res.status(200).json({
      message: "signup Succesfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export default { registerUser };
