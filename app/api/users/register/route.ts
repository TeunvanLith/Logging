import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const { name, company, pin } = await req.json()

    if (!name || !company || !pin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await User.findOne({ name })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = await User.create({ name, company, pin })
    return NextResponse.json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Error registering user" }, { status: 500 })
  }
}

