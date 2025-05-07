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

const askGPT4 = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are Maia, a smart mirror assistant who greets users based on their emotions in only 10 words.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 20,
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
dotenv.config();

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
      const response = await askGPT4(data["prompt"]);
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

const aiSocket = connectToBackend("http://maiasalt.online:5200");

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
