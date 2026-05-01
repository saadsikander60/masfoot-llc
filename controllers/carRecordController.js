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
    const { invoice, month, year } = req.query;

    let filter = {};

    // 🔗 specific car
    if (carId) {
      filter.carId = carId;
    }

    // 🔍 invoice search
    if (invoice && invoice.trim() !== "") {
      filter.invoice = {
        $regex: invoice,
        $options: "i",
      };
    }

    // 📅 month + year filter (FIXED)
    if (month) {
      const selectedMonth = parseInt(month);
      const selectedYear = year ? parseInt(year) : new Date().getFullYear();

      // ❌ invalid month check
      if (selectedMonth < 1 || selectedMonth > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid month",
        });
      }

      const start = new Date(selectedYear, selectedMonth - 1, 1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
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

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      carId,
      date,
      location,
      amount,
      expense,
      invoice,
    } = req.body;

    // 🔍 Check trip exists
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    // 🚗 Validate car (if changed)
    if (carId && carId !== trip.carId.toString()) {
      const car = await Car.findById(carId);
      if (!car) {
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }
      trip.carId = carId;
    }

    // 🔁 Invoice duplicate check
    if (invoice && invoice !== trip.invoice) {
      const existing = await Trip.findOne({ invoice });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Invoice already exists",
        });
      }
      trip.invoice = invoice;
    }

    // 📝 Update fields (partial update)
    if (date) trip.date = date;
    if (location) trip.location = location;
    if (amount != null) trip.amount = amount;
    if (expense != null) trip.expense = expense;

    // 📈 Recalculate profit if needed
    if (amount != null || expense != null) {
      trip.profit = Number(trip.amount) - Number(trip.expense);
    }

    await trip.save();

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip,
    });

  } catch (error) {
    console.log("UPDATE TRIP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });

  } catch (error) {
    console.log("DELETE TRIP ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const getLogsSummary = async (req, res) => {
  try {
    const { carId } = req.params;
    const { month, year } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month required",
      });
    }

    const selectedMonth = parseInt(month);
    const selectedYear = year ? parseInt(year) : new Date().getFullYear();

    const start = new Date(selectedYear, selectedMonth - 1, 1);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const trips = await Trip.find({
      carId,
      date: {
        $gte: start,
        $lt: end,
      },
    });

    // 🔥 totals calculate
    let totalAmount = 0;
    let totalExpense = 0;
    let totalProfit = 0;

    trips.forEach((trip) => {
      totalAmount += trip.amount || 0;
      totalExpense += trip.expense || 0;
      totalProfit += trip.profit || 0;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      totalExpense,
      totalProfit,
    });

  } catch (error) {
    console.log("LOGS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};