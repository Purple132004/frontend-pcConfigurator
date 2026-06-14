import { useDashboard } from "@/features/admin/admin.queries"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Cpu, Wrench, FileText } from "lucide-react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const DashboardPage = () => {
  const { data: stats, isLoading } = useDashboard()
  const navigate = useNavigate()

  const statCards = [
    {
      label: "Utenti",
      value: stats?.total_users ?? 0,
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Builds Salvate",
      value: stats?.total_builds ?? 0,
      icon: Wrench,
      path: "/builds",
    },
    {
      label: "Preventivi",
      value: stats?.total_quotes ?? 0,
      icon: FileText,
      path: "/admin/preventivi",
    },
    {
      label: "Catalogo Componenti",
      value: stats?.total_components ?? 0,
      icon: Cpu,
      path: "/admin/components",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))
          : statCards.map((stat) => (
              <Card
                key={stat.label}
                className="cursor-pointer transition-all hover:border-foreground/30"
                onClick={() => navigate(stat.path)}
              >
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                    <stat.icon size={16} className="text-muted-foreground" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Build recenti */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Build recenti</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/builds")}
            >
              Vedi tutte
            </Button>
          </div>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          ) : stats?.recent_builds?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna build</p>
          ) : (
            stats?.recent_builds?.map((build) => (
              <Card key={build.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{build.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {build.user?.name} —{" "}
                      {new Date(build.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      €{parseFloat(build.total_price).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preventivi recenti */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Preventivi recenti</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/preventivi")}
            >
              Vedi tutti
            </Button>
          </div>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))
          ) : stats?.recent_quotes?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun preventivo</p>
          ) : (
            stats?.recent_quotes?.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="flex items-center justify-between p-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      Preventivo #{quote.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {quote.user?.name} —{" "}
                      {new Date(quote.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      €{parseFloat(quote.total_price).toFixed(2)}
                    </span>
                    
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage