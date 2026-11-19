import { Router } from "express";
import requireAuth from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const taskRoutes = Router();

taskRoutes.use(requireAuth);
taskRoutes.post("/", createTask);
taskRoutes.get("/", getTasks);
taskRoutes.get("/:id", getTaskById);
taskRoutes.put("/:id", updateTask);
taskRoutes.patch("/:id/status", updateTaskStatus);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
