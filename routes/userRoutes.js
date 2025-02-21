import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, company, pin } = req.body
    const user = new User({ name, company, pin })
    await user.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { name, pin } = req.body
    const user = await User.findOne({ name })
    if (user && user.pin === pin) {
      res.json({ userId: user._id, name: user.name, company: user.company })
    } else {
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

export default router

