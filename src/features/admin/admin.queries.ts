import { useQuery } from "@tanstack/react-query"
import { AdminService } from "./admin.service"

export const useDashboard = () =>
  useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await AdminService.getDashboard()
      return res.data
    },
  })

export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await AdminService.getUsers()
      return res.data
    },
  })

export const useAdminPreventivi = () =>
  useQuery({
    queryKey: ["admin", "preventivi"],
    queryFn: async () => {
      const res = await AdminService.getAllPreventivi()
      return res.data
    },
  })