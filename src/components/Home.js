import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import SearchSection from "./SearchSection";
import TrendingQuestions from "./TrendingQuestions";
import CallToAction from "./CallToAction";

const Home = () => {
  const navigate = useNavigate();

  const handleQuestionClick = (question) => {
    navigate(`/question/${question.id}`);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />
      <HeroSection />
      <SearchSection />
      <TrendingQuestions onQuestionClick={handleQuestionClick} />
      <CallToAction />
    </div>
  );
};

export default Home;
