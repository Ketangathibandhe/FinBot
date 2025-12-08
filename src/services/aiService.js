const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const analyzeExpense = async (text) => {
    try {
        const prompt = `
        Analyze this expense text: "${text}".
        Extract the following fields in JSON format only:
        - item (string): What was bought
        - amount (number): Cost
        - category (string): Best fit category (Food, Travel, Bills, Shopping, Misc)
        - mode (string): "Cash" or "Online" (default "Unknown" if not specified)
        
        Example Input: "100 ka petrol dala gpay se"
        Example Output: { "item": "Petrol", "amount": 100, "category": "Travel", "mode": "Online" }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;//raw response
        const textResponse = response.text();

        //cleaning json and parse it (sometime res is in markdown)
        const jsonStr = textResponse.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr); // for converting string to Js object
    } catch (error) {
        console.error("AI Error:", error);
        return null; // Fallback handling 
    }
};

module.exports = { analyzeExpense };