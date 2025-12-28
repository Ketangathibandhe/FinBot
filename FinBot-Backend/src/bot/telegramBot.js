const { Telegraf } = require("telegraf");
const axios = require("axios");
const User = require("../models/User");
const Expense = require("../models/Expense");
const { analyzeExpense } = require("../services/aiService");

const fs = require("fs");
const { generateReport } = require("../services/pdfService");

// Token form .env
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// linking logic (/start 123456)
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

    // find the user in DB through code
    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      return ctx.reply(
        "Invalid or Expired Code! Please generate a new one from the website."
      );
    }

    // SUCCESS: got user and now save telegram id
    user.telegramChatId = ctx.chat.id.toString();
    user.verificationCode = null; // delete code(One-time use)
    await user.save();

    ctx.reply(
      `Account Linked Successfully!\nHello ${user.name}, I am ready.\n\nTry sending an expense: "spent 100 for petrol",\nOr if you want to download monthly expense report try /report command"`
    );
  } catch (err) {
    console.log("Bot Error:", err);
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

    // fetching expense for current month 
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // 1st date of the month 

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: startOfMonth },
    }).sort({ date: 1 });

    if (expenses.length === 0) {
      return ctx.reply("No expenses found this month!");
    }

    // call PDF Function 
    const pdfPath = await generateReport(user.name, expenses);

    // send the pdf to user 
    await ctx.replyWithDocument({
      source: pdfPath,
      filename: "Monthly_Report.pdf",
    });

    // delete from server  
    fs.unlinkSync(pdfPath);
  } catch (err) {
    console.log("Report Error:", err);
    ctx.reply("Error generating report.");
  }
});

// EXPENSE ADDING LOGIC (Text Message)
bot.on("text", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const text = ctx.message.text; // User message (e.g;"100 Momos")

    //if message starts with '/' dont think it as Expense 
    if (text.startsWith("/")) return;

    // Check if user linked or not
    const user = await User.findOne({ telegramChatId: chatId });

    if (!user) {
      return ctx.reply(
        "You are not linked! Please login to the website first."
      );
    }

    const processingMsg = await ctx.reply("Analyzing...");

    // processing text
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

    const replyText = `Expense Added!\nItem: ${expenseData.item}\nAmount: ${expenseData.amount}\nCategory: ${expenseData.category}\nMode: ${expenseData.mode}`;

    //edit processing message and show final result
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
    console.log("Expense Error:", err);
    ctx.reply("Error adding expense.");
  }
});

// expense adding logic for (Photo/Image)

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
        "Could not read the bill.Try again later."
      );
    }

    const savedExpense = await Expense.create({
      user: user._id,
      title: expenseData.item || "Scanned Receipt",
      amount: expenseData.amount || 0,
      category: expenseData.category || "General",
      mode: expenseData.mode || "Unknown",
    });

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
    console.log("Image Error:", err);
    ctx.reply("Error processing image.");
  }
});

// delete button logic
bot.on("callback_query", async (ctx) => {
  try {
    const data = ctx.callbackQuery.data; // e.g.;"DELETE_65a43f..."

    // if data starts with "DELETE_"
    if (data.startsWith("DELETE_")) {
      // extract ID
      const expenseId = data.split("_")[1];

      // delete from DB
      await Expense.findByIdAndDelete(expenseId);

      await ctx.answerCbQuery("Expense Deleted!");

      // update Message
      await ctx.editMessageText("Expense Deleted Successfully!");
    }
  } catch (err) {
    console.log("Delete Error:", err);
    ctx.answerCbQuery("Error deleting expense.");
  }
});



module.exports = bot;
