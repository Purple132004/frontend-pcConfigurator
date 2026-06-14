import axios from "axios"
import { myEnv } from "./env"
import { useAuthStore } from "@/features/auth/auth.store"

export const http = axios.create({
  baseURL: myEnv.backendApiUrl,
  headers: {
    Accept: "application/json",
  },
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})