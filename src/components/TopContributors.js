import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { motion } from "framer-motion";

const TopContributors = () => {
  const [users, setUsers] = useState([]);
  const [avatars, setAvatars] = useState({}); // Store the avatars once fetched

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

        // Now, for each username, fetch their avatar from users/{username}/avatar
        const userList = Object.keys(userAnswerCount);
        const avatarPromises = userList.map((username) => {
          const avatarRef = ref(db, `users/${username}/avatar`);
          return new Promise((resolve) => {
            onValue(avatarRef, (avatarSnapshot) => {
              const avatar = avatarSnapshot.val() || null;
              resolve({ username, avatar });
            });
          });
        });

        // After all avatar data is fetched, combine with user answer count
        Promise.all(avatarPromises).then((avatarsData) => {
          const userWithAvatars = avatarsData.map(({ username, avatar }) => ({
            username,
            count: userAnswerCount[username].count,
            image: avatar,
          }));

          // Sort users based on the answer count in descending order
          userWithAvatars.sort((a, b) => b.count - a.count);
          setUsers(userWithAvatars);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Top Contributors
      </h2>
      <div className="space-y-6">
        {users.map((user, index) => {
          const rankStyles = {
            bgColor:
              index === 0
                ? "bg-green-200"
                : index === 1
                ? "bg-yellow-100"
                : index === 2
                ? "bg-red-100"
                : "bg-zinc-950",
            borderColor:
              index === 0
                ? "border-green-700"
                : index === 1
                ? "border-yellow-700"
                : index === 2
                ? "border-red-700"
                : "border-zinc-800",
            rankBg:
              index === 0
                ? "bg-green-700 text-white"
                : index === 1
                ? "bg-yellow-700 text-white"
                : index === 2
                ? "bg-red-700 text-white"
                : "bg-zinc-800 text-white",
          };

          return (
            <motion.div
              key={user.username}
              className={`p-6 rounded-3xl flex items-center justify-between ${rankStyles.bgColor} bg-opacity-70 backdrop-blur-lg hover:scale-105 transition-transform duration-300 border ${rankStyles.borderColor}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold ${rankStyles.rankBg}`}
                >
                  {index + 1}
                </div>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white text-lg font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-lg font-semibold text-zinc-900">
                  {user.username}
                </span>
              </div>
              <div className="text-lg font-bold text-zinc-700">
                {user.count} {user.count === 1 ? "Answer" : "Answers"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopContributors;
