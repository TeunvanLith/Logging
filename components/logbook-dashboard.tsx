"use client"

import { useState, useEffect } from "react"
import { LogbookHeader } from "./logbook-header"
import { ProjectSection } from "./project-section"
import { LogSection } from "./log-section"
import { toast } from "react-hot-toast"

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchLogs()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?userId=${user.userId}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast.error("Fout bij het ophalen van de projecten")
    }
  }

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch(`/api/logs?userId=${user.userId}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
      setError((error as Error).message)
      toast.error("Fout bij het ophalen van de logs")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LogbookHeader userName={user.name} onLogout={onLogout} />
      <main className="flex-1 p-6 space-y-6 bg-muted/40">
        <div className="max-w-6xl mx-auto space-y-6">
          <ProjectSection userId={user.userId} projects={projects} onProjectsChange={fetchProjects} />
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <LogSection
              userId={user.userId}
              projects={projects}
              logs={logs}
              onLogsChange={fetchLogs}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </div>
  )
}

