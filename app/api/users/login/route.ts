import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const { name, pin } = await req.json()

    if (!name || !pin) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const user = await User.findOne({ name })
    if (!user || user.pin !== pin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      userId: user._id,
      name: user.name,
      company: user.company,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error during login" }, { status: 500 })
  }
}

