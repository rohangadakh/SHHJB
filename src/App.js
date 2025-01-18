import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AskQuestionSection from "./components/AskQuestionSection";
import ProfilePage from "./components/ProfilePage";
import QuestionPage from "./components/QuestionPage";
import Navbar from "./components/Navigation"; // Importing Navbar component
import Footer from "./components/Footer"; // Importing Footer component
import TrendingQuestions from "./components/TrendingQuestions";
import TagsPage from "./components/TagsPage";
import TopContributors from "./components/TopContributors";
import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const { isAuthenticated } = useAuth(); // Authentication state
  const location = useLocation(); // To get the current route

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Toaster position="top-center" reverseOrder={false} />
      {!isAuthPage && <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/contributors" element={<TopContributors />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/TrendingQuestions" element={<TrendingQuestions />} />
          <Route path="/ask-question" element={<AskQuestionSection />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/question/:id" element={<QuestionPage />} />
          {/* Set the root route to show the Home Page */}
          <Route path="/" element={<Home />} />
          {/* Redirect to Login Page if not authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>

      {/* Conditionally render Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent /> {/* Now, the content is wrapped in the Router context */}
      </Router>
    </AuthProvider>
  );
};

export default App;
