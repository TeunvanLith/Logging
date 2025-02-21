import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Project from "@/models/Project"

export async function GET(req: Request) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const projects = await Project.find({ userId })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const { name, userId } = await req.json()

    if (!name || !userId) {
      return NextResponse.json({ error: "Name and user ID are required" }, { status: 400 })
    }

    const project = await Project.create({ name, userId })
    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Error creating project" }, { status: 500 })
  }
}

