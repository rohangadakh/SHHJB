import React, { useState, useEffect } from "react";
import { Flame, Tag, Users, Menu, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [username, setUsername] = useState(""); // New state for username
  const navigate = useNavigate();

  useEffect(() => {
    const loggedStatus = localStorage.getItem("isLogged");
    setIsLoggedIn(loggedStatus === "true");

    if (loggedStatus === "true") {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername); // Set username from local storage

      const fetchUserImage = async () => {
        const userRef = ref(db, `users/${storedUsername}/profile/avatar`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserImage(snapshot.val());
        } else {
          setUserImage(null);
        }
      };
      fetchUserImage();
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleAskQuestionClick = () => {
    navigate("/ask-question");
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 fixed w-full top-0 z-50 backdrop-blur-lg bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogoClick}>
            <img
              src="https://acschandwadcollege.com/visitors/layout_1/design/images/SNJB%20Logo.png"
              alt="SHHJB Logo"
              className="h-16 py-2"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/TrendingQuestions" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2">
              <Flame className="h-5 w-5" />
              <span>Trending</span>
            </Link>
            <Link to="/tags" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Tags</span>
            </Link>
            <Link to="/contributors" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Contributors</span>
            </Link>
            <button
              onClick={handleAskQuestionClick}
              className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
            >
              Ask Question
            </button>

            <button
              onClick={handleProfileClick}
              className="p-3 rounded-full border border-zinc-700 hover:border-white hover:bg-zinc-800"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
          <button className="md:hidden flex items-center" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <Menu className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleProfileClick}
              className="p-2 rounded-full border border-zinc-700 hover:border-white hover:bg-zinc-800 flex items-center"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt="User Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 p-1 text-white" />
              )}
              <h1 className="text-white text-2xl ml-4 font-semibold">{username || "Hellow User"}</h1>
            </button>
            <Link to="/TrendingQuestions" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 p-2">
              <Flame className="h-5 w-5" />
              <span>Trending</span>
            </Link>
            <Link to="/tags" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 p-2">
              <Tag className="h-5 w-5" />
              <span>Tags</span>
            </Link>
            <Link to="/contributors" className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-2 p-2">
              <Users className="h-5 w-5" />
              <span>Contributors</span>
            </Link>
            <button
              onClick={handleAskQuestionClick}
              className="bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:bg-zinc-200 transition-colors shadow-lg w-full"
            >
              Ask Question
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;