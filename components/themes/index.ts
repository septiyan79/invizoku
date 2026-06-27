import type { ThemeProps } from '@/types/invitation'
import type { ComponentType } from 'react'

// Registry: component_key → dynamic import
// Tambah tema baru di sini saat ada tema baru yang dibuat
const registry: Record<string, () => Promise<{ default: ComponentType<ThemeProps> }>> = {
  WeddingElegant: () => import('./WeddingElegant'),
  // WeddingMinimalist: () => import('./WeddingMinimalist'),  // belum dibuat
  // BirthdayFun:       () => import('./BirthdayFun'),        // belum dibuat
  // AqiqahSakura:      () => import('./AqiqahSakura'),       // belum dibuat
}

export function getThemeLoader(componentKey: string) {
  return registry[componentKey] ?? null
}

export const availableKeys = Object.keys(registry)
