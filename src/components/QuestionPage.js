import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, push, update } from "firebase/database";
import { Send, ArrowLeft, User } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderMarkdownWithCode = (text) => {
  const codeRegex = /`([^`]+)`/g;
  const boldRegex = /\*\*(.*?)\*\*/g;
  const italicRegex = /\*(.*?)\*/g;

  const parts = [];
  let lastIndex = 0;

  text.replace(codeRegex, (match, codeContent, index) => {
    if (index > lastIndex) {
      let segment = text.slice(lastIndex, index);

      // Apply bold and italic formatting to plain text
      segment = segment
        .replace(boldRegex, "<strong>$1</strong>")
        .replace(italicRegex, "<em>$1</em>");

      parts.push({
        type: "text",
        content: segment,
      });
    }

    parts.push({
      type: "code",
      content: codeContent,
    });
    lastIndex = index + match.length;
  });

  if (lastIndex < text.length) {
    let segment = text.slice(lastIndex);
    segment = segment
      .replace(boldRegex, "<strong>$1</strong>")
      .replace(italicRegex, "<em>$1</em>");
    parts.push({
      type: "text",
      content: segment,
    });
  }

  return parts;
};

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false); // Added state
  const [user, setUser] = useState(
    localStorage.getItem("username") || "Anonymous"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const questionRef = ref(db, "questions/" + id);
    get(questionRef).then((snapshot) => {
      if (snapshot.exists()) {
        setQuestion(snapshot.val());
      } else {
        navigate("/");
      }
    });
  
    const answersRef = ref(db, "answers/" + id);
    get(answersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const answersData = snapshot.val();
        const loadedAnswers = Object.keys(answersData)
          .map((key) => ({
            id: key,
            ...answersData[key],
          }))
          .sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted)); // Sort by most recent
        setAnswers(loadedAnswers);
      }
    });
  }, [id, navigate]);

  const handleAnswerSubmit = () => {
    if (!newAnswer.trim()) return;
  
    setSubmittingAnswer(true);
  
    const newAnswerRef = push(ref(db, "answers/" + id));
    const currentTime = new Date().toISOString();
  
    update(newAnswerRef, {
      text: newAnswer,
      username: user,
      timePosted: currentTime,
    })
      .then(() => {
        setNewAnswer("");
        setAnswers((prevAnswers) => [
          {
            id: newAnswerRef.key,
            text: newAnswer,
            timePosted: currentTime,
            username: user,
          },
          ...prevAnswers, 
        ]);
      })
      .finally(() => setSubmittingAnswer(false));
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-28 rounded-3xl bg-zinc-950">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center text-white hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="mr-2" />
        Back to Trending Questions
      </button>

      <div className="bg-zinc-950 rounded-3xl shadow-xl p-8 border border-zinc-800">
        <div className="flex items-start space-x-6">
          <div className="flex-1">
            {question.image && (
              <img
                src={question.image}
                alt="Question"
                className="w-full rounded-3xl mb-4"
              />
            )}
            <h1 className="text-2xl font-semibold text-white">
              {question.title}
            </h1>
            <div className="mt-4 text-zinc-400 text-lg">
              {renderMarkdownWithCode(question.body).map((part, index) =>
                part.type === "code" ? (
                  <SyntaxHighlighter
                    key={index}
                    language="javascript"
                    style={vscDarkPlus}
                  >
                    {part.content}
                  </SyntaxHighlighter>
                ) : (
                  <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: part.content }}
                  ></span>
                )
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {question.tags &&
                question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="mt-6 text-zinc-400 text-sm">
              <span>
                Posted on {new Date(question.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full pl-3 py-3 border border-gray-800 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          placeholder="Add your answer..."
        />
         <button
          onClick={handleAnswerSubmit}
          disabled={submittingAnswer}
          className={`mt-3 p-3 bg-white text-black rounded-2xl flex items-center justify-center ${
            submittingAnswer ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition-all"
          }`}
        >
          {submittingAnswer ? (
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="font-medium">Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Send className="mr-2 font-bold" />
              Submit Answer
            </div>
          )}
        </button>
      </div>

      <div className="relative mt-8">
        <div className="absolute left-6 top-0 h-full w-1 rounded-full bg-zinc-700"></div>
        <div className="space-y-6 ml-10">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-zinc-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-800 hover:border-zinc-600"
            >
              {renderMarkdownWithCode(answer.text).map((part, index) =>
                part.type === "code" ? (
                  <SyntaxHighlighter
                    key={index}
                    language="javascript"
                    style={vscDarkPlus}
                  >
                    {part.content}
                  </SyntaxHighlighter>
                ) : (
                  <span
                    key={index}
                    dangerouslySetInnerHTML={{ __html: part.content }}
                  ></span>
                )
              )}
              <div className="flex mt-4 items-center space-x-4">
                <User className="text-zinc-400" />
                <span className="font-semibold text-zinc-400">
                  {answer.username}
                </span>
                <span className="text-zinc-400 text-sm">
                  {new Date(answer.timePosted).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
