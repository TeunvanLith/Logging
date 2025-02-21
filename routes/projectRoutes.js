import express from "express"
import Project from "../models/Project.js"

const router = express.Router()

// Get all projects for a user
router.get("/:userId", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId })
    res.json(projects)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Add a new project
router.post("/", async (req, res) => {
  try {
    const { name, userId } = req.body
    const project = new Project({ name, userId })
    await project.save()
    res.status(201).json(project)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router

