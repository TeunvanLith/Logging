"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

interface LogSectionProps {
  userId: string
  projects: any[]
  logs: any[]
  onLogsChange: () => void
  isLoading: boolean
}

export function LogSection({ userId, projects, logs, onLogsChange, isLoading }: LogSectionProps) {
  const [date, setDate] = useState("")
  const [hours, setHours] = useState("")
  const [projectId, setProjectId] = useState("")
  const [remarks, setRemarks] = useState("")
  const [error, setError] = useState("")
  const [editingLog, setEditingLog] = useState<any>(null)
  const [sortAscending, setSortAscending] = useState(true)
  const [filterProject, setFilterProject] = useState("all")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!date || !hours || !projectId) {
      setError("Vul alle verplichte velden in")
      return
    }

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          hours: Number(hours),
          projectId,
          userId,
          remarks,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create log")
      }

      resetForm()
      onLogsChange()
    } catch (err) {
      setError("Fout bij het toevoegen van de log")
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!editingLog || !date || !hours || !projectId) {
      setError("Vul alle verplichte velden in")
      return
    }

    try {
      const res = await fetch(`/api/logs/${editingLog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          hours: Number(hours),
          projectId,
          remarks,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update log")
      }

      resetForm()
      onLogsChange()
    } catch (err) {
      setError("Fout bij het bewerken van de log")
    }
  }

  const handleDelete = async (logId: string) => {
    if (!confirm("Weet u zeker dat u deze log wilt verwijderen?")) {
      return
    }

    try {
      const res = await fetch(`/api/logs/${logId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete log")
      }

      onLogsChange()
    } catch (err) {
      setError("Fout bij het verwijderen van de log")
    }
  }

  const resetForm = () => {
    setDate("")
    setHours("")
    setProjectId("")
    setRemarks("")
    setEditingLog(null)
    setError("")
  }

  const startEdit = (log: any) => {
    setEditingLog(log)
    setDate(log.date.split("T")[0])
    setHours(log.hours.toString())
    setProjectId(log.projectId._id)
    setRemarks(log.remarks || "")
  }

  const filteredLogs = logs
    .filter((log) => filterProject === "all" || log.projectId._id === filterProject)
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logboek</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={editingLog ? handleEdit : handleSubmit} className="grid gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Aantal uren"
                step="0.1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
            <div>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea placeholder="Opmerkingen" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit">{editingLog ? "Bewerken" : "Toevoegen"}</Button>
            {editingLog && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuleren
              </Button>
            )}
          </div>
        </form>

        <div className="flex gap-4 mb-4">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter op project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle projecten</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortAscending(!sortAscending)}>
            {sortAscending ? "Oplopend" : "Aflopend"}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Laden...</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Uren</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Opmerkingen</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{format(new Date(log.date), "dd MMMM yyyy", { locale: nl })}</TableCell>
                    <TableCell>{log.hours}</TableCell>
                    <TableCell>{log.projectId.name}</TableCell>
                    <TableCell>{log.remarks}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(log)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(log._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Geen logs gevonden
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

