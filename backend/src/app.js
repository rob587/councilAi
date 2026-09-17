import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./controllers/councilController.js";
import authRoutes from "./routes/authRoutes.js";
import councilRoutes from "./routes/councilRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
initSocket(io);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/council", councilRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CouncilAI API funzionante " });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Errore interno del server" });
});

export { httpServer };
export default app;
