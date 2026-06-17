import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCategories, useComponents } from "@/features/components/components.queries"
import { ComponentsService } from "@/features/components/components.service"
import { componentImages } from "@/assets/components/components-images"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type {  ComponentSpecs } from "@/features/components/components.type"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Trash2, Pencil } from "lucide-react"
import type { Component } from "@/features/components/components.type"

const componentSchema = z.object({
  name: z.string().min(2, "Nome minimo 2 caratteri"),
  brand: z.string().min(2, "Marca minimo 2 caratteri"),
  price: z.string().min(1, "Prezzo obbligatorio"),
  category_id: z.string().min(1, "Seleziona una categoria"),
  tdp: z.string().min(1, "TDP obbligatorio"),
})

const editSchema = z.object({
  name: z.string().min(2, "Nome minimo 2 caratteri"),
  brand: z.string().min(2, "Marca minimo 2 caratteri"),
  price: z.string().min(1, "Prezzo obbligatorio"),
  tdp: z.string().min(1, "TDP obbligatorio"),
})

type ComponentForm = z.infer<typeof componentSchema>
type EditForm = z.infer<typeof editSchema>

const ComponentsPage = () => {
  const queryClient = useQueryClient()
  const { data: categories } = useCategories()
  const { data: components, isLoading: loadingComponents } = useComponents()
  const [saving, setSaving] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ComponentForm>({
    resolver: zodResolver(componentSchema),
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
  })

  const onSubmit = async (data: ComponentForm) => {
    setSaving(true)
    try {
      await ComponentsService.create({
        category_id: parseInt(data.category_id),
        name: data.name,
        brand: data.brand,
        price: parseFloat(data.price),
        specs: {
          tdp: parseInt(data.tdp),
        },
        is_active: true,
      })
      await queryClient.invalidateQueries({ queryKey: ["components"] })
      toast.success("Componente aggiunto con successo!")
      reset()
      setSelectedCategoryId("")
    } catch {
      toast.error("Errore durante il salvataggio")
    } finally {
      setSaving(false)
    }
  }

  const onEditSubmit = async (data: EditForm) => {
  if (!editingComponent) return
  setEditSaving(true)
  try {
    await ComponentsService.update(editingComponent.id, {
      name: data.name,
      brand: data.brand,
      price: data.price,
      specs: {
        ...(editingComponent.specs as object),
        tdp: parseInt(data.tdp),
      } as ComponentSpecs,
    })
    await queryClient.invalidateQueries({ queryKey: ["components"] })
    toast.success("Componente aggiornato!")
    setEditingComponent(null)
  } catch {
    toast.error("Errore durante la modifica")
  } finally {
    setEditSaving(false)
  }
}

  const handleDelete = async (id: number) => {
    try {
      await ComponentsService.delete(id)
      await queryClient.invalidateQueries({ queryKey: ["components"] })
      toast.success("Componente eliminato")
    } catch {
      toast.error("Errore durante l'eliminazione")
    }
  }

  const filteredComponents = components?.filter((c) => {
    if (selectedCategoryFilter === "all") return true
    return c.category?.slug === selectedCategoryFilter
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Gestione Catalogo</h1>
        <p className="text-muted-foreground text-sm">
          Aggiungi, modifica o elimina componenti dal catalogo
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Accordion multiple={false} defaultValue={["add-component"]}>
                <AccordionItem value="add-component" className="border-none">
                  <AccordionTrigger className="py-2 font-semibold">
                    <div className="flex items-center gap-2">
                      <Plus size={16} />
                      Aggiungi Componente
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <div className="flex flex-col gap-1">
                        <Label>Categoria</Label>
                        <Select
                          value={selectedCategoryId}
                          onValueChange={(val) => {
                            if (val) {
                              setSelectedCategoryId(val)
                              setValue("category_id", val)
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleziona categoria">
                              {selectedCategoryId
                                ? categories?.find(
                                    (c) => c.id.toString() === selectedCategoryId
                                  )?.name
                                : "Seleziona categoria"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category_id && (
                          <p className="text-xs text-destructive">
                            {errors.category_id.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label>Nome</Label>
                        <Input placeholder="es. Ryzen 5 5600X" {...register("name")} />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label>Marca</Label>
                        <Input placeholder="es. AMD" {...register("brand")} />
                        {errors.brand && (
                          <p className="text-xs text-destructive">{errors.brand.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label>Prezzo (€)</Label>
                        <Input type="number" step="0.01" placeholder="es. 199.99" {...register("price")} />
                        {errors.price && (
                          <p className="text-xs text-destructive">{errors.price.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label>TDP (Watt)</Label>
                        <Input type="number" placeholder="es. 65" {...register("tdp")} />
                        {errors.tdp && (
                          <p className="text-xs text-destructive">{errors.tdp.message}</p>
                        )}
                      </div>

                      <Button type="submit" disabled={saving} className="w-full">
                        {saving ? "Salvataggio..." : "Aggiungi Componente"}
                      </Button>
                    </form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategoryFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategoryFilter("all")}
            >
              Tutti
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={selectedCategoryFilter === cat.slug ? "default" : "outline"}
                onClick={() => setSelectedCategoryFilter(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <Separator />

          {loadingComponents
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            : filteredComponents?.map((component) => (
                <Card key={component.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border bg-muted p-1">
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
                        <span className="text-sm text-muted-foreground">
                          €{parseFloat(component.price).toFixed(2)} — TDP:{" "}
                          {(component.specs as { tdp?: number }).tdp ?? 0}W
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingComponent(component)
                            resetEdit({
                              name: component.name,
                              brand: component.brand,
                              price: parseFloat(component.price).toString(),
                              tdp: ((component.specs as { tdp?: number }).tdp ?? 0).toString(),
                            })
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(component.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      <Dialog
        open={!!editingComponent}
        onOpenChange={(open) => {
          if (!open) setEditingComponent(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Componente</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmitEdit(onEditSubmit)}
            className="flex flex-col gap-3 pt-2"
          >
            <div className="flex flex-col gap-1">
              <Label>Nome</Label>
              <Input placeholder="es. Ryzen 5 5600X" {...registerEdit("name")} />
              {editErrors.name && (
                <p className="text-xs text-destructive">{editErrors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Marca</Label>
              <Input placeholder="es. AMD" {...registerEdit("brand")} />
              {editErrors.brand && (
                <p className="text-xs text-destructive">{editErrors.brand.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>Prezzo (€)</Label>
              <Input type="number" step="0.01" placeholder="es. 199.99" {...registerEdit("price")} />
              {editErrors.price && (
                <p className="text-xs text-destructive">{editErrors.price.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label>TDP (Watt)</Label>
              <Input type="number" placeholder="es. 65" {...registerEdit("tdp")} />
              {editErrors.tdp && (
                <p className="text-xs text-destructive">{editErrors.tdp.message}</p>
              )}
            </div>
            <Button type="submit" disabled={editSaving} className="w-full">
              {editSaving ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ComponentsPage