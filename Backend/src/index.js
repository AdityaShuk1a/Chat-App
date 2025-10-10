import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";

import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js"; // ✅ updated import
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
const app = express();
const server = createServer(app);
initSocket(server); // ✅ initialize socket.io here

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));
  app.get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"))
  );
}

server.listen(PORT, () => {
  console.log("✅ Server running on PORT:", PORT);
  connectDB();
});
