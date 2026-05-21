const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const Expense = require('../models/Expense');
const { userAuth } = require('../middleware/auth');
const { analyzeExpense } = require('../services/aiService'); 

//Saves file in memory temporarily
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

//  ADD EXPENSE 
router.post("/add", userAuth, upload.single("receipt"), async (req, res) => {
    try {
        const { amount, title, category, date } = req.body;
        let expenseData = {};

        // Case A: Receipt Upload
        if (req.file) {
            const aiData = await analyzeExpense(null, req.file.buffer);

             if (!aiData) {
                return res.status(400).json({ success: false, message: "AI failed to read receipt. Please try manual entry." });
            }

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
            if (!amount || !title) return res.status(400).json({ success: false, message: "Amount & Title required!" });
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
            ...expenseData    
        });

        await newExpense.save();
        res.json({ success: true, message: "Expense Added Successfully!", data: newExpense });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
});

//  EDIT EXPENSE 
router.put("/edit/:id", userAuth, async (req, res) => {
    try {
        const { title, amount, category, mode, date } = req.body;

        // Only update fields that were sent
        const updateFields = {};
        if (title) updateFields.title = title;
        if (amount) updateFields.amount = parseFloat(amount);
        if (category) updateFields.category = category;
        if (mode) updateFields.mode = mode;
        if (date) updateFields.date = new Date(date);

        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // Ensures user owns the expense
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) return res.status(404).json({ success: false, message: "Expense not found!" });

        res.json({ success: true, message: "Expense Updated Successfully!", data: updatedExpense });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error: " + err.message });
    }
});

//  GET USER EXPENSES (Current Month Only) 
router.get("/user-expenses", userAuth, async (req, res) => {
    try {
        const { start, end } = getCurrentMonthRange(); 
        
        const expenses = await Expense.find({ 
            user: req.user._id,
            date: { $gte: start, $lte: end } 
        }).sort({ date: -1 });
        
        res.json({ success: true, message: "Fetched Successfully", data: expenses });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error: " + err.message });
    }
});

//  DELETE EXPENSE 
router.delete("/delete/:id", userAuth, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!deletedExpense) return res.status(404).json({ success: false, message: "Expense not found!" });

        res.json({ success: true, message: "Expense Deleted Successfully!" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error: " + err.message });
    }
});

//  GET STATS 
router.get("/stats", userAuth, async (req, res) => {
    try {
        const { start, end } = getCurrentMonthRange();
        const filter = { user: req.user._id, date: { $gte: start, $lte: end } };
        
        //Promise.all used so that all three queries run in parallel
        const [categoryStats, dailyStats, modeStats] = await Promise.all([
            Expense.aggregate([
                { $match: filter },
                { $group: { _id: "$category", total: { $sum: "$amount" } } }
            ]),
            Expense.aggregate([
                { $match: filter },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: "$amount" } } },
                { $sort: { _id: 1 } }
            ]),
            Expense.aggregate([
                { $match: filter },
                { $group: { _id: "$mode", total: { $sum: "$amount" } } }
            ])
        ]);

        const totalExpense = categoryStats.reduce((acc, curr) => acc + curr.total, 0);

        res.json({ success: true, categoryStats, dailyStats, totalExpense, modeStats });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;