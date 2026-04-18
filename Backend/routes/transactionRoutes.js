import express from "express";
import transactionController from "../controllers/transactionController.js";
import authMiddleware from "../middlware/authMiddleware.js";
import transactionController from "../controllers/transactionController.js";
const router = express.Router();

router.post("/", authMiddleware.authMiddleware,transactionController.createTransaction);

// post /api/

export default router;
//half code is completed 