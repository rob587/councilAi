import express from "express";
import {
  startSession,
  joinSession,
  getHistory,
  deleteSession,
} from "../controllers/councilController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/start", auth, startSession);
router.get("/history", auth, getHistory);
router.get("/:id", auth, joinSession);
router.delete("/:id", auth, deleteSession);

export default router;
