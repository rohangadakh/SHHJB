import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, set } from "firebase/database";
import { db } from "../firebase";
import { LogOut, Pencil, Save, Clock } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);

      const fetchUserData = async () => {
        const userRef = ref(db, `users/${savedUsername}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setBio(userData.profile?.bio || ""); // Fetch from profile sub-node
          setImageUrl(userData.profile?.avatar || ""); // Fetch from profile sub-node
        }
      };

      const fetchQuestions = async () => {
        const questionsRef = ref(db, `questions`);
        const snapshot = await get(questionsRef);
        const userQuestions = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const question = childSnapshot.val();
            if (question.username === savedUsername) {
              userQuestions.push({ id: childSnapshot.key, ...question });
            }
          });
        }

        // Sort questions by timestamp (most recent first)
        userQuestions.sort((a, b) => b.timestamp - a.timestamp);
        setQuestions(userQuestions);
      };

      fetchUserData();
      fetchQuestions();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    const userRef = ref(db, `users/${username}/profile`);
    try {
      // Update only the "profile" sub-node with bio and avatar
      await set(userRef, {
        bio,
        avatar: imageUrl,
      });

      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="relative bg-black text-white min-h-screen py-24 px-6">
      <div className="flex flex-wrap gap-6">
        <div className="bg-zinc-950 p-6 rounded-3xl border border-gray-800 shadow-lg w-full lg:w-1/2">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-white overflow-hidden">
              <img
                src={
                  imageUrl ||
                  "https://d2pas86kykpvmq.cloudfront.net/images/humans-3.0/portrait-2-p-500.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{username || "Guest"}</h2>
              <div className="mt-2">
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-2 p-3 bg-zinc-800 rounded-2xl"
                  />
                ) : (
                  <div className="text-gray-400 mt-2">
                    {bio || "No bio available"}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 w-full bg-white text-black rounded-2xl flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 w-full bg-white text-black rounded-2xl flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 w-full bg-white text-black rounded-2xl flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-xl font-semibold mb-4">Your Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-zinc-950 p-4 rounded-3xl cursor-pointer"
                onClick={() => handleQuestionClick(question.id)}
              >
                <h4 className="text-lg font-semibold">{question.title}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <button
                      key={index}
                      className="bg-gray-800 text-sm px-4 py-2 rounded-xl"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-gray-400 flex items-center gap-2">
                  Posted on <Clock size={16} />
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;