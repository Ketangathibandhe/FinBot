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

//  Indexes for Performance 
expenseSchema.index({ user: 1, date: -1 }); // Primary query pattern (user expenses by date)
expenseSchema.index({ user: 1, category: 1 }); // Category aggregation queries

module.exports = mongoose.model("Expense", expenseSchema);
