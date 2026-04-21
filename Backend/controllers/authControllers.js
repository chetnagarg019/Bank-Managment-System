  import User from "../model/user.js";
  import jwt from "jsonwebtoken";
  import emailService from "../services/emailService.js";

  async function registerUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        return res.status(422).json({
          message: "Email already exists",
          status: "failed",
        });
      }

      // const hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password,
      });

      //create token
      const token = jwt.sign(
        // ye 3 chize leta hai
        { id: user._id }, //Payload (Token ke andar kya store hoga)
        process.env.JWT_SECRET, //Ye secret key hoti hai jo token ko sign karti hai. Server jab token banata hai to secret key use karta hai.
        { expiresIn: "20d" }, //Matlab token 7 din me expire ho jayega.
      );

      //token save in cookie parser
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });

      // send welcome email after successful registration
      try {
        await emailService.sendRegistrationEmail(user.email, user.name);
      } catch (emailError) {
        // log error but don't prevent response to client
        console.error("Failed to send registration email:", emailError);
      }
      

      res.status(200).json({
        message: "signup Succesfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Server error" });
    }
  }
  //-------------------------

  async function loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          message: "Invalid Crenditals",
          status: "failed",
        });
      }

      //password check
      const valid = await user.comparePassword(password); //comparePassword method model/user.js me hai

      if (!valid) {
        return res.status(401).json({
          message: "Invalid Crenditals",
          status: "failed",
        });
      }

      //if email and password valid  genrate token
      const token = jwt.sign(
        // ye 3 chize leta hai
        { id: user._id }, //Payload (Token ke andar kya store hoga)
        process.env.JWT_SECRET, //Ye secret key hoti hai jo token ko sign karti hai. Server jab token banata hai to secret key use karta hai.
        { expiresIn: "7d" }, //Matlab token 7 din me expire ho jayega.
      );

      //token save in cookie parser
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });

      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      }); // login token that connect
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Server error" });
    }
  }

  export default { registerUser, loginUser };

  //User.create() internally .save() call karta hai
