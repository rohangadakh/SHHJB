import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLogged") === "true";

    if (isLoggedIn) {
      // Redirect to the Ask Question page if logged in
      navigate("/ask-question");
    } else {
      // Redirect to the Login page if not logged in
      navigate("/login");
    }
  };

  return (
    <div className="">
      <div className="bg-gradient-to-b from-zinc-950 to-black py-2 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Interactive Spline Section */}
          <div className="relative mb-12 h-[900px]">
            {" "}
            {/* Increased height */}
            {/* Spline 3D Scene */}
            <Spline
              scene="https://prod.spline.design/1Ep7Rog88GVQ2aUd/scene.splinecode"
              className="w-full h-full"
            />
            {/* Overlay Text */}
            <div className="absolute px-2 inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <h1 className="text-4xl md:text-7xl font-bold leading-tight text-white">
                Stuck on a <span className="text-white">coding error?</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mt-4">
                Get help from your fellow students and experienced developers
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pointer-events-auto">
                <button
                  onClick={handleAskQuestion}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg text-lg"
                >
                  Ask a Question
                </button>
                <button className="border-2 border-zinc-800 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-zinc-900 transition-colors shadow-lg text-lg">
                  Browse Solutions
                </button>
              </div>
            </div>
            {/* Black Rectangle */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-black z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;