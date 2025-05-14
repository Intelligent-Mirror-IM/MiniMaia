import http from "http";
import express from "express";
import { io } from "socket.io-client";
import { Server } from "socket.io";
import dotenv from "dotenv";
import axios from "axios";
import { OpenAI } from "openai";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.GPT_KEY,
});

const conversationStore = {
  records: new Map(),
  getUserConverstation: function (userId) {
    if (!this.records.has(userId))
      this.records.set(userId, [
        {
          role: "system",
          content: "You are Maia, a smart mirror assistant.",
        },
      ]);
    return this.records.get(userId);
  },
};
const askGPT4 = async (prompt, userId) => {
  try {
    const messages = conversationStore.getUserConverstation(userId);
    messages.push({
      role: "user",
      content: prompt,
    });

    const limitedMessages =
      messages.length > 21
        ? [messages[0]].concat(messages.slice(messages.length - 20))
        : messages;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: limitedMessages,
      max_tokens: 50,
      temperature: 0.7,
    });
    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

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
  socket.on("processAiRequest", async (data) => {
    console.log(data);
    try {
      const userId = data.userId || socket.id;

      const response = await askGPT4(data["prompt"], userId);
      socket.emit("aiResponse", {
        requestId: data.requestId,
        response: response || "No response sorry..",
      });
    } catch (error) {
      socket.emit("aiResponse", {
        requestId: data.requestId,
        response: error,
      });
    }
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
