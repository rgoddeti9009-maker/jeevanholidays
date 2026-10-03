import { packages, rates, settings, vehicles } from '@/data/fixtures'
import type { ServiceId, TourPackage, Vehicle, VehicleId } from '@/data/fixtures'

/** The in-progress enquiry. Lives only in the current session (see app-context). */
export type Draft = {
  service?: ServiceId
  from?: string
  to?: string
  packageId?: string
  date?: string
  time?: string
  passengers?: number
  luggage?: number
  vehicleId?: VehicleId
  name?: string
  mobile?: string
  email?: string
  notes?: string
}

export type Quote =
  | { kind: 'rate'; rateId: string; total: number; advance: number; balance: number; pkg: TourPackage; vehicle: Vehicle }
  | { kind: 'custom'; reason: 'no-route-rate' | 'no-vehicle-rate' | 'staff-service' }

export const findPackage = (id?: string) => packages.find((p) => p.id === id)
export const findVehicle = (id?: string) => vehicles.find((v) => v.id === id)

/** Active rate for a package + vehicle, or undefined. Never estimates. */
export function activeRate(packageId: string, vehicleId: VehicleId) {
  return rates.find((r) => r.active && r.packageId === packageId && r.vehicleId === vehicleId)
}

/** Lowest active rate for a package, for "from ₹…" labels. */
export function startingRate(packageId: string) {
  const list = rates.filter((r) => r.active && r.packageId === packageId).map((r) => r.amount)
  return list.length ? Math.min(...list) : undefined
}

export function packagesCovering(destinationId?: string) {
  if (!destinationId) return packages
  return packages.filter((p) => p.covers.includes(destinationId))
}

export function quote(d: Draft): Quote {
  if (d.service && ['hotel', 'bus', 'flight'].includes(d.service)) return { kind: 'custom', reason: 'staff-service' }
  const pkg = findPackage(d.packageId)
  const vehicle = findVehicle(d.vehicleId)
  if (!pkg || !vehicle) return { kind: 'custom', reason: 'no-route-rate' }
  const rate = activeRate(pkg.id, vehicle.id)
  if (!rate) return { kind: 'custom', reason: 'no-vehicle-rate' }
  const advance = Math.round((rate.amount * settings.advancePercent) / 100)
  return { kind: 'rate', rateId: rate.id, total: rate.amount, advance, balance: rate.amount - advance, pkg, vehicle }
}

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

/** Client-side reference for an enquiry. Server-issued sequential IDs arrive with the database. */
export function newReference(prefix: 'QT' | 'KSK' | 'ENQ') {
  const year = new Date().getFullYear()
  const n = Math.floor(Math.random() * 900000) + 100000
  return `${prefix}-${year}-${n}`
}
