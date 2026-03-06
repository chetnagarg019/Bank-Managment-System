import express from "express";
import authControllers from "../controllers/authControllers.js";
const router  = express.Router();

router.post("/register",authControllers.registerUser);

export default router;


