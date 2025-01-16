import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const TopContributors = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(db, "answers");
    const userAnswerCount = {};

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Collect user answer counts
        Object.values(data).forEach((answers) => {
          Object.values(answers).forEach((answer) => {
            const username = answer.username || "Anonymous";
            if (!userAnswerCount[username]) {
              userAnswerCount[username] = { count: 0 };
            }
            userAnswerCount[username].count += 1;
          });
        });

        // Fetch avatars for each username
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
    if (index === 0) return "h-80 p-6"; 
    if (index === 1 || index === 2) return "h-64 p-5"; 
    return "h-48 p-4"; 
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
      <h2 className="text-4xl font-extrabold text-white mb-12 text-center">
        Top Contributors
      </h2>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1200: 3 }}>
        <Masonry gutter="16px">
          {users.map((user, index) => {
            const cardSize = getCardSize(index);
            const borderColor =
              index === 0
                ? "border-green-500"
                : index === 1
                ? "border-yellow-500"
                : index === 2
                ? "border-red-500"
                : "border-gray-700";

            return (
              <motion.div
                key={user.username}
                className={`rounded-2xl flex flex-col items-center justify-center bg-zinc-800 text-white shadow-lg border-4 ${borderColor} ${cardSize}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <p className="text-sm mt-2">
                  {user.count} {user.count === 1 ? "Answer" : "Answers"}
                </p>
              </motion.div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default TopContributors;