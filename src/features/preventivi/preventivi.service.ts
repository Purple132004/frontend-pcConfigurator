import { http } from "@/lib/http"
import type { Preventivo } from "./preventivi.type"

export class PreventiviService {
  static async getAll() {
    return http.get<Preventivo[]>("/preventivi")
  }

  static async getById(id: number) {
    return http.get<Preventivo>(`/preventivi/${id}`)
  }

  static async create(buildId: number) {
    return http.post<Preventivo>("/preventivi", { build_id: buildId })
  }

  static async delete(id: number) {
    return http.delete(`/preventivi/${id}`)
  }

  static async updateStatus(id: number, status: string) {
    return http.put(`/preventivi/${id}/status`, { status })
  }
}