import Car from "../models/carRegistrationModel.js";

// ➕ Add New Car (Admin)
export const addCar = async (req, res) => {
  try {
    const {
      carName,
      carNumber,
      carColor,
      ownerName,
      registrationDate,
      notes,
    } = req.body;

    // 🔥 Validation
    if (!carName || !carNumber || !carColor || !ownerName || !registrationDate) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // 🔍 Check duplicate car number
    const existingCar = await Car.findOne({ carNumber });

    if (existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car with this number already exists",
      });
    }

    // 🚀 Create new car
    const newCar = await Car.create({
      carName,
      carNumber,
      carColor,
      ownerName,
      registrationDate,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });

  } catch (error) {
    console.log("ADD CAR ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getCars = async (req, res) => {
  try {
    const { carNumber, page = 1, limit = 20 } = req.query;

    let filter = {};

    // 🔍 search by carNumber
if (carNumber) {
  filter = {
    $or: [
      { carNumber: { $regex: carNumber, $options: "i" } },
      { carName: { $regex: carNumber, $options: "i" } },
      { ownerName: { $regex: carNumber, $options: "i" } },
      { carColor: { $regex: carNumber, $options: "i" } },
      { notes: { $regex: carNumber, $options: "i" } },
    ],
  };
}

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // 📊 total count (pagination ke liye)
    const totalCars = await Car.countDocuments(filter);

    const cars = await Car.find(filter)
      .sort({ createdAt: -1 }) // 🔥 latest first
      .skip(skip)
      .limit(limitNumber);

  

    res.status(200).json({
      success: true,
      total: totalCars,
      page: pageNumber,
      totalPages: Math.ceil(totalCars / limitNumber),
      count: cars.length,
      cars,
    });

  } catch (error) {
    console.log("GET CARS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};