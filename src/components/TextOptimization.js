import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";

const TextOptimization = ({ text, onOptimizedText }) => {
  const [loading, setLoading] = useState(false);
  const [background, setBackground] = useState("");

  const optimizeText = async () => {
    setLoading(true);
    setBackground("bg-gradient-to-r from-blue-500 to-green-500 animate-gradient");

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBiNigM3zsxZ2Fl6Kjr6ea9PEMeozpqr6U");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Optimize and check for abusive language in this text: ${text}`;
      const result = await model.generateContent(prompt);

      let optimizedText = result.response.text();
      
      // Preserve markdown or formatting (like `**bold**`, `[link](url)`, etc.)
      const preservedText = preserveFormatting(optimizedText);
      
      onOptimizedText(preservedText); // Return the optimized text with formatting intact
      setBackground(""); // Reset background animation after completion
    } catch (error) {
      console.error("Error optimizing text:", error);
      setLoading(false);
      setBackground(""); // Reset background animation on error
    }
  };

  // Function to preserve markdown/formatting in the text
  const preserveFormatting = (inputText) => {
    // Regex to handle Markdown syntax and preserve them
    const regex = {
      bold: /\*\*(.*?)\*\*/g,  // **bold**
      italic: /\*(.*?)\*/g,  // *italic*
      code: /`(.*?)`/g,  // `code`
      link: /\[([^\]]+)\]\(([^)]+)\)/g, // [link](URL)
    };

    // Replacing the matched markdown with the same formatting intact
    let formattedText = inputText
      .replace(regex.bold, "<b>$1</b>")
      .replace(regex.italic, "<i>$1</i>")
      .replace(regex.code, "<code>$1</code>")
      .replace(regex.link, '<a href="$2" target="_blank">$1</a>');

    return formattedText;
  };

  return (
    <div className={`p-4 ${background} transition-all`}>
      <motion.button
        className="text-white flex items-center gap-2"
        onClick={optimizeText}
        disabled={loading}
        whileTap={{ scale: 0.9 }}
        whileHover={{ rotate: 15 }}
      >
        <WandSparkles size={24} />
        {loading ? "Optimizing..." : "Optimize Text"}
      </motion.button>
    </div>
  );
};

export default TextOptimization;
