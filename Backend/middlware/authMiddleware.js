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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id || decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid token user" });
        }
        req.user = user;
        return next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({ message: 'Unauthorized - invalid token' });
    }

}

export default { authMiddleware}