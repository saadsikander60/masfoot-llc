import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    // 🔗 Car reference
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    // 📅 Date
    date: {
      type: Date,
      required: true,
    },

    // 📍 Location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // 💰 Total amount
    amount: {
      type: Number,
      required: true,
    },

    // 💸 Expense
    expense: {
      type: Number,
      required: true,
    },

    // 🧾 Invoice (NOW REQUIRED)
    invoice: {
      type: String,
      required: true,
      trim: true,
    },

   

    // 📈 Profit (backend calculate karega)
    profit: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
const Trip =
  mongoose.models.Trip ||
  mongoose.model("Trip", tripSchema);



export default Trip;