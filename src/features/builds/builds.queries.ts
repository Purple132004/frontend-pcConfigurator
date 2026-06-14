import { useQuery } from "@tanstack/react-query"
import { BuildsService } from "./builds.service"

export const useBuilds = () =>
  useQuery({
    queryKey: ["builds"],
    queryFn: async () => {
      const res = await BuildsService.getAll()
      return res.data
    },
  })

export const useBuild = (id: number) =>
  useQuery({
    queryKey: ["builds", id],
    queryFn: async () => {
      const res = await BuildsService.getById(id)
      return res.data
    },
    enabled: !!id,
  })

export const usePowerConsumption = (buildId: number) =>
  useQuery({
    queryKey: ["builds", buildId, "power"],
    queryFn: async () => {
      const res = await BuildsService.getPowerConsumption(buildId)
      return res.data
    },
    enabled: !!buildId,
  })