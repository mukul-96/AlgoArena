import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils";

export default function LeaderBoard() {
  const [topCoders, setTopCoders] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/leaderboard`);
        const fetchedUsers = res.data;

        const usersWithRatio = fetchedUsers.map(user => {
          const wins = parseInt(user.wins) || 0;
          const losses = parseInt(user.losses) || 0;

          console.log(`User: ${user.username}, Wins: ${wins}, Losses: ${losses}`);

          let ratio;
          if (losses === 0) {
            ratio = wins > 0 ? wins : 0;
          } else {
            ratio = wins / losses;
          }

          return {
            ...user,
            ratio,
          };
        });

        const sortedUsers = usersWithRatio.sort((a, b) => b.ratio - a.ratio);

        setTopCoders(sortedUsers.slice(0, 10));
        console.log(topCoders)
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [topCoders]);

  return (
    <div className="leaderboard-container">
      <h2>Top 10 Coders</h2>
      <ul>
        {topCoders.map((user, index) => (
          <li key={user.id} className="leaderboard-item">
            <span>{index + 1}. {user.username}</span>
            <span> Ratio: {user.ratio.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
