const PDFDocument = require("pdfkit-table");
const fs = require("fs");

const generateReport = async (userName, expenses) => {
  return new Promise((resolve, reject) => {
    // create PDF Document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const fileName = `Statement_${Date.now()}.pdf`;

    // stream for saving File
    const stream = fs.createWriteStream(fileName);
    doc.pipe(stream);

    // Heading
    doc.fontSize(20).text("FinBot Monthly Statement", { align: "center" });
    doc.moveDown(); // next line
    doc.fontSize(12).text(`Name: ${userName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // sort data Latest Date First
    // [...expenses] is used so that original array doesnot mutate
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // form Table Data
    const table = {
      title: "Expense Details",
      headers: ["Date", "Item", "Category", "Mode", "Amount"],
      rows: sortedExpenses.map((item) => [
        new Date(item.date).toISOString().split("T")[0], // Safe Date formatting
        item.title,
        item.category,
        item.mode,
        `Rs. ${item.amount}`,
      ]),
    };

    // Draw Table
    doc.table(table, {
      width: 500,
    });

    // Total Amount
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total Expense: Rs. ${total}`, { align: "right", color: "red" });

    // close PDF
    doc.end();
    // once file is ready send back the path
    stream.on("finish", () => resolve(fileName));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = { generateReport };
