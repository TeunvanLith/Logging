"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RegisterFormProps {
  onRegisterSuccess: (name: string) => void
  onLoginClick: () => void
}

export function RegisterForm({ onRegisterSuccess, onLoginClick }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (name.includes(" ")) {
      setError("Naam mag geen spaties bevatten")
      return
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, pin }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      onRegisterSuccess(name)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Registreren</CardTitle>
          <CardDescription>Maak een nieuw account aan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Naam (geen spaties)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Bedrijfsnaam"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Pincode"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Registreren
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Al een account?{" "}
            <button onClick={onLoginClick} className="text-primary hover:underline">
              Inloggen
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

