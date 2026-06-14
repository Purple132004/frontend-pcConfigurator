import { useBuild, usePowerConsumption } from "@/features/builds/builds.queries"
import { useParams, useNavigate } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { componentImages } from "@/assets/components/components-images"
import { ArrowLeft, Zap, ShoppingCart } from "lucide-react"
import { PreventiviService } from "@/features/preventivi/preventivi.service"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"

const BuildDetailPage = () => {
  const { buildId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)

  const { data: build, isLoading } = useBuild(parseInt(buildId ?? "0"))
  const { data: power } = usePowerConsumption(parseInt(buildId ?? "0"))

  const handleCreatePreventivo = async () => {
    if (!build) return
    setCreating(true)
    try {
      await PreventiviService.create(build.id)
      await queryClient.invalidateQueries({ queryKey: ["preventivi"] })
      toast.success("Preventivo creato!")
      navigate("/preventivi")
    } catch {
      toast.error("Errore durante la creazione del preventivo")
    } finally {
      setCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!build) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <p className="text-muted-foreground">Build non trovata</p>
        <Button onClick={() => navigate("/builds")}>Torna alle Build</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/builds")}>
          <ArrowLeft size={16} />
          Indietro
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{build.name}</h1>
          <p className="text-sm text-muted-foreground">
            Creata il {new Date(build.created_at).toLocaleDateString("it-IT")}
          </p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lista componenti */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h2 className="font-semibold">Componenti</h2>
          {build.components && build.components.length > 0 ? (
            build.components.map((component) => (
              <Card key={component.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted p-1">
                    {componentImages[component.id] ? (
                      <img
                        src={componentImages[component.id]}
                        alt={component.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full rounded bg-muted-foreground/10" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{component.name}</span>
                        <Badge variant="outline">{component.brand}</Badge>
                        <Badge variant="secondary">{component.category?.name}</Badge>
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>TDP: {(component.specs as { tdp?: number }).tdp ?? 0}W</span>
                      </div>
                    </div>
                    <span className="font-semibold">
                      €{parseFloat(component.price).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nessun componente</p>
          )}
        </div>

        {/* Riepilogo */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <h2 className="font-semibold">Riepilogo</h2>

              <Separator />

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Componenti</span>
                  <span>{build.components?.length ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap size={14} />
                    Consumo stimato
                  </span>
                  <span className="font-medium">{power?.total_tdp ?? 0}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PSU consigliato</span>
                  <span className="font-medium">{power?.recommended_psu ?? 0}W</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Totale</span>
                <span>€{parseFloat(build.total_price).toFixed(2)}</span>
              </div>

              <Button
                onClick={handleCreatePreventivo}
                disabled={creating}
                className="w-full"
              >
                <ShoppingCart size={16} />
                {creating ? "Creazione..." : "Genera Preventivo"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BuildDetailPage