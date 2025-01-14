import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { get, ref } from "firebase/database";
import { db } from "../firebase";

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const usersRef = ref(db, "users/");
      const snapshot = await get(usersRef);
  
      if (!snapshot.exists()) {
        setError("No users found");
        return;
      }
  
      let userFound = false;
      snapshot.forEach((childSnapshot) => {
        const username = childSnapshot.key; // Root-level key (e.g., "rohan")
        const userData = childSnapshot.val();
  
        if (
          (userData.email === emailOrUsername || username === emailOrUsername) &&
          userData.password === password
        ) {
          userFound = true;
  
          // Save the login status and username in localStorage
          localStorage.setItem("isLogged", "true");
          localStorage.setItem("username", username);
  
          navigate("/"); // Redirect to the home page
        }
      });
  
      if (!userFound) {
        setError("Invalid email/username or password");
      }
    } catch (error) {
      setError("Error occurred while trying to log in");
      console.error(error);
    }
  };  

  return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-semibold text-white">Login</h2>
            <p className="text-gray-400">Enter your email or username to log in</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="space-y-2">
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-300">
                Email or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="emailOrUsername"
                  type="text"
                  placeholder="Enter your email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
        <div className="px-6 py-4 bg-zinc-800 border-t border-gray-700 rounded-b-3xl">
          <p className="text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
