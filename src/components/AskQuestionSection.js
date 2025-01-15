import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bold, Italic, Code, Link2, X, Image as ImageIcon } from "lucide-react";
import { ref, push, set } from "firebase/database";
import { db } from "../firebase";
import TextOptimization from "./TextOptimization"; // Import the TextOptimization component

const predefinedTags = ["react", "javascript", "html", "css", "nodejs", "java"];

const AskQuestionSection = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleTagInput = (e) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      const tag = currentTag.trim().toLowerCase();
      if (!tags.includes(tag) && predefinedTags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert("Please select an image before uploading.");
      return null;
    }

    const formData = new FormData();
    formData.append("key", "648f302b60e48ad1020b795ceed49a94"); // Replace with your ImageBB API key
    formData.append("image", image);

    try {
      setUploading(true);
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setUploading(false);

      if (data.success) {
        return data.data.url; // Returns the URL of the uploaded image
      } else {
        console.error("Image upload failed:", data.error.message);
        alert("Failed to upload image. Please try again.");
        return null;
      }
    } catch (error) {
      setUploading(false);
      console.error("Error uploading image:", error);
      alert("An error occurred during image upload.");
      return null;
    }
  };

  const toggleTagSelection = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Please login to ask a question.");
      return;
    }

    if (tags.length === 0) {
      alert("Please add at least one tag.");
      return;
    }

    let imageUrl = null;
    if (image) {
      imageUrl = await handleImageUpload();
    }

    const questionData = {
      title,
      body,
      username,
      tags,
      image: imageUrl,
      createdAt: new Date().toISOString(),
    };

    try {
      const questionRef = ref(db, "questions");
      const newQuestionRef = push(questionRef);
      await set(newQuestionRef, questionData);

      alert("Question submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("Failed to submit question. Please try again.");
    }
  };

  const insertMarkdown = (type) => {
    const markdownSyntax = {
      bold: "**bold**",
      italic: "*italic*",
      inlineCode: "`code`",
      codeBlock: "```code block```",
      link: "[link](https://example.com)",
    };
    setBody(body + markdownSyntax[type]);
  };

  return (
    <div className="bg-black text-white py-16 px-4 mt-10 sm:px-8">
      <div className="max-w-3xl mx-auto rounded-3xl bg-zinc-900/50 border border-gray-800 p-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Ask a Question
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex flex-wrap gap-6"
        >
          <div className="w-full">
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-semibold mb-2"
              >
                Question Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is your question?"
                className="w-full p-4 bg-zinc-800 text-white rounded-3xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>

            <label
              htmlFor="body"
              className="block text-lg mt-4 mb-3 font-semibold"
            >
              Question Body
            </label>
            <div className="mb-6 bg-zinc-800 rounded-3xl p-4 flex items-center space-x-4">
              <button
                type="button"
                onClick={() => insertMarkdown("bold")}
                className="bg-zinc-700 text-white p-3 rounded-3xl hover:bg-zinc-600"
              >
                <Bold size={20} />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("italic")}
                className="bg-zinc-700 text-white p-3 rounded-3xl hover:bg-zinc-600"
              >
                <Italic size={20} />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("inlineCode")}
                className="bg-zinc-700 text-white p-3 rounded-3xl hover:bg-zinc-600"
              >
                <Code size={20} />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("link")}
                className="bg-zinc-700 text-white p-3 rounded-3xl hover:bg-zinc-600"
              >
                <Link2 size={20} />
              </button>

              <button
                type="button"
                className="bg-zinc-700 text-white p-3 rounded-3xl hover:bg-zinc-600"
                onClick={() => document.getElementById("image").click()}
              >
                <ImageIcon size={20} />
              </button>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              <div className="w-full">
                <TextOptimization text={body} onOptimizedText={setBody} />
              </div>
            </div>

            <div>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Describe your issue in detail"
                rows="8"
                className="w-full p-4 bg-zinc-800 text-white rounded-3xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                required
              ></textarea>
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-lg font-semibold mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-sm text-white hover:text-gray-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTagSelection(tag)}
                  className={`px-6 py-2 rounded-full text-white ${
                    tags.includes(tag)
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={uploading}
              className="bg-white text-black px-8 py-4 rounded-3xl font-semibold hover:scale-110 transition-all shadow-lg"
            >
              {uploading ? "Uploading..." : "Submit Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionSection;
