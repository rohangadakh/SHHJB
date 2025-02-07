import { GoogleGenerativeAI } from "@google/generative-ai";

export const checkAbusiveLanguage = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyADz_RxDNz92h1MkoBP7O_dsv8f3ZFx7I4");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Check the following text for abusive language. Return "true" if abusive language is detected. Return "false" if no abusive language is detected. Text: "${text}"`;
    const result = await model.generateContent(prompt);

    const resultText = result?.response?.text()?.trim();

    return resultText === "true"; // Returns `true` if abusive language is detected
  } catch (err) {
    console.error("Error checking for abusive language:", err);
    throw new Error("Failed to analyze text. Please try again.");
  }
};
