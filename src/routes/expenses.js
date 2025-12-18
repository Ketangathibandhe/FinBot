const express = require('express');
const router = express.Router();
const multer = require('multer'); // Used for file uploads
const Expense = require('../models/Expense');
const { userAuth } = require('../middleware/auth');
const { analyzeExpense } = require('../services/aiService'); 

// Setup file upload (Saves file in memory temporarily)
const upload = multer({ storage: multer.memoryStorage() });

// Get Start & End Date of Current Month 
const getCurrentMonthRange = () => {
    const now = new Date();
    // 1st day of current month (e.g., 1st Dec 00:00:00)
    const start = new Date(now.getFullYear(), now.getMonth(), 1); 
    // Last day of current month (e.g., 31st Dec 23:59:59)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59); 
    return { start, end };
};

// ADD EXPENSE API
router.post("/add", userAuth, upload.single("receipt"), async (req, res) => {
    try {
        const { amount, title, category, date } = req.body;
        let expenseData = {};

        // Case A: Receipt Upload
        if (req.file) {
            console.log("Analyzing Receipt with AI...");
            const aiData = await analyzeExpense(null, req.file.buffer);

            if (!aiData) {
                return res.status(400).send("AI failed to read receipt. Please try manual entry.");
            }

            // Determine Mode: If AI detects 'Online', use it. Otherwise default to 'Cash'.
            const detectedMode = (aiData.mode && aiData.mode.toLowerCase() === 'online') ? 'Online' : 'Cash';

            expenseData = {
                title: aiData.item || "Scanned Receipt",
                amount: aiData.amount,
                category: aiData.category || "General",
                mode: detectedMode, 
                date: new Date()
            };
        } 
        // Case B: Manual Entry
        else {
            if (!amount || !title) {
                return res.status(400).send("Please enter Amount and Title!");
            }
            expenseData = {
                title: title,
                amount: parseFloat(amount),
                category: category || "General",
                mode: "Cash", // Default to Cash
                date: date ? new Date(date) : new Date()
            };
        }

        // Save to DB
        const newExpense = new Expense({
            user: req.user._id,        
            title: expenseData.title,   
            amount: expenseData.amount,  
            category: expenseData.category,
            mode: expenseData.mode,      
            date: expenseData.date       
        });

        await newExpense.save();
        res.json({ message: "Expense Added Successfully!", data: newExpense });

    } catch (err) {
        console.error("Add Expense Error:", err);
        res.status(500).send("Server Error: " + err.message);
    }
});

// GET USER EXPENSES (Filtered by Current Month)
router.get("/user-expenses", userAuth, async (req, res) => {
    try {
        const { start, end } = getCurrentMonthRange(); 
        const userId = req.user._id;
        
        // Find expenses for this user ONLY for current month
        const expenses = await Expense.find({ 
            user: userId,
            date: { $gte: start, $lte: end } 
        }).sort({ date: -1 });
        
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

// GET STATS (UPDATED FOR DASHBOARD)
router.get("/stats", userAuth, async (req, res) => {
    try {
        const { start, end } = getCurrentMonthRange();
        const userId = req.user._id;

        // Category Stats (For Pie Chart)
        const categoryStats = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: start, $lte: end } } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);

        // Daily Stats (For Area Graph)
        const dailyStats = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: start, $lte: end } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                    total: { $sum: "$amount" } 
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        // Mode Stats (Cash vs Online)
        const modeStats = await Expense.aggregate([
            { $match: { user: userId, date: { $gte: start, $lte: end } } },
            { $group: { _id: "$mode", total: { $sum: "$amount" } } }
        ]);

        // Total Amount Spent This Month
        const totalExpense = categoryStats.reduce((acc, curr) => acc + curr.total, 0);

        // Sending all data
        res.json({ categoryStats, dailyStats, totalExpense, modeStats });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;