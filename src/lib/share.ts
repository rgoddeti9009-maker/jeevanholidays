import { business } from '@/data/fixtures'
import type { Draft } from './fare'
import { findPackage, findVehicle, inr, quote } from './fare'
import { destinationName } from './intent'

export const telLink = (i = 0) => `tel:+${business.phones[i].e164}`

export function waLink(text: string, i = 0) {
  return `https://wa.me/${business.phones[i].e164}?text=${encodeURIComponent(text)}`
}

/** Plain-text trip summary for WhatsApp / staff handover. */
export function draftSummary(d: Draft, ref?: string) {
  const q = quote(d)
  const lines = [
    `*${business.name}* — Trip enquiry`,
    ref ? `Ref: ${ref}` : '',
    d.name ? `Customer: ${d.name}` : '',
    d.mobile ? `Mobile: ${d.mobile}` : '',
    d.service ? `Service: ${d.service}` : '',
    d.from ? `Pickup: ${destinationName(d.from)}` : '',
    findPackage(d.packageId) ? `Tour: ${findPackage(d.packageId)!.name}` : d.to ? `Destination: ${destinationName(d.to)}` : '',
    d.date ? `Date: ${d.date}` : '',
    d.time ? `Time: ${d.time}` : '',
    d.passengers ? `Passengers: ${d.passengers}` : '',
    d.luggage != null ? `Luggage: ${d.luggage} bags` : '',
    findVehicle(d.vehicleId) ? `Vehicle: ${findVehicle(d.vehicleId)!.name}` : '',
    q.kind === 'rate'
      ? `Quoted: ${inr(q.total)} (advance ${inr(q.advance)}, balance ${inr(q.balance)})`
      : 'Fare: please share the latest fare and availability',
    d.notes ? `Note: ${d.notes}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}

/** Non-personal deep link so a customer can continue the same enquiry on their phone. */
export function continuationUrl(d: Draft, path = '/book') {
  if (typeof window === 'undefined') return path
  const p = new URLSearchParams()
  for (const k of ['service', 'from', 'to', 'packageId', 'date', 'time', 'passengers', 'vehicleId'] as const) {
    const v = d[k]
    if (v != null && v !== '') p.set(k, String(v))
  }
  const qs = p.toString()
  return `${window.location.origin}${path}${qs ? '?' + qs : ''}`
}
