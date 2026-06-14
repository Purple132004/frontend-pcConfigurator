import type { Component } from "@/features/components/components.type"
import type { User } from "@/features/users/users.type"

export type BuildStatus = "draft" | "complete"

export type BuildComponent = {
  id: number
  build_id: number
  component_id: number
  quantity: number
  created_at: string
  updated_at: string
  pivot?: {
    quantity: number
  }
}

export type Build = {
  id: number
  user_id: number
  name: string
  status: BuildStatus
  total_price: string
  created_at: string
  updated_at: string
  user?: User
  components?: Component[]
}

export type PowerConsumption = {
  total_tdp: number
  recommended_psu: number
}

export type BuildComparison = {
  build_a: {
    build: Build
    total_price: string
    power_consumption: PowerConsumption
  }
  build_b: {
    build: Build
    total_price: string
    power_consumption: PowerConsumption
  }
}