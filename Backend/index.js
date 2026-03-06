import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectedDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

connectedDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended : true })); // middleware 

app.get("/", (req, res) => {
  res.send("Server can connected");
});

app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
