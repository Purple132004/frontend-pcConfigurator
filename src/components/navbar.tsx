import { useAuthStore } from "@/features/auth/auth.store"
import { AuthService } from "@/features/auth/auth.service"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { Cpu, LayoutDashboard, LogOut, User } from "lucide-react"

const Navbar = () => {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await AuthService.logout()
      toast.success("Logout effettuato")
      navigate("/login")
    } catch {
      toast.error("Errore durante il logout")
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Cpu size={20} />
            <span>PC Configurator</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Configuratore
            </Link>
            <Link to="/builds" className="hover:text-foreground">
              Le mie Build
            </Link>
            <Link to="/preventivi" className="hover:text-foreground">
              Preventivi
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1 hover:text-foreground"
              >
              
                Pannello Admin
              </Link>
            )}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full">
  <Avatar className="h-8 w-8">
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
</DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground font-normal block">
                  {user?.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut size={14} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar