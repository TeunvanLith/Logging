import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Log from "@/models/Log"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const { date, hours, projectId, remarks } = await req.json()

    if (!date || !hours || !projectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const log = await Log.findByIdAndUpdate(id, { date, hours, projectId, remarks }, { new: true }).populate(
      "projectId",
    )

    return NextResponse.json(log)
  } catch (error) {
    console.error("Error updating log:", error)
    return NextResponse.json({ error: "Error updating log" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    await Log.findByIdAndDelete(id)
    return NextResponse.json({ message: "Log deleted successfully" })
  } catch (error) {
    console.error("Error deleting log:", error)
    return NextResponse.json({ error: "Error deleting log" }, { status: 500 })
  }
}

