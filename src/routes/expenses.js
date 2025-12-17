const express = require('express');
const router = express.Router();
const multer = require('multer'); // Used for file uploads
const Expense = require('../models/Expense');
const { userAuth } = require('../middleware/auth');
const { analyzeExpense } = require('../services/aiService'); 

// Setup file upload (Saves file in memory temporarily)
const upload = multer({ storage: multer.memoryStorage() });

// ADD EXPENSE API (Handles both Manual Entry & Receipt Upload)
router.post("/add", userAuth, upload.single("receipt"), async (req, res) => {
    try {
        // Extract data sent from frontend
        const { amount, title, category, date } = req.body;
        
        let expenseData = {};

        // If User Uploaded a Photo (Receipt)
        if (req.file) {
            console.log("Analyzing Receipt with AI...");
            
            // Send image to AI Service
            const aiData = await analyzeExpense(null, req.file.buffer);

            // If AI fails to read
            if (!aiData) {
                return res.status(400).send("AI failed to read receipt. Please try manual entry.");
            }

            // If AI detects 'Online', use it. Otherwise default to 'Cash'.
            const detectedMode = (aiData.mode && aiData.mode.toLowerCase() === 'online') ? 'Online' : 'Cash';

            // Fill data from AI result
            expenseData = {
                title: aiData.item || "Scanned Receipt",
                amount: aiData.amount,
                category: aiData.category || "General",
                mode: detectedMode, 
                date: new Date() // Use current date for receipts
            };
        } 
        
        // If User Entered Manually (Form Data) 
        else {
            // Validation
            if (!amount || !title) {
                return res.status(400).send("Please enter Amount and Title!");
            }

            // Fill data from Form inputs
            expenseData = {
                title: title,
                amount: parseFloat(amount),
                category: category || "General",
                mode: "Cash", // Default to Cash for manual entry
                date: date ? new Date(date) : new Date()
            };
        }

        // Save to Database
        const newExpense = new Expense({
            user: req.user._id,         
            title: expenseData.title,   
            amount: expenseData.amount,  
            category: expenseData.category,
            mode: expenseData.mode,      // 'Cash' or 'Online'
            date: expenseData.date       // Date of expense
        });

        await newExpense.save();

        res.json({ message: "Expense Added Successfully!", data: newExpense });

    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

// GET ALL EXPENSES (Sorted by Newest First)
router.get("/user-expenses", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
      
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
        
        res.json({ message: "Fetched Successfully", data: expenses });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// DELETE EXPENSE
router.delete("/delete/:id", userAuth, async (req, res) => {
    try {
        const expenseId = req.params.id;
        const userId = req.user._id;

        // Find and delete (Ensures user can only delete their own expense)
        const deletedExpense = await Expense.findOneAndDelete({
            _id: expenseId,
            user: userId
        });

        if (!deletedExpense) {
            return res.status(404).send("Expense not found or unauthorized!");
        }

        res.json({ message: "Expense Deleted Successfully!" });
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

// GET STATS (For Charts)
router.get("/stats", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;

        // Group expenses by 'category' and sum up the amounts
        const categoryStats = await Expense.aggregate([
            { $match: { user: userId } }, // Filter by user
            { $group: { _id: "$category", total: { $sum: "$amount" } } } // Group logic
        ]);

        res.json({ data: categoryStats });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;