"use client"

import { useState, useEffect } from "react"
import { LogbookHeader } from "./logbook-header"
import { ProjectSection } from "./project-section"
import { LogSection } from "./log-section"

interface LogbookDashboardProps {
  user: {
    userId: string
    name: string
    company: string
  }
  onLogout: () => void
}

export function LogbookDashboard({ user, onLogout }: LogbookDashboardProps) {
  const [projects, setProjects] = useState([])
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
    fetchLogs()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?userId=${user.userId}`)
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/logs?userId=${user.userId}`)
      const data = await res.json()
      setLogs(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching logs:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LogbookHeader userName={user.name} onLogout={onLogout} />
      <main className="flex-1 p-6 space-y-6 bg-muted/40">
        <div className="max-w-6xl mx-auto space-y-6">
          <ProjectSection userId={user.userId} projects={projects} onProjectsChange={fetchProjects} />
          <LogSection
            userId={user.userId}
            projects={projects}
            logs={logs}
            onLogsChange={fetchLogs}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  )
}

