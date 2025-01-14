import React, { useEffect, useState } from "react";
import { Flame, ChevronRight, MessageCircle, Clock } from "lucide-react";
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

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const TrendingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const questionsRef = ref(db, "questions");
    onValue(questionsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedQuestions = [];
      for (let id in data) {
        loadedQuestions.push({ id, ...data[id] });
      }
      loadedQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setQuestions(loadedQuestions);
    });
  }, []);

  const handleQuestionClick = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Flame className="h-8 w-8 mr-3 text-orange-500" />
          Trending Questions
        </h2>
      </div>
      <div className="space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-zinc-950 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
            onClick={() => handleQuestionClick(question.id)}
          >
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-semibold text-white hover:text-zinc-300 transition-colors">
                    {question.title}
                  </h3>
                </div>
                <p
                  className="mt-3 text-zinc-400 text-lg"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(truncateText(question.body, 200)), // Apply truncation here
                  }}
                ></p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm hover:bg-zinc-800 transition-colors border border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-zinc-400 text-sm">
                  <div className="flex items-center space-x-6">
                    <span className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {question.answers} answers
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {formatDate(question.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingQuestions;