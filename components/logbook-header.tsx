import { Button } from "@/components/ui/button"
import { Frame } from "lucide-react"

interface LogbookHeaderProps {
  userName: string
  onLogout: () => void
}

export function LogbookHeader({ userName, onLogout }: LogbookHeaderProps) {
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
      <div className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4">
        <Frame className="w-6 h-6" />
        <span>Uren Logboek</span>
      </div>
      <nav className="hidden font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
        <span className="font-bold">Settings</span>
      </nav>
      <div className="flex items-center ml-auto gap-4">
        <span className="text-sm text-muted-foreground">Welkom, {userName}</span>
        <Button variant="ghost" onClick={onLogout}>
          Uitloggen
        </Button>
      </div>
    </header>
  )
}

