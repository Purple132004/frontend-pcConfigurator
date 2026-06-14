import { http } from "@/lib/http"
import type { Component, ComponentCategory } from "./components.type"

export class ComponentsService {
  static async getCategories() {
    return http.get<ComponentCategory[]>("/categories")
  }

  static async getAll() {
    return http.get<Component[]>("/components")
  }

  static async getByCategory(slug: string) {
    return http.get<Component[]>(`/components/category/${slug}`)
  }

  static async getCompatible(slug: string, selectedIds: number[]) {
    return http.post<Component[]>(`/components/compatible/${slug}`, {
      selected: selectedIds,
    })
  }

  static async updatePrice(id: number, price: number) {
    return http.put(`/admin/components/${id}/price`, { price })
  }

  static async create(data: object) {
    return http.post<Component>("/components", data)
  }

  static async update(id: number, data: Partial<Component>) {
    return http.put<Component>(`/components/${id}`, data)
  }

  static async delete(id: number) {
    return http.delete(`/components/${id}`)
  }
}