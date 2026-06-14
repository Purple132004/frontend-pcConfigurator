import { usePreventivi } from "@/features/preventivi/preventivi.queries"
import { PreventiviService } from "@/features/preventivi/preventivi.service"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, FileDown } from "lucide-react"
import { useNavigate } from "react-router"
import { jsPDF } from "jspdf"
import type { Preventivo } from "@/features/preventivi/preventivi.type"

const generatePDF = (preventivo: Preventivo) => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Preventivo PC Configurator", 20, 20)

  doc.setFontSize(12)
  doc.text(`Preventivo #${preventivo.id}`, 20, 35)
  doc.text(
    `Data: ${new Date(preventivo.created_at).toLocaleDateString("it-IT")}`,
    20,
    43
  )

  if (preventivo.build?.name) {
    doc.text(`Build: ${preventivo.build.name}`, 20, 51)
  }

  doc.setFontSize(14)
  doc.text("Componenti:", 20, 65)

  let y = 75
  if (preventivo.build?.components && preventivo.build.components.length > 0) {
    doc.setFontSize(11)
    preventivo.build.components.forEach((component) => {
      doc.text(
        `• ${component.name} (${component.brand}) — €${parseFloat(component.price).toFixed(2)}`,
        25,
        y
      )
      y += 10
    })
  }

  y += 5
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  y += 10

  doc.setFontSize(14)
  doc.text(
    `Totale: €${parseFloat(preventivo.total_price).toFixed(2)}`,
    20,
    y
  )

  doc.save(`preventivo-${preventivo.id}.pdf`)
}

const PreventiviPage = () => {
  const { data: preventivi, isLoading } = usePreventivi()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleDelete = async (id: number) => {
    try {
      await PreventiviService.delete(id)
      await queryClient.invalidateQueries({ queryKey: ["preventivi"] })
      toast.success("Preventivo eliminato")
    } catch {
      toast.error("Errore durante l'eliminazione")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">I miei Preventivi</h1>
        <p className="text-muted-foreground text-sm">
          Storico dei preventivi generati dalle tue build
        </p>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      ) : preventivi?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <p className="text-muted-foreground">Nessun preventivo generato</p>
          <Button onClick={() => navigate("/builds")}>
            Vai alle tue Build
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {preventivi?.map((preventivo) => (
            <Card key={preventivo.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">
                    Preventivo #{preventivo.id}
                  </span>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      Build:{" "}
                      <span className="text-foreground font-medium">
                        {preventivo.build?.name ?? `#${preventivo.build_id}`}
                      </span>
                    </span>
                    <span>
                      Totale:{" "}
                      <span className="text-foreground font-medium">
                        €{parseFloat(preventivo.total_price).toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Creato il:{" "}
                      {new Date(preventivo.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  {preventivo.build?.components &&
                    preventivo.build.components.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {preventivo.build.components.map((c) => (
                          <Badge key={c.id} variant="secondary">
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePDF(preventivo)}
                  >
                    <FileDown size={14} />
                    Esporta PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(preventivo.id)}
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

export default PreventiviPage