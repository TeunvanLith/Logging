import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Log from "@/models/Log"

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const logs = await Log.find({ userId }).populate("projectId")
    return NextResponse.json(logs)
  } catch (error) {
    console.error("Error fetching logs:", error)
    return NextResponse.json({ error: "Error fetching logs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const { date, hours, projectId, userId, remarks } = await req.json()

    if (!date || !hours || !projectId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const log = await Log.create({
      date,
      hours,
      projectId,
      userId,
      remarks,
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error("Error creating log:", error)
    return NextResponse.json({ error: "Error creating log" }, { status: 500 })
  }
}

