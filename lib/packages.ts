export const PACKAGES = {
  basic: {
    name: 'Basic',
    price: 79_000,
    duration_months: 6,
    label: 'Rp 79.000',
    tagline: 'Self-edit mandiri, 6 bulan aktif',
  },
  pro: {
    name: 'Pro',
    price: 149_000,
    duration_months: 6,
    label: 'Rp 149.000',
    tagline: 'Self-edit + terima beres 1x, 6 bulan aktif',
  },
  studio: {
    name: 'Studio',
    price: 199_000,
    duration_months: 12,
    label: 'Rp 199.000',
    tagline: 'Full terima beres 3x, 1 tahun aktif',
  },
} as const

export type PaidPackage = keyof typeof PACKAGES

export function getExpiresAt(pkg: PaidPackage, from: Date = new Date()): Date {
  const d = new Date(from)
  d.setMonth(d.getMonth() + PACKAGES[pkg].duration_months)
  return d
}
