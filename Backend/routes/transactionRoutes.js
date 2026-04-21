import express from "express";
import transactionController from "../controllers/transactionController.js";
import authMiddleware from "../middlware/authMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware.authMiddleware,transactionController.createTransaction);

// post     /api/transaction/system/initial-funds
//create initial funds transaction from system user 

router.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

export default router;