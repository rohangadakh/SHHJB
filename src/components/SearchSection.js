import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      const questionsRef = ref(db, "questions");
      const snapshot = await get(questionsRef);
      let allTags = new Set();

      if (snapshot.exists()) {
        const questions = snapshot.val();
        for (let questionId in questions) {
          const question = questions[questionId];
          question.tags.forEach((tag) => allTags.add(tag));
        }
        setTags(Array.from(allTags));
      }
    };

    fetchTags();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // Clear results when the search query is empty
      return;
    }

    const questionsRef = ref(db, "questions");
    const snapshot = await get(questionsRef);
    let filteredResults = [];

    if (snapshot.exists()) {
      const questions = snapshot.val();
      for (let questionId in questions) {
        const question = questions[questionId];
        const titleMatches = question.title.toLowerCase().includes(searchQuery.toLowerCase());
        const tagsMatch = selectedTags.every(tag => question.tags.includes(tag));

        if (titleMatches && (selectedTags.length === 0 || tagsMatch)) {
          filteredResults.push({
            type: "question",
            id: questionId,
            title: question.title,
            tags: question.tags,
            username: question.username,
          });
        }
      }
      setSearchResults(filteredResults);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleQuestionClick = (id) => {
    navigate(`/question/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
      <div className="bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-800 p-8">
        <div className="relative">
          <Search className="absolute left-4 top-4 h-6 w-6 text-zinc-500" />
          <input
            type="text"
            placeholder="Search for error messages, solutions, or topics..."
            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
        <div className="mt-6 flex items-center space-x-4 text-sm text-zinc-400 overflow-x-auto pb-2">
          <span className="flex items-center whitespace-nowrap">
            <Filter className="h-4 w-4 mr-2" />
            Popular tags:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors whitespace-nowrap border border-zinc-800 ${
                selectedTags.includes(tag) ? "bg-green-600" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {searchQuery.trim() && searchResults.length === 0 ? (
            <p className="text-zinc-400">No results found</p>
          ) : (
            searchResults.map((result) => (
              <div
                key={result.id}
                className="py-4 border-b border-zinc-800 text-white cursor-pointer"
                onClick={() => handleQuestionClick(result.id)}
              >
                <h3 className="font-semibold">{result.title}</h3>
                <p className="text-sm text-zinc-400">Tags: {result.tags.join(", ")}</p>
                <div className="mt-2 text-zinc-300">
                  Posted by {result.username}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
