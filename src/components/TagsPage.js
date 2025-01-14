import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const renderMarkdown = (text) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;
  const codeRegex = /`(.*?)`/g;
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;

  let result = text;

  result = result.replace(boldRegex, "<strong>$1</strong>");
  result = result.replace(italicRegex, "<em>$1</em>");
  result = result.replace(codeRegex, "<code>$1</code>");
  result = result.replace(
    linkRegex,
    `<a href="$2" class="text-blue-500" target="_blank" rel="noopener noreferrer">$1</a>`
  );

  return result;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const questionsRef = ref(db, "questions");
    onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedQuestions = [];
      const uniqueTags = new Set();

      for (let id in data) {
        const question = { id, ...data[id] };
        loadedQuestions.push(question);
        if (question.tags) {
          question.tags.forEach((tag) => uniqueTags.add(tag));
        }
      }

      setQuestions(loadedQuestions);
      setTags([...uniqueTags]);
    });
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((question) =>
        selectedTags.some((tag) => question.tags.includes(tag))
      );
      setFilteredQuestions(filtered);
    }
  }, [selectedTags, questions]);

  const toggleTagSelection = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Tags</h2>
        <div className="flex flex-wrap gap-3 mt-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTagSelection(tag)}
              className={`px-4 py-2 rounded-xl border ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              } transition-colors`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Filtered Questions</h3>
        {filteredQuestions.length === 0 ? (
          <p className="text-zinc-400">No questions match the selected tags.</p>
        ) : (
          <div className="space-y-6">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="bg-zinc-950 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
                onClick={() => handleQuestionClick(question.id)}
              >
                <h3 className="text-xl font-semibold text-white hover:text-zinc-300 transition-colors">
                  {question.title}
                </h3>
                <p
                  className="mt-3 text-zinc-400 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(question.body),
                  }}
                ></p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 text-zinc-400 text-sm">
                  <span>Posted on {formatDate(question.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsPage;