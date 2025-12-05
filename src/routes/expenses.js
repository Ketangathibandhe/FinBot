const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Expense Model
const { userAuth } = require('../middleware/auth'); // Auth Middleware

// POST /add - to add new expense
router.post("/add", userAuth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    // Validation
    if (!title || !amount) {
      throw new Error("Please enter Title and Amount!");
    }

    // new expense
    const newExpense = new Expense({
      user: req.user._id, // Logged in user ID
      title,
      amount,
      category: category || "General"
    });

    await newExpense.save();

    res.json({ message: "Expense Added Successfully!", data: newExpense });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// GET /user-expenses - to see all expenses of loggedin user
router.get("/user-expenses", userAuth, async (req, res) => {
  try {
    // only find the expenses of user who is loggedin 
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 }); //sorting for Newest first

    res.json({ message: "All Expenses Fetched", data: expenses });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// DELETE /delete/:id - to delete expense
router.delete("/delete/:id", userAuth, async (req, res) => {
  try {
    const expenseId = req.params.id;

    // checks if the expense exist and is of same loggedin user and delete it 
    const deletedExpense = await Expense.findOneAndDelete({
        _id: expenseId,
        user: req.user._id
    });
    if (!deletedExpense) {
        return res.status(404).send("Expense not found or unauthorized!");
    }
    res.json({ message: "Expense Deleted Successfully!" });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;