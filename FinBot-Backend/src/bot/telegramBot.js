const { Telegraf } = require("telegraf");
const axios = require("axios");
const User = require("../models/User");
const Expense = require("../models/Expense");
const { analyzeExpense } = require("../services/aiService");

const fs = require("fs");
const { generateReportForBot } = require("../routes/reports");


// Wrap everything in a function that accepts 'io'
module.exports = (io) => {
// Token from .env
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// LINKING LOGIC (/start 123456) 
bot.start(async (ctx) => {
  try {
    const message = ctx.message.text; // e.g:"/start 849201"
    const code = message.split(" ")[1]; // separate "849201"
    // if user hit /start without code
    if (!code) {
      return ctx.reply(
        "Welcome to FinBot!\nTo link your account, go to the Website > Login > Get Code, and send it here like:\n/start 123456"
      );
    }

    // Find the user in DB through code (with expiry check)
    const user = await User.findOne({ 
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() } // Code must not be expired
    });

    if (!user) {
      return ctx.reply(
        "Invalid or Expired Code! Please generate a new one from the website."
      );
    }

    // SUCCESS: got user and now save telegram id
    user.telegramChatId = ctx.chat.id.toString();
    user.verificationCode = null; // delete code (One-time use)
    user.verificationCodeExpires = null;
    await user.save();

    // Notify frontend that user is linked
    io.to(user._id.toString()).emit("user-linked");

    ctx.reply(
      `Account Linked Successfully!\nHello ${user.name}, I am ready.\n\nTry sending an expense: "spent 100 for petrol",\nOr if you want to download monthly expense report try /report command`
    );
  } catch (err) {
    ctx.reply("Something went wrong. Please try again.");
  }
});



// REPORT COMMAND (/report)
bot.command("report", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const user = await User.findOne({ telegramChatId: chatId });

    if (!user) return ctx.reply("Please link your account first.");

    await ctx.reply("Making your PDF... wait a sec.");

    // Use the shared report generator (same design as web)
    const now = new Date();
    const pdfPath = await generateReportForBot(
      user._id, 
      user.name, 
      now.getMonth() + 1, // current month (1-12)
      now.getFullYear()
    );

    if (!pdfPath) {
      return ctx.reply("No expenses found this month!");
    }

    // Send the pdf to user 
    await ctx.replyWithDocument({
      source: pdfPath,
      filename: "Monthly_Report.pdf",
    });

    // Delete from server  
    fs.unlinkSync(pdfPath);
  } catch (err) {
    ctx.reply("Error generating report.");
  }
});

// EXPENSE ADDING LOGIC (Text Message)
bot.on("text", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const text = ctx.message.text; // User message (e.g;"100 Momos")

    // If message starts with '/' don't think it as Expense 
    if (text.startsWith("/")) return;

    // Check if user linked or not
    const user = await User.findOne({ telegramChatId: chatId });

    if (!user) {
      return ctx.reply(
        "You are not linked! Please login to the website first."
      );
    }

    const processingMsg = await ctx.reply("Analyzing...");

    // Processing text
    const expenseData = await analyzeExpense(text);

    if (!expenseData) {
      return ctx.telegram.editMessageText(
        chatId,
        processingMsg.message_id,
        null,
        "Could not understand. Try format: '100 Momos'"
      );
    }

    // Save to Database
    const savedExpense = await Expense.create({
      user: user._id,
      title: expenseData.item,
      amount: expenseData.amount,
      category: expenseData.category,
      mode: expenseData.mode,
    });

    io.to(user._id.toString()).emit("expense-updated");

    const replyText = `Expense Added!\nItem: ${expenseData.item}\nAmount: ₹${expenseData.amount}\nCategory: ${expenseData.category}\nMode: ${expenseData.mode}`;

    // Edit processing message and show final result
    await ctx.telegram.editMessageText(
      chatId,
      processingMsg.message_id,
      null,
      replyText,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Delete", callback_data: `DELETE_${savedExpense._id}` }],
          ],
        },
      }
    );
  } catch (err) {
    ctx.reply("Error adding expense.");
  }
});

// EXPENSE ADDING LOGIC (Photo/Image)
bot.on("photo", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const user = await User.findOne({ telegramChatId: chatId });

    if (!user)
      return ctx.reply(
        "You are not linked! Please login to the website first."
      );

    const processingMsg = await ctx.reply("Scanning Receipt...");

    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);

    const response = await axios.get(fileLink.href, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data);
    const caption = ctx.message.caption || "";

    const expenseData = await analyzeExpense(caption, imageBuffer);

    if (!expenseData) {
      return ctx.telegram.editMessageText(
        chatId,
        processingMsg.message_id,
        null,
        "Could not read the bill. Try again later."
      );
    }

    const savedExpense = await Expense.create({
      user: user._id,
      title: expenseData.item || "Scanned Receipt",
      amount: expenseData.amount || 0,
      category: expenseData.category || "General",
      mode: expenseData.mode || "Cash",
    });
    
    // Emit event to specific User Room
    io.to(user._id.toString()).emit("expense-updated");

    const replyText = `Bill Scanned!\nItem: ${savedExpense.title}\nAmount: ₹${savedExpense.amount}\nCategory: ${savedExpense.category}\nMode: ${savedExpense.mode}`;

    await ctx.telegram.editMessageText(
      chatId,
      processingMsg.message_id,
      null,
      replyText,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Delete", callback_data: `DELETE_${savedExpense._id}` }],
          ],
        },
      }
    );
  } catch (err) {
    ctx.reply("Error processing image.");
  }
});

//  DELETE BUTTON LOGIC (with Authorization Check) 
bot.on("callback_query", async (ctx) => {
  try {
    const data = ctx.callbackQuery.data; // e.g.;"DELETE_65a43f..."

    // If data starts with "DELETE_"
    if (data.startsWith("DELETE_")) {
      // Extract ID
      const expenseId = data.split("_")[1];

      // Get user to verify ownership
      const chatId = ctx.callbackQuery.message.chat.id.toString();
      const user = await User.findOne({ telegramChatId: chatId });

      if (!user) {
        return ctx.answerCbQuery("Please link your account first.");
      }

      // Authorization: only delete if the expense belongs to this user
      const expense = await Expense.findById(expenseId);
      
      if (!expense) {
        return ctx.answerCbQuery("Expense not found.");
      }

      if (expense.user.toString() !== user._id.toString()) {
        return ctx.answerCbQuery("Unauthorized: This expense doesn't belong to you.");
      }

      // Delete from DB
      await Expense.findByIdAndDelete(expenseId);

      // Emit update after delete
      io.to(user._id.toString()).emit("expense-updated");

      await ctx.answerCbQuery("Expense Deleted!");

      // Update Message
      await ctx.editMessageText("Expense Deleted Successfully!");
    }
  } catch (err) {
    ctx.answerCbQuery("Error deleting expense.");
  }
});

return bot;
}
