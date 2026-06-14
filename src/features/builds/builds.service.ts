import { http } from "@/lib/http"
import type { Build, BuildComparison, PowerConsumption } from "./builds.type"

export class BuildsService {
  static async getAll() {
    return http.get<Build[]>("/builds")
  }

  static async getById(id: number) {
    return http.get<Build>(`/builds/${id}`)
  }

  static async create(name: string) {
    return http.post<Build>("/builds", { name })
  }

  static async delete(id: number) {
    return http.delete(`/builds/${id}`)
  }

  static async addComponent(buildId: number, componentId: number, quantity: number = 1) {
    return http.post(`/builds/${buildId}/components`, {
      component_id: componentId,
      quantity,
    })
  }

  static async removeComponent(buildId: number, componentId: number) {
    return http.delete(`/builds/${buildId}/components`, {
      data: { component_id: componentId },
    })
  }

  static async getPowerConsumption(buildId: number) {
    return http.get<PowerConsumption>(`/builds/${buildId}/power`)
  }

  static async compare(buildAId: number, buildBId: number) {
    return http.post<BuildComparison>("/builds/compare", {
      build_a_id: buildAId,
      build_b_id: buildBId,
    })
  }
}