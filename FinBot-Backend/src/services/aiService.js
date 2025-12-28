const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const analyzeExpense = async (text, imageBuffer) => {
  try {
    let prompt = "";

    // for photo (Receipt)
    if (imageBuffer) {
      prompt = `
            Scan this receipt image.
            
            Rules:
            1. Item: Find Shop or Restaurant Name.
            2. Amount: Find Final Total. (IMPORTANT: Send ONLY Number, Example: 150. No '₹' or '$')
            3. Category: Food, Travel, Shopping, etc.

                  STRICT RULE FOR CATEGORY:
                  You MUST classify the expense into ONE of these exact categories:
                  ["Food", "Travel", "Fuel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Groceries", "General"]
      
                  - If it is petrol/diesel => Use "Fuel".
                  - If it is Uber/Train/Bus => Use "Travel".
                  - If it is Vegetables/Ration => Use "Groceries".
                  - If unclear => Use "General".

            4. Mode: Cash or Online. Default mode will be Cash.

            Reply in JSON: { "item": "Name", "amount": 0, "category": "Type", "mode": "Type" }
            `;
    }
    // for text
    else {
      prompt = `
            Analyze this text: "${text}"
            
            Rules:
            1. Item: What was bought?
            2. Amount: Price. (IMPORTANT: Send ONLY Number. Example: 100)
            3. Category: Food, Travel, etc.

                STRICT RULE FOR CATEGORY:
                  You MUST classify the expense into ONE of these exact categories:
                  ["Food", "Travel", "Fuel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Groceries", "General"]
                    
                  - If it is petrol/diesel => Use "Fuel".
                  - If it is Uber/Train/Bus => Use "Travel".
                  - If it is Vegetables/Ration => Use "Groceries".
                  - If unclear => Use "General".

            4. Mode: Cash or Online. Default mode will be Cash.

            Reply in JSON: { "item": "Name", "amount": 0, "category": "Type", "mode": "Type" }
            `;
    }

    const parts = [{ text: prompt }];

    // if image the attach
    if (imageBuffer) {
      parts.push({
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: "image/jpeg",
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;

    let textResponse = response.text();
    console.log("AI Output:", textResponse);

    // removes Markdown
    textResponse = textResponse.replace(/```json|```/g, "").trim();
    // String to Object
    const data = JSON.parse(textResponse);

    return data;
  } catch (error) {
    console.log("AI Error:", error.message);
    return null;
  }
};

module.exports = { analyzeExpense };
