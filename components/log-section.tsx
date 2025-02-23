"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { nl } from "date-fns/locale"
import toast from "react-hot-toast"
import Image from "next/image"

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
  const [photo, setPhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Data:", date, hours, projectId, userId, remarks, photo);
    if (!date || !hours || !projectId) {
      setError("Vul alle verplichte velden in");
      return;
    }
  
    const data = {
      date, // Ensure this is a valid date string, e.g. "2025-02-23"
      hours: Number(hours), // Make sure hours converts to a valid number
      projectId,
      userId, // Verify userId is not empty
      remarks,
      // photoUrl is optional and omitted in this JSON payload
    };
    console.log("Data:", data);
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to create log");
      }
  
      resetForm();
      onLogsChange();
      toast.success("Log succesvol toegevoegd");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Fout bij het toevoegen van de log");
    }
  };
  
  

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
      toast.success("Log succesvol bewerkt")
    } catch (err) {
      toast.error("Fout bij het bewerken van de log")
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
      toast.success("Log succesvol verwijderd")
    } catch (err) {
      toast.error("Fout bij het verwijderen van de log")
    }
  }

  const resetForm = () => {
    setDate("")
    setHours("")
    setProjectId("")
    setRemarks("")
    setEditingLog(null)
    setError("")
    setPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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

  const renderLogs = () => {
    if (isLoading) {
      return <div className="text-center py-4">Laden...</div>
    }

    if (filteredLogs.length === 0) {
      return <div className="text-center py-4">Geen logs gevonden.</div>
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Uren</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Opmerkingen</TableHead>
              <TableHead>Foto</TableHead>
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
                <TableCell>
                  {log.photoUrl && (
                    <Image
                      src={log.photoUrl || "/placeholder.svg"}
                      alt="Log photo"
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  )}
                </TableCell>
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
                <TableCell colSpan={6} className="text-center">
                  Geen logs gevonden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logboek</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={editingLog ? handleEdit : handleSubmit} className="grid gap-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            <div className="sm:col-span-2 md:col-span-1">
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
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              ref={fileInputRef}
            />
          </div>
          {photo && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(photo) || "/placeholder.svg"}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">{editingLog ? "Bewerken" : "Toevoegen"}</Button>
            {editingLog && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Annuleren
              </Button>
            )}
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Select value={filterProject} onValueChange={setFilterProject}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
          <Button variant="outline" onClick={() => setSortAscending(!sortAscending)} className="w-full sm:w-auto">
            {sortAscending ? "Oplopend" : "Aflopend"}
          </Button>
        </div>

        {renderLogs()}
      </CardContent>
    </Card>
  )
}

