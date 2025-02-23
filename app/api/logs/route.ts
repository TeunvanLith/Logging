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

    const logs = await Log.find({ userId }).populate("projectId").sort({ date: -1 })

    return NextResponse.json(logs)
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching logs", details: (error as Error).message },
      { status: 500 }
    )
  }
}


export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { date, hours, projectId, userId, remarks } = await req.json();
    if (!date || !hours || !projectId || !userId)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (typeof hours !== "number" || hours <= 0)
      return NextResponse.json({ error: "Invalid hours value" }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });

    const newLog = new Log({ date, hours, projectId, userId, remarks });
    await newLog.save();
    await newLog.populate("projectId");

    return NextResponse.json({
      message: "Log created successfully",
      logId: newLog._id,
      date: newLog.date,
      hours: newLog.hours,
      projectName: newLog.projectId.name,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the log" },
      { status: error.name === "ValidationError" ? 400 : 500 }
    );
  }
}



