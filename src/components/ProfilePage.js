import React, { useState, useEffect } from "react";
import { Pencil, Save, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ref, set, get } from "firebase/database";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { db } from "../firebase";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    github: "",
    gmail: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);

      const fetchUserData = async () => {
        const userRef = ref(db, `users/${savedUsername}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setBio(userData.bio || "");
          setSocialLinks(userData.socialLinks || {});
          setEmail(userData.email || "");
          setPassword(userData.password || "");
          setImageUrl(userData.avatar || "");
        }
      };

      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = async () => {
    try {
      const userRef = ref(db, `users/${username}`);
      await set(userRef, {
        bio,
        socialLinks,
        email,
        password,
        avatar: imageUrl,
      });
      setIsEditing(false);
      setPopup({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setPopup({
        message: "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const closePopup = () => setPopup({ message: "", type: "" });

  const handleImageChange = async (e) => {
    if (!isEditing) return; // Prevent image upload if not in edit mode
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image before uploading.");
      return;
    }
    if (file && !["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      alert("Please select a valid image (PNG, JPEG, GIF).");
      return;
    }
    const formData = new FormData();
    formData.append("api_key", "d6715121b501828c633a60208462335e");
    formData.append("file", file);
    try {
      const response = await fetch("https://api.imghippo.com/v1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred during image upload.");
    }
  };

  return (
    <div className="relative bg-black text-white min-h-screen py-24 px-6">
      {popup.message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="bg-zinc-950 p-8 rounded-xl shadow-lg text-center relative">
            <div className="w-40 h-40 mx-auto">
              <DotLottieReact
                src="https://lottie.host/2976f056-c059-4997-8016-caee6c679ab0/Bvxu6icW30.lottie"
                loop
                autoplay
              />
            </div>
            <p className="text-xl font-semibold mt-6 mb-4">{popup.message}</p>
            <button
              onClick={closePopup}
              className="p-2 text-white rounded-full hover:text-red-500 absolute top-2 right-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-6">
        <div className="bg-zinc-950 p-6 rounded-3xl border border-gray-600 shadow-lg w-full lg:w-1/2">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-white overflow-hidden">
              <img
                src={
                  imageUrl ||
                  "https://d2pas86kykpvmq.cloudfront.net/images/humans-3.0/portrait-2-p-500.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
                onClick={() =>
                  isEditing && document.getElementById("fileInput").click()
                }
                style={{ cursor: isEditing ? "pointer" : "not-allowed" }}
              />
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg, image/gif"
                onChange={handleImageChange}
                className="hidden"
                disabled={!isEditing}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{username || "Guest"}</h2>
              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write something about yourself..."
                  className="w-full mt-2 p-3 bg-zinc-800 rounded-lg text-white"
                />
              ) : (
                <p className="text-gray-400 mt-2">{bio || "No bio yet."}</p>
              )}
            </div>
          </div>
          <div className="border border-zinc-700 mb-4 mt-6"></div>
          <div className="flex flex-col gap-4 mt-6">
            {["github", "twitter", "gmail"].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <img
                  src={
                    key === "github"
                      ? "https://img.icons8.com/3d-fluency/750/github.png"
                      : key === "twitter"
                      ? "https://img.icons8.com/3d-fluency/750/twitter-circled--v1.png"
                      : "https://img.icons8.com/3d-fluency/750/gmail-logo.png"
                  }
                  alt={key}
                  className="w-8 h-8"
                />
                {isEditing ? (
                  <input
                    type="text"
                    value={socialLinks[key]}
                    onChange={(e) =>
                      setSocialLinks({ ...socialLinks, [key]: e.target.value })
                    }
                    placeholder={`${key} link`}
                    className="p-2 bg-zinc-800 rounded-lg text-white w-full"
                  />
                ) : (
                  <a
                    href={socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {socialLinks[key] || `Add ${key}`}
                  </a>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-4 mt-6 w-full">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full p-3 bg-white text-black rounded-2xl flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full p-3 bg-white text-black rounded-2xl flex items-center justify-center gap-2"
              >
                <Pencil className="w-5 h-5 font-bold" /> Edit
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full p-3 bg-white text-black rounded-2xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5 font-bold" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
