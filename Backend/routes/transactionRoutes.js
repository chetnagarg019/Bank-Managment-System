import express from "express";
import transactionController from "../controllers/transactionController.js";
import authMiddleware from "../middlware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware.authMiddleware,transactionController.createTransaction);

export default router;