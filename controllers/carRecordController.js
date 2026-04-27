import Trip from "../models/tripRecordModel.js";
import Car from "../models/carRegistrationModel.js";

// ➕ Add Trip Record
export const addTrip = async (req, res) => {
  try {
    const {
      carId,
      date,
      location,
      amount,
      expense,
      invoice,
      
    } = req.body;

    // 🔥 Validation
    if (
      !carId ||
      !date ||
      !location ||
      !amount ||
      !expense ||
      !invoice
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // 🔍 Check car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // 📈 Profit calculate
    const profit = amount - expense;

    // 🚀 Create Trip
    const trip = await Trip.create({
      carId,
      date,
      location,
      amount,
      expense,
      invoice,
     
      profit,
    });

    res.status(201).json({
      success: true,
      message: "Trip added successfully",
      trip,
    });

  } catch (error) {
    console.log("ADD TRIP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export const getTrips = async (req, res) => {
  try {
    const { carId } = req.params;
    const { invoice } = req.query;

    let filter = {};

    // 🔗 specific car
    if (carId) {
      filter.carId = carId;
    }

    // 🔍 invoice search (single ya multiple)
    if (invoice) {
      filter.invoice = {
        $regex: invoice,
        $options: "i",
      };
    }

    const trips = await Trip.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });

  } catch (error) {
    console.log("GET TRIPS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};