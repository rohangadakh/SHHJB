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
      const genAI = new GoogleGenerativeAI("AIzaSyAYjW9cI0AYEb-xaaWdesD1gx0kVFGZTBI");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Please review and optimize the following text for clarity and ease of understanding. Follow these instructions:
  1. Ensure that any existing formatting, such as **bold**, *italic*, \`code\`, and [links](https://example.com), is preserved.
  2. Enhance the readability of the text by adding appropriate markdown formatting where necessary.
  
  Return the revised text, keeping the original markdown formatting intact: ${text}`;


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
