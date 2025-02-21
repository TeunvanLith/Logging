import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Project from "@/models/Project"
import Log from "@/models/Log"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params

    // Check if project has any logs
    const hasLogs = await Log.exists({ projectId: id })
    if (hasLogs) {
      return NextResponse.json({ error: "Cannot delete project with existing logs" }, { status: 400 })
    }

    await Project.findByIdAndDelete(id)
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 })
  }
}

