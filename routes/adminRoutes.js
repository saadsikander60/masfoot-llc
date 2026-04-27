import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import { addCar,getCars } from "../controllers/carRegistrationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { addTrip,getTrips } from "../controllers/carRecordController.js";

const router = express.Router();

// 🔐 Login
router.post("/login", loginAdmin);

// 🚗 Add Car (Protected)
router.post("/add-car", authMiddleware, addCar);
router.get("/cars", authMiddleware, getCars);
router.post("/add-trip", authMiddleware, addTrip);
router.get("/trips/:carId", authMiddleware, getTrips);


export default router;