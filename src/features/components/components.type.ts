export type ComponentCategory = {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export type CpuSpecs = {
  ram_type: "DDR4" | "DDR5"
  ram_slots: number
  cores: number
  threads: number
  frequency: number
  tdp: number
}

export type RamSpecs = {
  type: "DDR4" | "DDR5"
  speed: number
  capacity: number
  sticks: number
  tdp: number
}

export type GpuSpecs = {
  vram: number
  length: number
  tdp: number
}

export type CaseSpecs = {
  form_factor: string
  max_gpu_length: number
  storage_bays: number
  tdp: number
}

export type StorageSpecs = {
  type: "SSD" | "HDD"
  interface: "SATA" | "NVMe"
  capacity: number
  read_speed: number
  write_speed: number
  tdp: number
}

export type ComponentSpecs =
  | CpuSpecs
  | RamSpecs
  | GpuSpecs
  | CaseSpecs
  | StorageSpecs

export type Component = {
  id: number
  category_id: number
  name: string
  brand: string
  price: string
  specs: ComponentSpecs
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ComponentCategory
}