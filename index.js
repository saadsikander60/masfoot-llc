import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js"
import cors from "cors";

dotenv.config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;
   
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected");

   
  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

  } catch (err) {
    console.log("❌ DB Error:", err);
  }
};
// middleware
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);


// 🔥 ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("ERROR:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong"
  });
});


startServer();