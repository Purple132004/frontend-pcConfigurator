import type { Build } from "@/features/builds/builds.type"
import type { User } from "@/features/users/users.type"

export type PreventivoStatus = "pending" | "confirmed" | "expired"

export type Preventivo = {
  id: number
  build_id: number
  user_id: number
  status: PreventivoStatus
  total_price: string
  created_at: string
  updated_at: string
  build?: Build
  user?: User
}