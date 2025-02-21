"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ProjectSectionProps {
  userId: string
  projects: any[]
  onProjectsChange: () => void
}

export function ProjectSection({ userId, projects, onProjectsChange }: ProjectSectionProps) {
  const [projectName, setProjectName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!projectName.trim()) {
      setError("Voer een projectnaam in")
      return
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, userId }),
      })

      if (!res.ok) {
        throw new Error("Failed to create project")
      }

      setProjectName("")
      onProjectsChange()
    } catch (err) {
      setError("Fout bij het toevoegen van het project")
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Weet u zeker dat u dit project wilt verwijderen?")) {
      return
    }

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete project")
      }

      onProjectsChange()
    } catch (err) {
      setError("Fout bij het verwijderen van het project")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projecten</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-4 mb-4">
          <Input
            placeholder="Naam van project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Project Toevoegen</Button>
        </form>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <div className="flex flex-wrap gap-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-background text-foreground px-3 py-2 rounded-md flex items-center gap-2"
            >
              <span>{project.name}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(project._id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {projects.length === 0 && <p className="text-muted-foreground">Nog geen projecten.</p>}
        </div>
      </CardContent>
    </Card>
  )
}

