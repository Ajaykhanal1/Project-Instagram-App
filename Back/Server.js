const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./Routes/Authentication_Routes");
const profileRoutes = require("./Routes/Profile_Routes");
const postRoutes = require("./Routes/Post_Routes");


const http = require("http");
const {Server} = require("socket.io");
const setupSocket = require("./Socket/Socket");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
setupSocket(io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});