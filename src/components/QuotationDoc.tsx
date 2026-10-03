import { findPackage, findVehicle, inr, quote } from '@/lib/fare'
import type { Draft } from '@/lib/fare'
import { business, settings } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { destinationName } from '@/lib/intent'
import { Mark } from './Brand'

/** Printable quotation / enquiry receipt. Totals only appear when an active rate exists. */
export function QuotationDoc({ draft, reference, kind }: { draft: Draft; reference: string; kind: 'quotation' | 'receipt' }) {
  const { t } = useApp()
  const q = quote(draft)
  const pkg = findPackage(draft.packageId)
  const vehicle = findVehicle(draft.vehicleId)
  const rows: [string, string | undefined][] = [
    ['Customer', draft.name],
    ['Mobile', draft.mobile],
    [t.from, draft.from ? destinationName(draft.from) : pkg?.startsFrom],
    [t.to, pkg ? pkg.name : draft.to ? destinationName(draft.to) : undefined],
    [t.date, draft.date],
    [t.time, draft.time],
    [t.passengers, draft.passengers?.toString()],
    [t.vehicle, vehicle?.name],
  ]

  return (
    <div className="print-area rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/10 md:p-8">
      <div className="flex items-start justify-between gap-4 border-b-2 border-dashed border-ink/15 pb-4">
        <div className="flex items-center gap-3">
          <Mark className="h-12 w-12" />
          <div>
            <div className="font-display text-xl font-extrabold uppercase">{business.name}</div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-saffron-deep">Since {business.since}</div>
            <div className="mt-1 text-xs text-muted">{business.phones.map((p) => p.display).join(' · ')}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-extrabold uppercase text-saffron-deep">{kind === 'quotation' ? t.quotation : 'Enquiry receipt'}</div>
          <div className="font-mono text-sm">{reference}</div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 py-5 md:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-bold uppercase tracking-wider text-muted">{k}</dt>
            <dd className="text-lg font-semibold">{v || '—'}</dd>
          </div>
        ))}
      </dl>

      {q.kind === 'rate' ? (
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl ring-1 ring-ink/10">
          <Money label={t.total} value={inr(q.total)} strong />
          <Money label={`${t.advance} (${settings.advancePercent}%)`} value={inr(q.advance)} />
          <Money label={t.balance} value={inr(q.balance)} />
        </div>
      ) : (
        <div className="rounded-2xl bg-marigold/15 p-4 ring-1 ring-marigold/40">
          <div className="font-display text-lg font-extrabold uppercase">Custom fare request</div>
          <p className="text-ink-2">{t.customFare} Jeevan Holidays will share the fare on WhatsApp or by phone.</p>
        </div>
      )}

      {pkg && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <List title={t.includes} items={pkg.includes} mark="✓" />
          <List title={t.excludes} items={pkg.excludes} mark="✕" />
        </div>
      )}
      <p className="mt-5 text-xs text-muted">
        Vehicle and driver availability is confirmed by Jeevan Holidays staff. Payment is never collected through OTP, CVV or UPI PIN requests. {business.address}
      </p>
    </div>
  )
}

function Money({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`p-4 ${strong ? 'bg-ink text-paper' : 'bg-paper'}`}>
      <div className={`text-xs font-bold uppercase tracking-wider ${strong ? 'text-marigold' : 'text-muted'}`}>{label}</div>
      <div className="font-display text-2xl font-extrabold md:text-3xl">{value}</div>
    </div>
  )
}

function List({ title, items, mark }: { title: string; items: string[]; mark: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-muted">{title}</div>
      <ul className="mt-1 space-y-1">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className={mark === '✓' ? 'text-leaf' : 'text-temple'}>{mark}</span> {i}
          </li>
        ))}
      </ul>
    </div>
  )
}
