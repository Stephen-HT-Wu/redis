// server.js
const express = require("express");
const http = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const redis = createClient();
redis.connect();

const EVENT_ID = "livevote";

io.on("connection", (socket) => {
  console.log("👥 有用戶連線");

  // 初始票數
  socket.on("getVotes", async () => {
    const votes = await redis.hGetAll(`votes:${EVENT_ID}`);
    socket.emit("updateVotes", votes);
  });

  // 投票事件
  socket.on("vote", async (option) => {
    await redis.hIncrBy(`votes:${EVENT_ID}`, option, 1);
    const updated = await redis.hGetAll(`votes:${EVENT_ID}`);
    io.emit("updateVotes", updated); // 廣播給所有用戶
  });

  socket.on("disconnect", () => {
    console.log("🔌 用戶離線");
  });
});

server.listen(3001, () => {
  console.log("✅ WebSocket server is running at http://localhost:3001");
});
