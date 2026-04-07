import User from "../model/user.js";
import jwt from  "jsonwebtoken";

async function authMiddleware(req,res,next) {

    // token might be sent in a cookie or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);// ye check krta hai ki token valid hai ya nhi token valid hai ya nhi secret key match ho rhi h ya nhi 
        const user = await User.findById(decoded.id || decoded.userId); // token se user ka id nikalna 
        if (!user) {
            return res.status(401).json({ message: "Invalid token user" }); //Agar user nahi mila → token invalid ❌
        }
        req.user = user; //👉 Ab aage ke routes me directly user access kar sakte ho:
        return next(); //next function call
    } catch (err) { 
        console.error('Auth middleware error:', err.message); //token expired ,token wrong
        return res.status(401).json({ message: 'Unauthorized - invalid token' });
    }

}

export default { authMiddleware }