import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Ye library password ko hash (encrypt) karne ke liye use hoti hai.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required for creating an account"],
    },
    email: {
      type: String,
      required: [true, "Email is required for creating a user"],
      trim: true, //koi bhi spcae nhi
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account"],
      minlength: [6, "password should be more than 6 characters"],
      select: false, //Jab bhi user database se fetch hoga to password automatically hide rahega.
    },
  },
  {
    timestamps: true, //createAt and updateAt apne aap add ho jayenge
  },
);

userSchema.pre("save", async function () {
  //Ye middleware hai jo save hone se pehle run hota hai.

  if (!this.isModified("password")) {
    //Agar password update nahi hua hai to hash nahi karega.
    return;
  }

  const hash = await bcrypt.hash(this.password, 10); //Ye password ko hash karta hai.
  this.password = hash; //Original password ko replace karke hashed password store kar diya.

  return; //Middleware ko next step par move karne ke liye
});

//Ye login ke time password verify karta hai. User jo password enter karta hai usko database ke hashed password se compare karta hai.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

//index database me automatically hota hi hai B+ tree search ko fast bnane vala 
//Developer ko sirf index create karna hota hai.
