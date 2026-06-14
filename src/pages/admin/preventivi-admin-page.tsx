import { useAdminPreventivi } from "@/features/admin/admin.queries"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Preventivo } from "@/features/preventivi/preventivi.type"

const PreventiviAdminPage = () => {
  const { data: preventivi, isLoading } = useAdminPreventivi()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Gestione Preventivi</h1>
        <p className="text-muted-foreground text-sm">
          Visualizza tutti i preventivi degli utenti
        </p>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      ) : (preventivi as Preventivo[])?.length === 0 ? (
        <p className="text-muted-foreground">Nessun preventivo presente</p>
      ) : (
        <div className="flex flex-col gap-4">
          {(preventivi as Preventivo[])?.map((preventivo) => (
            <Card key={preventivo.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">
                    Preventivo #{preventivo.id}
                  </span>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>
                      Utente:{" "}
                      <span className="text-foreground font-medium">
                        {preventivo.user?.name ?? `#${preventivo.user_id}`}
                      </span>
                    </span>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default PreventiviAdminPage