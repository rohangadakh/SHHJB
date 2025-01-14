import React from "react";

const CallToAction = () => {
  return (
    <div className="bg-gradient-to-b from-zinc-950 to-black text-white py-20 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Join the community and share your knowledge with others!
        </p>
        <button className="bg-white text-black px-10 py-4 rounded-2xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg text-lg">
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
