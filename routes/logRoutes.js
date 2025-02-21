import express from "express"
import Log from "../models/Log.js"

const router = express.Router()

// Get all logs for a user
router.get("/:userId", async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.userId }).populate("projectId")
    res.json(logs)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Add a new log
router.post("/", async (req, res) => {
  try {
    const { date, hours, projectId, userId, remarks } = req.body
    const log = new Log({ date, hours, projectId, userId, remarks })
    await log.save()
    res.status(201).json(log)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update a log
router.put("/:id", async (req, res) => {
  try {
    const { date, hours, projectId, remarks } = req.body
    const log = await Log.findByIdAndUpdate(req.params.id, { date, hours, projectId, remarks }, { new: true })
    res.json(log)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a log
router.delete("/:id", async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id)
    res.json({ message: "Log deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router

