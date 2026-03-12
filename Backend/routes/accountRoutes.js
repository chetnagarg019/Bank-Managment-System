import express from "express";
import authMiddleware from "../middlware/authMiddleware.js";
import accountControllers from "../controllers/accountControllers.js";
const router = express.Router();

router.post("/",authMiddleware.authMiddleware,accountControllers.createAccount)


export default router;


