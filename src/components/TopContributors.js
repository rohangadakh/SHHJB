import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Confetti from "react-confetti";

const TopContributors = () => {
  const [users, setUsers] = useState([]);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "answers");
    const userAnswerCount = {};

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        Object.values(data).forEach((answers) => {
          Object.values(answers).forEach((answer) => {
            const username = answer.username || "Anonymous";
            if (!userAnswerCount[username]) {
              userAnswerCount[username] = { count: 0 };
            }
            userAnswerCount[username].count += 1;
          });
        });

        const userList = Object.keys(userAnswerCount);
        const userPromises = userList.map((username) => {
          const userRef = ref(db, `users/${username}/profile`);
          return new Promise((resolve) => {
            onValue(userRef, (userSnapshot) => {
              const userProfile = userSnapshot.val() || {};
              resolve({
                username,
                count: userAnswerCount[username].count,
                image: userProfile.avatar || null,
              });
            });
          });
        });

        Promise.all(userPromises).then((usersData) => {
          usersData.sort((a, b) => b.count - a.count);
          setUsers(usersData);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const getCardSize = (index) => {
    if (index === 0) return "h-80 w-full p-8"; // Largest card
    if (index === 1) return "h-64 w-full p-6"; // Second largest
    if (index === 2) return "h-56 w-full p-5"; // Third largest
    return "h-48 w-full p-4"; // Smallest
  };

  const getBorderColor = (index) => {
    if (index === 0) return "border-green-400";
    if (index === 1) return "border-yellow-400";
    if (index === 2) return "border-red-400";
    return "border-white";
  };

  useEffect(() => {
    const timer = setTimeout(() => setConfetti(false), 5000); // Confetti lasts for 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h2 className="text-4xl font-extrabold text-white mb-12 text-center">
        Top Contributors
      </h2>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 }}>
        <Masonry gutter="16px">
          {users.map((user, index) => {
            const cardSize = getCardSize(index);
            const borderColor = getBorderColor(index);

            return (
              <motion.div
                key={user.username}
                className={`rounded-3xl flex flex-col items-center justify-center bg-zinc-950 shadow-lg border-2 ${borderColor} ${cardSize}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl font-bold text-zinc-950 mb-4`}
                >
                  {index + 1}
                </div>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white">
                  {user.username}
                </h3>
                <p className="text-sm mt-2 text-gray-300">
                  {user.count} {user.count === 1 ? "Answer" : "Answers"}
                </p>
              </motion.div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
      <div className="mt-12 text-center">
        <p className="text-xl text-gray-300">
          A huge thanks to all our top contributors for sharing their knowledge and helping others grow. 
          Your generosity and effort make this community stronger every day !
        </p>
      </div>
    </div>
  );
};

export default TopContributors;