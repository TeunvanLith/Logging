import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  title: "Uren Logboek App",
  description: "Een applicatie voor het bijhouden van gewerkte uren",
    generator: 'v0.dev'
}



import './globals.css'