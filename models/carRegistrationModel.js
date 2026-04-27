import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: true,
      trim: true,
    },
    carNumber: {
      type: String,
      required: true,
      unique: true, // duplicate na ho
      uppercase: true, // ABC123 format
      trim: true,
    },
    carColor: {
      type: String,
      trim: true,
    },
    ownerName: {
      type: String,
      trim: true,
    },
    registrationDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);

export default mongoose.model("Car", carSchema);