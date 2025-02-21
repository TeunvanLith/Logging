"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LoginFormProps {
  onLogin: (user: any) => void
  onRegisterClick: () => void
}

export function LoginForm({ onLogin, onRegisterClick }: LoginFormProps) {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pin }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      onLogin(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <Image
              src="https://i.ibb.co/3d7wmrv/logo-procalor-JPG.jpg"
              alt="Logo"
              width={160}
              height={80}
              className="bg-white p-4 rounded-lg"
            />
          </div>
          <CardTitle className="text-2xl">Inloggen</CardTitle>
          <CardDescription>Voer je gegevens in om in te loggen</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input type="text" placeholder="Naam" value={name} onChange={(e) => setName(e.target.value)} required />
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
              Inloggen
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full">
            Nog geen account?{" "}
            <button onClick={onRegisterClick} className="text-primary hover:underline">
              Registreer
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

