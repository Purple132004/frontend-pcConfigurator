import { http } from "@/lib/http"
import type { DashboardStats, UserWithCounts } from "./admin.type"

export class AdminService {
  static async getDashboard() {
    return http.get<DashboardStats>("/admin/dashboard")
  }

  static async getUsers() {
    return http.get<UserWithCounts[]>("/admin/users")
  }

  static async updateUserRole(userId: number, role: "user" | "admin") {
    return http.put(`/admin/users/${userId}/role`, { role })
  }

  static async deleteUser(userId: number) {
    return http.delete(`/admin/users/${userId}`)
  }

  static async updateComponentPrice(componentId: number, price: number) {
    return http.put(`/admin/components/${componentId}/price`, { price })
  }

  static async getAllPreventivi() {
    return http.get("/admin/preventivi")
  }
  
}