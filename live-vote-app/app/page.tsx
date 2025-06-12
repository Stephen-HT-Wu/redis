"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // 假設 WebSocket server 開在 port 3001

export default function Home() {
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // 當收到票數更新時更新畫面
    socket.on("updateVotes", (newVotes: { [key: string]: number }) => {
      setVotes(newVotes);
    });

    // 頁面初始時請求最新票數
    socket.emit("getVotes");

    return () => {
      socket.off("updateVotes");
    };
  }, []);

  const vote = async (option: string) => {
    if (hasVoted) return;
    socket.emit("vote", option);
    setHasVoted(true);
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 即時投票小 Demo</h1>
      <div className="flex justify-center gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => vote("Option A")}
          disabled={hasVoted}
        >
          投 Option A
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => vote("Option B")}
          disabled={hasVoted}
        >
          投 Option B
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">目前票數</h2>
        <ul className="mt-2">
          {Object.entries(votes).map(([option, count]) => (
            <li key={option} className="text-lg">
              {option}: {count}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}