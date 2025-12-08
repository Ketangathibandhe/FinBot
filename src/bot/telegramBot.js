const { Telegraf } = require('telegraf');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { analyzeExpenseText } = require('../services/aiService');
// Token form .env
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// linking logic (/start 123456)
bot.start(async (ctx) => {
    try {
        const message = ctx.message.text; // e.g:"/start 849201"
        const code = message.split(' ')[1]; // separate "849201" 
        // if user hit /start without code
        if (!code) {
            return ctx.reply('Welcome to FinBot!\nTo link your account, go to the Website > Login > Get Code, and send it here like:\n/start 123456');
        }

        // find the user in DB through code
        const user = await User.findOne({ verificationCode: code });

        if (!user) {
            return ctx.reply('Invalid or Expired Code! Please generate a new one from the website.');
        }

        // SUCCESS: got user and now save telegram id 
        user.telegramChatId = ctx.chat.id.toString();
        user.verificationCode = null; // delete code(One-time use)
        await user.save();

        ctx.reply(`Account Linked Successfully!\nHello ${user.name}, I am ready.\n\nTry sending an expense: "100 Momos"`);

    } catch (err) {
        console.log("Bot Error:", err);
        ctx.reply("Something went wrong. Please try again.");
    }
});

// EXPENSE ADDING LOGIC (Text Message)
bot.on('text', async (ctx) => {
    try {
        const chatId = ctx.chat.id.toString();
        const text = ctx.message.text; // User message (e.g;"100 Momos")

        // Check if user linked or not
        const user = await User.findOne({ telegramChatId: chatId });

        if (!user) {
            return ctx.reply('You are not linked! Please login to the website first.');
        }

        const processingMsg = await ctx.reply('Analyzing...');
        
        const expenseData = await analyzeExpenseText(text);
        if (!expenseData) {
            return ctx.telegram.editMessageText(chatId, processingMsg.message_id, null, "Could not understand. Try format: '100 Momos'");
        }

        // Save to Database
       await Expense.create({
            user: user._id,
            title: expenseData.item,
            amount: expenseData.amount,
            category: expenseData.category,
            mode: expenseData.mode
        });

        const replyText = `Expense Added!\nItem: ${expenseData.item}\nAmount: ₹${expenseData.amount}\nCategory: ${expenseData.category}\nMode: ${expenseData.mode}`;
        //edit processing message and show final result
        ctx.telegram.editMessageText(chatId, processingMsg.message_id, null, replyText);
    } catch (err) {
        console.log("Expense Error:", err);
        ctx.reply("Error adding expense.");
    }
});

module.exports = bot;