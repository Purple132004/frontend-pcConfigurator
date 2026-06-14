import { useQuery } from "@tanstack/react-query"
import { PreventiviService } from "./preventivi.service"

export const usePreventivi = () =>
  useQuery({
    queryKey: ["preventivi"],
    queryFn: async () => {
      const res = await PreventiviService.getAll()
      return res.data
    },
  })

export const usePreventivo = (id: number) =>
  useQuery({
    queryKey: ["preventivi", id],
    queryFn: async () => {
      const res = await PreventiviService.getById(id)
      return res.data
    },
    enabled: !!id,
  })