import { http } from "@/lib/http"
import { useAuthStore } from "./auth.store"
import type { User } from "@/features/users/users.type"

export type LoginData = {
  email: string
  password: string
}

export type RegisterData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export class AuthService {
  static async login(data: LoginData) {
    const res = await http.post<{ token: string; user: User }>(
      "/auth/login",
      data
    )
    const { token, user } = res.data
    if (!token) {
      throw new Error("Token non valido")
    }
    useAuthStore.getState().login(user, token)
    return res
  }

  static async register(data: RegisterData) {
    return http.post<{ token: string; user: User }>("/auth/register", data)
  }

  static async me() {
    return http.get<User>("/auth/me")
  }

  static async logout() {
    await http.post("/auth/logout")
    useAuthStore.getState().logout()
  }
}