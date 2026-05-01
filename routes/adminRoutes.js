import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import { addCar,getCars,updateCar } from "../controllers/carRegistrationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { addTrip,getTrips,updateTrip,deleteTrip,getLogsSummary } from "../controllers/carRecordController.js";

const router = express.Router();

// 🔐 Login
router.post("/login", loginAdmin);

// 🚗 Add Car (Protected)
router.post("/add-car", authMiddleware, addCar);
router.get("/cars", authMiddleware, getCars);
router.post("/add-trip", authMiddleware, addTrip);
router.get("/trips/:carId", authMiddleware, getTrips);
router.put("/trip/:id", updateTrip);
router.delete("/trip/:id", deleteTrip);
router.put("/car/:id", authMiddleware, updateCar);
router.get("/logs-summary/:carId", getLogsSummary);


export default router;