import express from "express";
import transactionController from "../controllers/transactionController.js";
import authMiddleware from "../middlware/authMiddleware.js";
const router = express.Router();

transactionRoutes.post("/",authMiddleware.authMiddleware)

export default router;