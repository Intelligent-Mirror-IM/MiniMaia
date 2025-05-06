import http from "http";
import express from "express";
import { io } from "socket.io-client";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const socketServer = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

const connectToBackend = (serverUrl) => {
  const socket = io(serverUrl, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    autoConnect: true,
  });
  socket.on("connect", () => {
    console.log("Connected to backend");
  });
  socket.on("processAiRequest", (data) => {
    console.log("Received processAiRequest event from backend");
    console.log(data);
    socket.emit("aiResponse", {
      requestId: data.requestId,
      response: "Hello from backend",
    });
  });
  socket.on("disconnect", () => {
    console.log("Disconnected from backend");
  });
  return socket;
};

const aiSocket = connectToBackend("http://localhost:5200");

socketServer.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("processAiRequest", (data) => {
    console.log("Received processAiRequest event from client");
    console.log(data);
    aiSocket.emit("message", {
      requestId: data["requestId"],
      response: "Lalaland",
    });
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
