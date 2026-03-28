import express from "express";
import authControllers from "../controllers/authControllers.js";
const router  = express.Router();

//api/auth/register
router.post("/register",authControllers.registerUser); //user account created
router.post("/login",authControllers.loginUser);



export default router;

