import mongoose from "mongoose";
import Task from "../models/task.model.js";

const isValidId = (id) => mongoose.isValidObjectId(id);

export const createTask = async (req, res) => {
  try {
    const { title, description = "" } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "A task title is required." });
    }

    const task = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      user: req.user.id,
    });

    return res.status(201).json({ message: "Task created.", task });
  } catch (error) {
    console.error("Create task error:", error.message);
    return res.status(500).json({ message: "Unable to create this task." });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error.message);
    return res.status(500).json({ message: "Unable to load your tasks." });
  }
};

export const getTaskById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error("Get task error:", error.message);
    return res.status(500).json({ message: "Unable to load this task." });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const updates = {};
    if (typeof req.body.title === "string") {
      if (!req.body.title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty." });
      }
      updates.title = req.body.title.trim();
    }

    if (typeof req.body.description === "string") {
      updates.description = req.body.description.trim();
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid task changes were provided." });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task updated.", task });
  } catch (error) {
    console.error("Update task error:", error.message);
    return res.status(500).json({ message: "Unable to update this task." });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const { status } = req.body;
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Status must be pending or completed." });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task status updated.", task });
  } catch (error) {
    console.error("Update task status error:", error.message);
    return res.status(500).json({ message: "Unable to update task status." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    console.error("Delete task error:", error.message);
    return res.status(500).json({ message: "Unable to delete this task." });
  }
};
