import { useState } from "react"
import { useCategories, useCompatibleComponents } from "@/features/components/components.queries"
import { BuildsService } from "@/features/builds/builds.service"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { Component } from "@/features/components/components.type"
import { Plus, Trash2, Zap, ShoppingCart } from "lucide-react"
import { componentImages } from "@/assets/components/components-images"

const ConfiguratorePage = () => {
  const queryClient = useQueryClient()
  const { data: categories, isLoading: loadingCategories } = useCategories()

  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [buildName, setBuildName] = useState("")
  const [saving, setSaving] = useState(false)

  const selectedIds = selectedComponents.map((c) => c.id)

  const { data: compatibleComponents, isLoading: loadingComponents } =
    useCompatibleComponents(selectedCategory, selectedIds)

  const availableComponents = compatibleComponents?.filter(
    (c) => !selectedComponents.find((s) => s.id === c.id)
  )

  const totalPrice = selectedComponents.reduce(
    (acc, c) => acc + parseFloat(c.price),
    0
  )

  const totalTdp = selectedComponents.reduce((acc, c) => {
    const specs = c.specs as { tdp?: number }
    return acc + (specs.tdp ?? 0)
  }, 0)

  const handleAddComponent = (component: Component) => {
    const alreadyExists = selectedComponents.find(
      (c) => c.category_id === component.category_id
    )
    if (alreadyExists) {
      setSelectedComponents((prev) =>
        prev.map((c) =>
          c.category_id === component.category_id ? component : c
        )
      )
    } else {
      setSelectedComponents((prev) => [...prev, component])
    }
    toast.success(`${component.name} aggiunto alla build`)
  }

  const handleRemoveComponent = (component: Component) => {
    setSelectedComponents((prev) => prev.filter((c) => c.id !== component.id))
    toast.info(`${component.name} rimosso dalla build`)
  }

  const handleSaveBuild = async () => {
    if (!buildName.trim()) {
      toast.error("Inserisci un nome per la build")
      return
    }

    if (selectedComponents.length < 5) {
      const categoriesSelected = selectedComponents.map((c) => c.category_id)
      const allCategories = categories?.map((c) => c.id) ?? []
      const missing = allCategories.filter((id) => !categoriesSelected.includes(id))
      const missingNames = categories
        ?.filter((c) => missing.includes(c.id))
        .map((c) => c.name)
        .join(", ")

      toast.error(`Componenti mancanti: ${missingNames}`)
      return
    }

    setSaving(true)
    try {
      const res = await BuildsService.create(buildName)
      const build = res.data
      for (const component of selectedComponents) {
        await BuildsService.addComponent(build.id, component.id)
      }
      await queryClient.invalidateQueries({ queryKey: ["builds"] })
      toast.success("Build salvata con successo!")
      setSelectedComponents([])
      setBuildName("")
    } catch {
      toast.error("Errore durante il salvataggio")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configuratore PC</h1>
        <p className="text-muted-foreground text-sm">
          Seleziona i componenti per assemblare il tuo PC
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {loadingCategories ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))
            ) : (
              categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </Button>
              ))
            )}
          </div>

          {selectedCategory && (
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Componenti disponibili
              </h2>
              {loadingComponents ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))
              ) : availableComponents?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nessun componente compatibile trovato
                </p>
              ) : (
                availableComponents?.map((component) => (
                  <Card
                    key={component.id}
                    className="cursor-pointer transition-all hover:border-foreground/30"
                    onClick={() => handleAddComponent(component)}
                  >
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
                          </div>
                          <span className="text-xs text-muted-foreground">
                            TDP: {(component.specs as { tdp?: number }).tdp ?? 0}W
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            €{parseFloat(component.price).toFixed(2)}
                          </span>
                          <Plus size={16} className="text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col gap-4 p-4">
              <h2 className="font-semibold">La tua Build</h2>

              {selectedComponents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nessun componente selezionato
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedComponents.map((component) => (
                    <div
                      key={component.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {component.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          €{parseFloat(component.price).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveComponent(component)
                        }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Zap size={14} />
                    Consumo stimato
                  </span>
                  <span className="font-medium">{totalTdp}W</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Totale</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <input
                type="text"
                placeholder="Nome della build..."
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20"
              />

              <Button
                onClick={handleSaveBuild}
                disabled={saving || selectedComponents.length === 0}
                className="w-full"
              >
                <ShoppingCart size={16} />
                {saving ? "Salvataggio..." : "Salva Build"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ConfiguratorePage