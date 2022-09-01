const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config`/db");

const app = express();
dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("Running");
});
app.get("/api/chat", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  const singlechat = chats.find((f) => f._id === req.params.id);
  res.send(singlechat);
});

// const PORT= process.env.PORT||8000;

app.listen(8000, console.log(`running on server ${8000}`));
