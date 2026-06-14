import { useQuery } from "@tanstack/react-query"
import { ComponentsService } from "./components.service"

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await ComponentsService.getCategories()
      return res.data
    },
  })

export const useComponents = () =>
  useQuery({
    queryKey: ["components"],
    queryFn: async () => {
      const res = await ComponentsService.getAll()
      return res.data
    },
  })

export const useComponentsByCategory = (slug: string) =>
  useQuery({
    queryKey: ["components", slug],
    queryFn: async () => {
      const res = await ComponentsService.getByCategory(slug)
      return res.data
    },
    enabled: !!slug,
  })

export const useCompatibleComponents = (slug: string, selectedIds: number[]) =>
  useQuery({
    queryKey: ["components", "compatible", slug, selectedIds],
    queryFn: async () => {
      const res = await ComponentsService.getCompatible(slug, selectedIds)
      return res.data
    },
    enabled: !!slug,
  })