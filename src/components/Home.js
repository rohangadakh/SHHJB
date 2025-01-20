import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Import motion
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import SearchSection from "./SearchSection";
import TrendingQuestions from "./TrendingQuestions";
import CallToAction from "./CallToAction";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading for 3.5 seconds
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleQuestionClick = (question) => {
    navigate(`/question/${question.id}`);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Render components immediately */}
      <Navigation />
      <HeroSection />
      <SearchSection />
      <TrendingQuestions onQuestionClick={handleQuestionClick} />
      <CallToAction />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            {/* Animated progress bar */}
            <div className="w-64 h-2 bg-gray-800 rounded overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 3.5, // Duration in seconds
                  ease: "easeInOut", // Smooth easing
                }}
              />
            </div>
            <p className="mt-4 text-white">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
