"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { LogbookDashboard } from "@/components/logbook-dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register" | "logbook">("login")
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setCurrentScreen("logbook")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentScreen("login")
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("https://i.ibb.co/Q7zx0tnn/26523.jpg")`,
      }}
    >
      {currentScreen === "login" && (
        <LoginForm onLogin={handleLogin} onRegisterClick={() => setCurrentScreen("register")} />
      )}
      {currentScreen === "register" && (
        <RegisterForm
          onRegisterSuccess={(name) => {
            setCurrentScreen("login")
            return name
          }}
          onLoginClick={() => setCurrentScreen("login")}
        />
      )}
      {currentScreen === "logbook" && currentUser && <LogbookDashboard user={currentUser} onLogout={handleLogout} />}
    </main>
  )
}

