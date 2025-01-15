import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";

const TextOptimization = ({ text, onOptimizedText }) => {
  const [loading, setLoading] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [abusiveDetected, setAbusiveDetected] = useState(false);

  const optimizeText = async () => {
    setLoading(true);
    setAnimateBackground(true);
    setAbusiveDetected(false);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBiNigM3zsxZ2Fl6Kjr6ea9PEMeozpqr6U");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Please check the following text for any abusive language. If any abusive language is detected, return the word 'true'. Do not include any offensive words in the response. If no abusive language is detected, do not return 'false'. Instead, do the following:
      1. Optimize the question for clarity and ease of understanding.
      2. Ensure that any relevant formatting (such as **bold**, *italic*, \`code\`, [link](https://example.com)) is preserved in the optimized text.
      3. If any part of the text can be enhanced with markdown formatting for better readability, feel free to add it.
      
      Return the optimized question, preserving the markdown as it is: ${text}`;

      const result = await model.generateContent(prompt);

      const resultText = result.response.text().toString.trim();

      if (resultText.toLowerCase().startsWith("false")) {
        const optimizedText = resultText.substring(5).trim();
        onOptimizedText(optimizedText);
      } else {
        onOptimizedText(resultText);
      }
    } catch (error) {
      console.error("Error optimizing text:", error);
    } finally {
      setLoading(false);
      setAnimateBackground(false);
    }
  };

  return (
    <div className="flex">
      <motion.button
        className={`text-white rounded-full flex items-center ${abusiveDetected ? 'bg-red-500' : 'bg-zinc-700'}`}
        onClick={optimizeText}
        disabled={loading}
        whileHover={{ rotate: 17 }}
      >
        <motion.div
          className="rounded-full p-3 flex justify-center items-center"
          style={{
            background: animateBackground
              ? "linear-gradient(to right, #a087ff 0%, #d175ff 37%, #ed7ec3 100%)"
              : "transparent",
          }}
          animate={
            animateBackground
              ? { background: ["#663dff", "#aa00ff", "#cc4499", "#663dff"] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: animateBackground ? Infinity : 0,
            ease: "linear",
          }}
        >
          <WandSparkles size={19} className="text-white" />
        </motion.div>
      </motion.button>
      {abusiveDetected && (
        <div className="text-white bg-red-500 rounded-full p-2 ml-4">
          Abusive language detected
        </div>
      )}
    </div>
  );
};

export default TextOptimization;