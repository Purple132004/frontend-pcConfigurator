import { useBuilds } from "@/features/builds/builds.queries"
import { BuildsService } from "@/features/builds/builds.service"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Eye, FileText } from "lucide-react"
import { useNavigate } from "react-router"
import { PreventiviService } from "@/features/preventivi/preventivi.service"
import { componentImages } from "@/assets/components/components-images"

const BuildsPage = () => {
  const { data: builds, isLoading } = useBuilds()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    try {
      await BuildsService.delete(id)
      await queryClient.invalidateQueries({ queryKey: ["builds"] })
      toast.success("Build eliminata")
    } catch {
      toast.error("Errore durante l'eliminazione")
    }
  }

  const handleCreatePreventivo = async (buildId: number) => {
    try {
      await PreventiviService.create(buildId)
      await queryClient.invalidateQueries({ queryKey: ["preventivi"] })
      toast.success("Preventivo creato!")
      navigate("/preventivi")
    } catch {
      toast.error("Errore durante la creazione del preventivo")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Le mie Build</h1>
        <p className="text-muted-foreground text-sm">
          Gestisci le tue configurazioni PC salvate
        </p>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      ) : builds?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">Nessuna build salvata</p>
          <Button onClick={() => navigate("/")}>Crea la tua prima build</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {builds?.map((build) => (
            <Card key={build.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{build.name}</span>
                    
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      Totale: €{parseFloat(build.total_price).toFixed(2)}
                    </span>
                    <span>
                      Creata il:{" "}
                      {new Date(build.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  {build.components && build.components.length > 0 && (
  <div className="flex flex-col gap-2">
    <div className="flex flex-wrap gap-1">
      {build.components.map((c) => (
        <Badge key={c.id} variant="secondary">
          {c.name}
        </Badge>
      ))}
    </div>
    <div className="flex flex-wrap gap-2">
      {build.components.map((c) => (
        <div key={c.id} className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted p-1">
          {componentImages[c.id] ? (
            <img
              src={componentImages[c.id]}
              alt={c.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="h-full w-full rounded bg-muted-foreground/10" />
          )}
        </div>
      ))}
    </div>
  </div>
)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/builds/${build.id}`)}
                  >
                    <Eye size={14} />
                    Dettaglio
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreatePreventivo(build.id)}
                  >
                    <FileText size={14} />
                   Genera Preventivo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(build.id)}
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

export default BuildsPage