import { Button } from "@/components/ui/button"
import { Frame } from "lucide-react"

interface LogbookHeaderProps {
  userName: string
  onLogout: () => void
}

export function LogbookHeader({ userName, onLogout }: LogbookHeaderProps) {
  return (
    <header className="flex items-center h-16 px-4 md:px-6 bg-black bg-opacity-70 text-white">
      <div className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4">
        <Frame className="w-6 h-6" />
        <span>Uren Logboek</span>
      </div>
      <div className="flex items-center ml-auto gap-4">
        <span className="text-sm">Welkom, {userName}</span>
        <Button style={{ backgroundColor: "#9E1A1A" }} onClick={onLogout} className="text-white">
          Uitloggen
        </Button>
      </div>
    </header>
  )
}

