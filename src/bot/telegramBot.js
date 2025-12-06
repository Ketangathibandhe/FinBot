const { Telegraf } = require('telegraf');
const User = require('../models/User');
const Expense = require('../models/Expense');

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
        ctx.reply("⚠️ Something went wrong. Please try again.");
    }
});

// EXPENSE ADDING LOGIC (Text Message)
bot.on('text', async (ctx) => {
    try {
        const chatId = ctx.chat.id.toString();
        const text = ctx.message.text; // User message (e.g. "100 Momos")

        // Check if user linked or not
        const user = await User.findOne({ telegramChatId: chatId });

        if (!user) {
            return ctx.reply('You are not linked! Please login to the website first.');
        }

        // Simple Logic: "100 Momos" -> Amount = 100, Title = "Momos"
        const parts = text.split(' ');
        const amount = parseFloat(parts[0]); 
        const title = parts.slice(1).join(' ');

        // Validation
        if (isNaN(amount) || !title) {
            return ctx.reply('⚠️ Format is not correct!\nSend like: "Amount Item"\nExample: 100 Petrol');
        }

        // Save to Database
        await Expense.create({
            user: user._id,
            title: title,
            amount: amount,
            category: "General"
        });

        ctx.reply(`Saved: ₹${amount} for "${title}"`);

    } catch (err) {
        console.log("Expense Error:", err);
        ctx.reply("Error adding expense.");
    }
});

module.exports = bot;