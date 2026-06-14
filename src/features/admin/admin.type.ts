import type { Build } from "@/features/builds/builds.type"
import type { Preventivo } from "@/features/preventivi/preventivi.type"
import type { User } from "@/features/users/users.type"

export type DashboardStats = {
  total_users: number
  total_builds: number
  total_quotes: number
  total_components: number
  recent_builds: Build[]
  recent_quotes: Preventivo[]
}

export type UserWithCounts = User & {
  builds_count: number
  quotes_count: number
}