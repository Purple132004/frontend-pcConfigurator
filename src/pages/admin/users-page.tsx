import { useAdminUsers } from "@/features/admin/admin.queries"
import { AdminService } from "@/features/admin/admin.service"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Shield, ShieldOff } from "lucide-react"

const UsersPage = () => {
  const { data: users, isLoading } = useAdminUsers()
  const queryClient = useQueryClient()

  const handleToggleRole = async (id: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    try {
      await AdminService.updateUserRole(id, newRole)
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success(`Ruolo aggiornato a ${newRole}`)
    } catch {
      toast.error("Errore durante l'aggiornamento del ruolo")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await AdminService.deleteUser(id)
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("Utente eliminato")
    } catch {
      toast.error("Errore durante l'eliminazione")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Gestione Utenti</h1>
        <p className="text-muted-foreground text-sm">
          Visualizza e gestisci gli utenti della piattaforma
        </p>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))
      ) : users?.length === 0 ? (
        <p className="text-muted-foreground">Nessun utente presente</p>
      ) : (
        <div className="flex flex-col gap-4">
          {users?.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{user.name}</span>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>
                      {user.role === "admin" ? "Admin" : "Utente"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>Build: {user.builds_count}</span>
                    <span>Preventivi: {user.quotes_count}</span>
                    <span>
                      Registrato il:{" "}
                      {new Date(user.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRole(user.id, user.role)}
                  >
                    {user.role === "admin" ? (
                      <>
                        <ShieldOff size={14} />
                        Rimuovi Admin
                      </>
                    ) : (
                      <>
                        <Shield size={14} />
                        Rendi Admin
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersPage