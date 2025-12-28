const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  // Linking from User table
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String, // like "Momos", "Petrol"
    required: true,
  },
  amount: {
    type: Number, //  100, 500
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Travel", "Fuel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Groceries", "General"],
    default: "General"
  },
  mode: {
    type: String,
    enum: ["Cash", "Online"],
    default: "Cash",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
