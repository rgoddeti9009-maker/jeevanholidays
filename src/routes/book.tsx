import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Check, ChevronLeft, Printer, Snowflake, Users, Briefcase, MessageCircle, Download, Smartphone } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { QrCode } from '@/components/QrCode'
import { QuotationDoc } from '@/components/QuotationDoc'
import { VoiceButton } from '@/components/VoiceButton'
import { cdn } from '@/components/img'
import { destinations, integrations, services, vehicles } from '@/data/fixtures'
import type { ServiceId, VehicleId } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { activeRate, findPackage, inr, newReference, packagesCovering, quote, startingRate } from '@/lib/fare'
import type { Draft } from '@/lib/fare'
import { destinationName, parseRequest, searchDestinations } from '@/lib/intent'
import { continuationUrl, draftSummary, waLink } from '@/lib/share'

type BookSearch = Partial<Pick<Draft, 'service' | 'from' | 'to' | 'packageId' | 'date' | 'time' | 'vehicleId'>> & { passengers?: number }

const SERVICE_IDS = services.map((s) => s.id) as string[]
const str = (v: unknown) => (typeof v === 'string' && v.length < 120 ? v : undefined)

export const Route = createFileRoute('/book')({
  validateSearch: (s: Record<string, unknown>): BookSearch => ({
    service: SERVICE_IDS.includes(s.service as string) ? (s.service as ServiceId) : undefined,
    from: str(s.from),
    to: str(s.to),
    packageId: str(s.packageId),
    date: str(s.date),
    time: str(s.time),
    vehicleId: vehicles.some((v) => v.id === s.vehicleId) ? (s.vehicleId as VehicleId) : undefined,
    passengers: Number(s.passengers) > 0 ? Math.min(60, Number(s.passengers)) : undefined,
  }),
  component: Book,
})

type Step = 'package' | 'from' | 'to' | 'date' | 'time' | 'passengers' | 'luggage' | 'vehicle' | 'name' | 'mobile' | 'quote' | 'pay' | 'status'

function stepsFor(service: ServiceId | undefined): Step[] {
  if (service === 'packages' || service === 'sightseeing') return ['package', 'date', 'time', 'passengers', 'vehicle', 'name', 'mobile', 'quote']
  if (service === 'hotel' || service === 'bus' || service === 'flight') return ['from', 'to', 'date', 'passengers', 'name', 'mobile', 'quote']
  return ['from', 'to', 'date', 'time', 'passengers', 'luggage', 'vehicle', 'name', 'mobile', 'quote']
}

const filled = (d: Draft, s: Step) =>
  s === 'package' ? !!d.packageId : s === 'luggage' ? d.luggage != null : s === 'quote' || s === 'pay' || s === 'status' ? false : !!d[s as keyof Draft]

function Book() {
  const search = Route.useSearch()
  const { t, draft, updateDraft, kiosk, resetSession } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step | null>(null)
  const [submitted, setSubmitted] = useState<{ key: string; ref: string } | null>(null)
  const quoteRef = useRef(newReference('QT'))

  // Merge deep-link params (QR continuation, AI hand-off, cards) into the session draft once.
  useEffect(() => {
    const patch = Object.fromEntries(Object.entries(search).filter(([, v]) => v != null)) as Partial<Draft>
    if (patch.service && patch.service !== draft.service) {
      updateDraft({ packageId: undefined, vehicleId: undefined, ...patch })
    } else updateDraft(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(search)])

  const service = search.service ?? draft.service
  const steps = useMemo(() => stepsFor(service), [service])

  // A different service means a different question list.
  const lastService = useRef(service)
  useEffect(() => {
    if (lastService.current !== service) {
      lastService.current = service
      setStep(null)
    }
  }, [service])

  // Start at the first unanswered question so nobody is asked twice.
  useEffect(() => {
    if (step === null && service) {
      const merged = { ...draft, ...Object.fromEntries(Object.entries(search).filter(([, v]) => v != null)) }
      setStep(steps.find((s) => !filled(merged as Draft, s)) ?? 'quote')
    }
  }, [service, steps, step, draft, search])

  if (!service) return <ChooseService />
  if (!step) return null

  const idx = steps.indexOf(step)
  const next = () => setStep(steps[idx + 1] ?? 'quote')
  const back = () => (idx > 0 ? setStep(steps[idx - 1]) : step === 'pay' ? setStep('quote') : navigate({ to: '/' }))
  const set = (patch: Partial<Draft>, advance = true) => {
    updateDraft(patch)
    if (advance) setTimeout(next, 120)
  }

  const progress = step === 'pay' || step === 'status' ? 1 : (idx + 1) / steps.length

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="no-print mb-6">
        <div className="flex items-center justify-between gap-3">
          <button onClick={back} className="press flex items-center gap-1 rounded-full px-3 py-2 font-semibold hover:bg-ink/5">
            <ChevronLeft className="h-5 w-5" /> {t.back}
          </button>
          <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-bold text-paper">
            {services.find((s) => s.id === service)?.emoji} {t.services[service]}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-saffron transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
        <Summary draft={draft} onJump={(s) => steps.includes(s) && step !== 'status' && setStep(s)} />
      </div>

      <div key={step} className="rise">
        {step === 'package' && <PackageStep to={draft.to} onPick={(id) => set({ packageId: id, from: 'shirdi' })} />}
        {step === 'from' && <PlaceStep title={`${t.from}?`} service={service} value={draft.from} onPick={(v) => set({ from: v })} />}
        {step === 'to' && <PlaceStep title={`${t.to}?`} service={service} value={draft.to} exclude={draft.from} onPick={(v) => set({ to: v })} />}
        {step === 'date' && <DateStep value={draft.date} onPick={(v) => set({ date: v })} />}
        {step === 'time' && <TimeStep value={draft.time} onPick={(v) => set({ time: v })} />}
        {step === 'passengers' && <NumberStep title={t.passengers} icon="👥" max={17} value={draft.passengers} onPick={(v) => set({ passengers: v })} />}
        {step === 'luggage' && <NumberStep title={t.luggage} icon="🧳" min={0} max={10} value={draft.luggage} onPick={(v) => set({ luggage: v })} />}
        {step === 'vehicle' && <VehicleStep draft={draft} onPick={(v) => set({ vehicleId: v })} />}
        {step === 'name' && <TextStep title={t.name} value={draft.name} autoComplete="name" onSubmit={(v) => set({ name: v })} validate={(v) => v.trim().length >= 2} />}
        {step === 'mobile' && <MobileStep value={draft.mobile} onSubmit={(v) => set({ mobile: v })} />}
        {step === 'quote' && (
          <QuoteStep
            draft={draft}
            reference={quoteRef.current}
            onEdit={() => setStep(steps[0])}
            onConfirm={() => setStep('pay')}
            kiosk={kiosk}
          />
        )}
        {step === 'pay' && (
          <PayStep
            draft={draft}
            onCounter={() => {
              // Duplicate protection: the same enquiry submitted twice returns the first reference.
              const key = JSON.stringify(draft)
              if (!submitted || submitted.key !== key) setSubmitted({ key, ref: quoteRef.current })
              setStep('status')
            }}
          />
        )}
        {step === 'status' && submitted && (
          <StatusStep
            draft={draft}
            reference={submitted.ref}
            onDone={() => {
              resetSession()
              navigate({ to: kiosk ? '/kiosk' : '/' })
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- steps */

function StepTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold uppercase md:text-5xl">{children}</h1>
      {sub && <p className="mt-2 text-lg text-muted">{sub}</p>}
    </div>
  )
}

function ChooseService() {
  const { t } = useApp()
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <StepTitle>{t.howHelp}</StepTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {services.map((s) => (
          <Link key={s.id} to="/book" search={{ service: s.id }} className="press flex min-h-28 flex-col justify-between rounded-3xl bg-white p-4 ring-1 ring-ink/10 hover:ring-saffron">
            <span className="text-4xl">{s.emoji}</span>
            <span className="font-display font-bold uppercase">{t.services[s.id]}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Summary({ draft, onJump }: { draft: Draft; onJump: (s: Step) => void }) {
  const { t } = useApp()
  const pkg = findPackage(draft.packageId)
  const chips: [Step, string][] = []
  if (pkg) chips.push(['package', pkg.name])
  if (draft.from && !pkg) chips.push(['from', destinationName(draft.from)])
  if (draft.to && !pkg) chips.push(['to', '→ ' + destinationName(draft.to)])
  if (draft.date) chips.push(['date', draft.date])
  if (draft.time) chips.push(['time', draft.time])
  if (draft.passengers) chips.push(['passengers', `${draft.passengers} ${t.passengers.toLowerCase()}`])
  if (draft.vehicleId) chips.push(['vehicle', vehicles.find((v) => v.id === draft.vehicleId)!.name])
  if (!chips.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map(([s, label]) => (
        <button key={s} onClick={() => onJump(s)} className="rounded-full bg-white px-3 py-1 text-sm font-semibold ring-1 ring-ink/10 hover:ring-saffron">
          {label}
        </button>
      ))}
    </div>
  )
}

function PackageStep({ to, onPick }: { to?: string; onPick: (id: string) => void }) {
  const { t } = useApp()
  const covering = packagesCovering(to)
  const list = covering.length ? covering : packagesCovering()
  return (
    <div>
      <StepTitle sub={to && covering.length ? `Tours that include ${destinationName(to)}` : 'All tours start from Shirdi'}>{t.services.packages}</StepTitle>
      {to && !covering.length && (
        <div className="mb-4 rounded-2xl bg-marigold/15 p-4">
          No fixed tour covers {destinationName(to)} yet.{' '}
          <Link to="/book" search={{ service: 'oneway', to }} className="font-bold text-saffron-deep underline">
            Request a custom fare instead
          </Link>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => {
          const from = startingRate(p.id)
          return (
            <button key={p.id} onClick={() => onPick(p.id)} className="press group overflow-hidden rounded-3xl bg-white text-left ring-1 ring-ink/10 hover:ring-2 hover:ring-saffron">
              {p.image && <img src={cdn(p.image, 640)} alt="" className="h-40 w-full object-cover" />}
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-saffron-deep">{p.duration} · from {p.startsFrom}</div>
                <div className="mt-1 font-display text-2xl font-extrabold leading-tight">{p.name}</div>
                {from != null && <div className="mt-2 text-muted">from <span className="text-xl font-bold text-ink">{inr(from)}</span></div>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PlaceStep({ title, service, value, exclude, onPick }: { title: string; service: ServiceId; value?: string; exclude?: string; onPick: (v: string) => void }) {
  const { t } = useApp()
  const [q, setQ] = useState('')
  const order = service === 'airport' ? ['airport', 'popular', 'railway'] : service === 'railway' ? ['railway', 'popular', 'airport'] : ['popular', 'airport', 'railway']
  const groups = order.map((g) => ({ g, list: destinations.filter((d) => d.group === g && d.id !== exclude) }))
  const hits = searchDestinations(q)
  return (
    <div>
      <StepTitle>{title}</StepTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (q.trim()) onPick(hits[0]?.id ?? q.trim())
        }}
        className="mb-6 flex items-center gap-2 rounded-full bg-white p-2 pl-5 ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-saffron"
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none" />
        <VoiceButton compact onText={(txt) => { const p = parseRequest(txt); onPick(p.to ?? p.from ?? txt) }} />
        <button className="press rounded-full bg-ink px-5 py-3 font-bold text-paper">{t.next}</button>
      </form>
      {q && (
        <div className="mb-6 flex flex-wrap gap-2">
          {hits.map((d) => (
            <Chip key={d.id} active={value === d.id} onClick={() => onPick(d.id)}>{d.name}</Chip>
          ))}
          <Chip onClick={() => onPick(q.trim())}>“{q.trim()}” · any destination in India</Chip>
        </div>
      )}
      {groups.map(({ g, list }) => (
        <div key={g} className="mb-5">
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">{g === 'popular' ? '🛕 Popular from Shirdi' : g === 'airport' ? '✈️ Airports' : '🚆 Railway'}</div>
          <div className="flex flex-wrap gap-2">
            {list.map((d) => (
              <Chip key={d.id} active={value === d.id} onClick={() => onPick(d.id)}>{d.name}</Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`press rounded-2xl px-5 py-3 text-lg font-semibold ring-1 ${active ? 'bg-saffron text-white ring-saffron' : 'bg-white ring-ink/10 hover:ring-saffron'}`}
    >
      {children}
    </button>
  )
}

const iso = (offset: number) => {
  const d = new Date(Date.now() + offset * 86400000)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

function DateStep({ value, onPick }: { value?: string; onPick: (v: string) => void }) {
  const { t, lang } = useApp()
  const opts = [0, 1, 2, 3, 4, 5, 6].map((o) => ({ v: iso(o), d: new Date(Date.now() + o * 86400000) }))
  const locale = lang === 'en' ? 'en-IN' : `${lang}-IN`
  return (
    <div>
      <StepTitle>{t.date}?</StepTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {opts.map(({ v, d }, i) => (
          <button key={v} onClick={() => onPick(v)} className={`press rounded-3xl p-4 text-left ring-1 ${value === v ? 'bg-saffron text-white ring-saffron' : 'bg-white ring-ink/10 hover:ring-saffron'}`}>
            <div className="text-sm font-bold uppercase opacity-70">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString(locale, { weekday: 'long' })}</div>
            <div className="font-display text-2xl font-extrabold">{d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</div>
          </button>
        ))}
        <label className="flex flex-col justify-center rounded-3xl bg-white p-4 ring-1 ring-ink/10">
          <span className="text-sm font-bold uppercase text-muted">Other date</span>
          <input type="date" min={iso(0)} defaultValue={value} onChange={(e) => e.target.value && onPick(e.target.value)} className="text-lg font-semibold outline-none" />
        </label>
      </div>
    </div>
  )
}

function TimeStep({ value, onPick }: { value?: string; onPick: (v: string) => void }) {
  const { t } = useApp()
  const times = ['04:00', '05:00', '06:00', '07:00', '08:00', '10:00', '12:00', '15:00', '18:00', '21:00']
  return (
    <div>
      <StepTitle>{t.ai.askTime}</StepTitle>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {times.map((tm) => (
          <Chip key={tm} active={value === tm} onClick={() => onPick(tm)}>{tm}</Chip>
        ))}
      </div>
      <label className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 ring-1 ring-ink/10">
        <span className="font-semibold text-muted">Exact time</span>
        <input type="time" defaultValue={value} onChange={(e) => e.target.value && onPick(e.target.value)} className="text-lg font-semibold outline-none" />
      </label>
    </div>
  )
}

function NumberStep({ title, icon, min = 1, max, value, onPick }: { title: string; icon: string; min?: number; max: number; value?: number; onPick: (v: number) => void }) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  return (
    <div>
      <StepTitle>{icon} {title}?</StepTitle>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {nums.map((n) => (
          <button key={n} onClick={() => onPick(n)} className={`press aspect-square rounded-3xl font-display text-3xl font-extrabold ring-1 ${value === n ? 'bg-saffron text-white ring-saffron' : 'bg-white ring-ink/10 hover:ring-saffron'}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

function VehicleStep({ draft, onPick }: { draft: Draft; onPick: (v: VehicleId) => void }) {
  const { t } = useApp()
  const [table, setTable] = useState(false)
  const pax = draft.passengers ?? 1
  const rows = vehicles.map((v) => {
    const rate = draft.packageId ? activeRate(draft.packageId, v.id) : undefined
    return { v, rate, fits: v.maxPassengers >= pax }
  })
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <StepTitle sub="Availability is confirmed by our staff before your booking is final.">{t.ai.askVehicle}</StepTitle>
        <button onClick={() => setTable(!table)} className="press mb-6 rounded-full bg-ink/5 px-4 py-2 font-semibold hover:bg-ink/10">
          {table ? 'Card view' : 'Compare vehicles'}
        </button>
      </div>
      {table ? (
        <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-ink/10">
          <table className="w-full text-left">
            <thead className="bg-paper-2 text-xs uppercase tracking-wider text-muted">
              <tr>{['Vehicle', 'Capacity', 'AC', 'Luggage', 'Fare', 'Availability', ''].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map(({ v, rate, fits }) => (
                <tr key={v.id} className={`border-t border-ink/5 ${fits ? '' : 'opacity-40'}`}>
                  <td className="px-4 py-3 font-bold">{v.emoji} {v.name}</td>
                  <td className="px-4 py-3">{v.seats}</td>
                  <td className="px-4 py-3">{v.ac ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{v.luggage}</td>
                  <td className="px-4 py-3 font-semibold">{rate ? inr(rate.amount) : 'On request'}</td>
                  <td className="px-4 py-3 text-sm text-muted">To be confirmed</td>
                  <td className="px-4 py-3">
                    <button disabled={!fits} onClick={() => onPick(v.id)} className="press rounded-full bg-saffron px-4 py-2 font-bold text-white disabled:bg-ink/20">Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ v, rate, fits }) => (
            <button
              key={v.id}
              disabled={!fits}
              onClick={() => onPick(v.id)}
              className={`press relative rounded-3xl p-5 text-left ring-1 disabled:cursor-not-allowed disabled:opacity-40 ${draft.vehicleId === v.id ? 'bg-ink text-paper ring-ink' : 'bg-white ring-ink/10 hover:ring-2 hover:ring-saffron'}`}
            >
              <div className="text-5xl">{v.emoji}</div>
              <div className="mt-2 font-display text-2xl font-extrabold uppercase">{v.name}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" />{v.seats}</span>
                {v.ac && <span className="flex items-center gap-1"><Snowflake className="h-4 w-4" />AC</span>}
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{v.luggage}</span>
              </div>
              <div className="mt-3 text-lg font-bold">{rate ? inr(rate.amount) : <span className="text-base font-semibold opacity-70">Fare on request</span>}</div>
              {!fits && <div className="mt-1 text-sm font-semibold text-temple">Too small for {pax} passengers</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TextStep({ title, value, autoComplete, onSubmit, validate }: { title: string; value?: string; autoComplete?: string; onSubmit: (v: string) => void; validate: (v: string) => boolean }) {
  const { t } = useApp()
  const [v, setV] = useState(value ?? '')
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (validate(v)) onSubmit(v.trim()) }}>
      <StepTitle>{title}</StepTitle>
      <input autoFocus value={v} onChange={(e) => setV(e.target.value)} autoComplete={autoComplete} className="w-full rounded-3xl bg-white px-6 py-5 text-2xl font-semibold outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-saffron" />
      <button disabled={!validate(v)} className="press mt-4 w-full rounded-3xl bg-saffron py-5 text-xl font-bold text-white disabled:bg-ink/20">{t.next} →</button>
    </form>
  )
}

function MobileStep({ value, onSubmit }: { value?: string; onSubmit: (v: string) => void }) {
  const { t } = useApp()
  const [v, setV] = useState(value ?? '')
  const digits = v.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '')
  const ok = /^[6-9]\d{9}$/.test(digits)
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ok) onSubmit(digits) }}>
      <StepTitle sub="We’ll send your quotation and trip details here.">{t.mobile}</StepTitle>
      <div className="flex items-center rounded-3xl bg-white ring-1 ring-ink/10 focus-within:ring-2 focus-within:ring-saffron">
        <span className="pl-6 text-2xl font-semibold text-muted">+91</span>
        <input autoFocus inputMode="numeric" type="tel" value={v} onChange={(e) => setV(e.target.value)} autoComplete="tel-national" placeholder="98765 43210" className="min-w-0 flex-1 bg-transparent px-4 py-5 text-2xl font-semibold tracking-wider outline-none" />
      </div>
      {v && !ok && <p className="mt-2 font-semibold text-temple">Enter a 10-digit Indian mobile number.</p>}
      <p className="mt-3 rounded-2xl bg-leaf/10 p-3 text-sm text-leaf">🔒 Jeevan Holidays will never ask for an OTP, CVV, UPI PIN, ATM PIN or bank password.</p>
      <button disabled={!ok} className="press mt-4 w-full rounded-3xl bg-saffron py-5 text-xl font-bold text-white disabled:bg-ink/20">{t.next} →</button>
    </form>
  )
}

function QuoteStep({ draft, reference, onEdit, onConfirm, kiosk }: { draft: Draft; reference: string; onEdit: () => void; onConfirm: () => void; kiosk: boolean }) {
  const { t } = useApp()
  const [phone, setPhone] = useState<boolean | null>(kiosk ? null : false)
  const [url, setUrl] = useState<string>()
  useEffect(() => setUrl(continuationUrl(draft)), [draft])
  const q = quote(draft)
  return (
    <div>
      <QuotationDoc draft={draft} reference={reference} kind="quotation" />
      <div className="no-print mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        <button onClick={onEdit} className="press rounded-2xl border-2 border-ink/15 py-4 font-bold">{t.edit}</button>
        <button onClick={onConfirm} className="press col-span-1 rounded-2xl bg-saffron py-4 font-bold text-white md:col-span-2">
          {q.kind === 'rate' ? `${t.confirm} · ${inr(q.advance)} ${t.advance.toLowerCase()}` : `${t.confirm} · send fare request`}
        </button>
        <a href={waLink(draftSummary(draft, reference))} target="_blank" rel="noreferrer" className="press flex items-center justify-center gap-2 rounded-2xl bg-leaf py-4 font-bold text-white">
          <MessageCircle className="h-5 w-5" /> {t.whatsapp}
        </a>
        <button onClick={() => window.print()} className="press flex items-center justify-center gap-2 rounded-2xl bg-ink py-4 font-bold text-paper">
          <Printer className="h-5 w-5" /> {t.print}
        </button>
        <button onClick={() => window.print()} className="press flex items-center justify-center gap-2 rounded-2xl bg-ink/5 py-4 font-bold" title="Choose “Save as PDF” in the print dialog">
          <Download className="h-5 w-5" /> {t.pdf}
        </button>
      </div>
      {phone === null && (
        <div className="no-print mt-5 rounded-3xl bg-ink p-5 text-paper">
          <div className="font-display text-xl font-bold">📱 {t.continuePhone}</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={() => setPhone(true)} className="press rounded-2xl bg-saffron py-3 font-bold">{t.scanQr}</button>
            <button onClick={() => setPhone(false)} className="press rounded-2xl bg-white/10 py-3 font-bold">{t.continueHere}</button>
          </div>
        </div>
      )}
      {phone && (
        <div className="no-print mt-5 flex flex-wrap items-center gap-5 rounded-3xl bg-white p-5 ring-1 ring-ink/10">
          <QrCode value={url} size={170} />
          <div className="max-w-sm">
            <div className="font-display text-xl font-bold">Scan to continue on your phone</div>
            <p className="mt-1 text-muted">Opens this same trip — without your name or number — so you can finish on your own phone.</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PayStep({ draft, onCounter }: { draft: Draft; onCounter: () => void }) {
  const { t } = useApp()
  const q = quote(draft)
  const gatewayConnected = integrations.find((i) => i.id === 'payment')!.connected
  return (
    <div>
      <StepTitle sub={q.kind === 'rate' ? undefined : 'Payment is collected after Jeevan Holidays confirms your fare.'}>💳 Payment</StepTitle>
      {q.kind === 'rate' && (
        <div className="grid grid-cols-3 overflow-hidden rounded-3xl ring-1 ring-ink/10">
          <div className="bg-ink p-5 text-paper"><div className="text-xs font-bold uppercase text-marigold">Total fare</div><div className="font-display text-3xl font-extrabold">{inr(q.total)}</div></div>
          <div className="bg-white p-5"><div className="text-xs font-bold uppercase text-muted">Advance required</div><div className="font-display text-3xl font-extrabold text-saffron-deep">{inr(q.advance)}</div></div>
          <div className="bg-white p-5"><div className="text-xs font-bold uppercase text-muted">{t.balance}</div><div className="font-display text-3xl font-extrabold">{inr(q.balance)}</div></div>
        </div>
      )}
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {['📷 Scan & pay (UPI)', '🌐 Pay online'].map((label) => (
          <div key={label} className="flex flex-col justify-between rounded-3xl border-2 border-dashed border-ink/15 p-5 opacity-70">
            <div className="text-lg font-bold">{label}</div>
            <span className="mt-3 w-fit rounded-full bg-ink/10 px-3 py-1 text-xs font-bold uppercase tracking-wider">{gatewayConnected ? '' : t.notConnected}</span>
          </div>
        ))}
        <button onClick={onCounter} className="press rounded-3xl bg-saffron p-5 text-left text-white hover:bg-saffron-deep">
          <div className="text-lg font-bold">🏢 {t.payAtCounter}</div>
          <div className="mt-1 text-sm text-white/85">{q.kind === 'rate' ? 'Send this booking request and pay the advance at our office or when staff call you.' : 'Send this fare request to Jeevan Holidays.'}</div>
        </button>
      </div>
    </div>
  )
}

function StatusStep({ draft, reference, onDone }: { draft: Draft; reference: string; onDone: () => void }) {
  const { t } = useApp()
  const q = quote(draft)
  const [url, setUrl] = useState<string>()
  useEffect(() => setUrl(continuationUrl(draft)), [draft])
  const status = q.kind === 'rate' ? 'ADVANCE PENDING' : 'AWAITING AVAILABILITY'
  return (
    <div>
      <div className="mb-5 rounded-3xl bg-ink p-6 text-paper">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-marigold text-ink"><Check className="h-7 w-7" /></span>
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-marigold">Request ready · {status}</div>
            <h1 className="text-2xl font-extrabold md:text-3xl">Send it to Jeevan Holidays to reserve</h1>
          </div>
        </div>
        <p className="mt-3 text-paper/80">
          Your booking is not confirmed yet. Tap WhatsApp to send this request — staff confirm the vehicle and issue your Booking ID (JH-…) once availability and payment are verified.
        </p>
        <a href={waLink(draftSummary(draft, reference) + `\nStatus: ${status}\nPayment: ${t.payAtCounter}`)} target="_blank" rel="noreferrer" className="press mt-4 flex items-center justify-center gap-2 rounded-2xl bg-leaf py-4 text-lg font-bold text-white">
          <MessageCircle className="h-6 w-6" /> Send request on WhatsApp
        </a>
      </div>
      <QuotationDoc draft={draft} reference={reference} kind="receipt" />
      <div className="no-print mt-5 grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-4 ring-1 ring-ink/10">
          <QrCode value={url} size={130} />
          <div className="max-w-44">
            <div className="flex items-center gap-1 font-bold"><Smartphone className="h-4 w-4" /> Continue on your phone</div>
            <div className="text-sm text-muted">Scan to keep this trip on your phone.</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => window.print()} className="press flex items-center justify-center gap-2 rounded-2xl bg-ink/5 py-4 font-bold"><Printer className="h-5 w-5" /> {t.print}</button>
          <button onClick={() => window.print()} className="press flex items-center justify-center gap-2 rounded-2xl bg-ink/5 py-4 font-bold"><Download className="h-5 w-5" /> {t.pdf}</button>
          <button onClick={onDone} className="press col-span-2 rounded-2xl bg-saffron py-4 text-lg font-bold text-white">Done</button>
        </div>
      </div>
    </div>
  )
}
