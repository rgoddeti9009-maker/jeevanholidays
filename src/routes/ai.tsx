import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageCircle, Send, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { VoiceButton } from '@/components/VoiceButton'
import { destinations, packages, vehicles } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { findPackage, findVehicle, inr, packagesCovering, startingRate } from '@/lib/fare'
import type { Draft } from '@/lib/fare'
import { destinationName, parseRequest } from '@/lib/intent'
import { draftSummary, waLink } from '@/lib/share'
import { canSpeak, speak, stopSpeaking } from '@/lib/voice'

export const Route = createFileRoute('/ai')({
  validateSearch: (s: Record<string, unknown>): { q?: string; voice?: number } => ({
    q: typeof s.q === 'string' ? s.q.slice(0, 200) : undefined,
    voice: s.voice ? 1 : undefined,
  }),
  component: Assistant,
})

type Field = 'to' | 'from' | 'date' | 'time' | 'passengers' | 'vehicleId'
type Msg = { role: 'ai' | 'user'; text: string; planner?: number; ready?: boolean }

const ORDER: Field[] = ['to', 'from', 'date', 'time', 'passengers', 'vehicleId']

function Assistant() {
  const { q, voice } = Route.useSearch()
  const { t, draft, updateDraft, speechLang, voiceReplies, setVoiceReplies, lang } = useApp()
  const navigate = useNavigate()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [asking, setAsking] = useState<Field | null>(null)
  const [tts, setTts] = useState(false)
  useEffect(() => setTts(canSpeak()), [])
  const bottom = useRef<HTMLDivElement>(null)
  const local = useRef<Draft>({})

  const say = (m: Msg) => {
    setMsgs((list) => [...list, m])
    if (m.role === 'ai' && voiceReplies) speak(m.text, speechLang)
  }

  useEffect(() => {
    setMsgs([{ role: 'ai', text: t.ai.greeting }])
    local.current = {}
    if (q) handle(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  useEffect(() => bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), [msgs])
  useEffect(() => () => stopSpeaking(), [])

  const nextQuestion = (d: Draft) => {
    const missing = ORDER.find((f) => !d[f])
    setAsking(missing ?? null)
    if (!missing) {
      const pkgMatch = d.to ? packagesCovering(d.to)[0] : undefined
      say({ role: 'ai', text: pkgMatch ? t.ai.ready : `${t.ai.ready} ${t.ai.noRate}`, ready: true })
      return
    }
    const question = { to: t.ai.askTo, from: t.ai.askFrom, date: t.ai.askDate, time: t.ai.askTime, passengers: t.ai.askPax, vehicleId: t.ai.askVehicle }[missing]
    say({ role: 'ai', text: question })
  }

  function handle(text: string) {
    const clean = text.trim()
    if (!clean) return
    setMsgs((list) => [...list, { role: 'user', text: clean }])
    const p = parseRequest(clean)

    if (p.days) {
      say({ role: 'ai', text: t.ai.planner, planner: p.days })
      return
    }

    // An answer to a direct question may be a bare value ("6", "Tomorrow", "Shirdi").
    if (asking === 'from' && p.to && !p.from) {
      p.from = p.to
      delete p.to
    }
    if (asking === 'passengers' && !p.passengers) {
      const n = parseInt(clean, 10)
      if (n > 0 && n < 60) p.passengers = n
    }
    if (asking === 'time' && !p.time) {
      const m = clean.match(/^(\d{1,2})(?::(\d{2}))?$/)
      if (m) p.time = `${m[1].padStart(2, '0')}:${m[2] ?? '00'}`
    }

    const fields: Partial<Draft> = { ...p }
    delete (fields as { days?: number }).days
    const gotSomething = Object.keys(fields).length > 0
    if (!gotSomething) {
      say({ role: 'ai', text: t.ai.unclear })
      return
    }
    local.current = { ...local.current, ...fields }
    updateDraft(fields)
    nextQuestion(local.current)
  }

  const quick = (text: string) => handle(text)
  const answer = (field: Field, value: string, label: string) => {
    setMsgs((list) => [...list, { role: 'user', text: label }])
    const patch = { [field]: value } as Partial<Draft>
    local.current = { ...local.current, ...patch }
    updateDraft(patch)
    nextQuestion(local.current)
  }
  const d = local.current
  const lastAi = [...msgs].reverse().find((m) => m.role === 'ai')

  const goQuote = () => {
    const pkg = d.to ? packagesCovering(d.to)[0] : undefined
    const service = pkg ? 'packages' : d.service ?? 'oneway'
    if (pkg) updateDraft({ packageId: pkg.id })
    navigate({
      to: '/book',
      search: { service, from: d.from, to: d.to, packageId: pkg?.id, date: d.date, time: d.time, passengers: d.passengers, vehicleId: d.vehicleId },
    })
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-saffron-deep">Jeevan AI</div>
          <h1 className="text-3xl font-extrabold uppercase md:text-4xl">🤖 {t.askAi}</h1>
        </div>
        <div className="flex gap-2">
          {tts && (
            <>
              <button onClick={() => lastAi && speak(lastAi.text, speechLang)} className="press flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-bold ring-1 ring-ink/10">
                🔊 {t.repeat}
              </button>
              <button
                onClick={() => {
                  stopSpeaking()
                  setVoiceReplies(!voiceReplies)
                }}
                className="press flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-bold ring-1 ring-ink/10"
              >
                {voiceReplies ? <><VolumeX className="h-4 w-4" /> {t.stopVoice}</> : <><Volume2 className="h-4 w-4" /> Voice on</>}
              </button>
            </>
          )}
        </div>
      </div>

      {voice && (
        <div className="mb-5 rounded-3xl bg-ink p-6 text-paper">
          <VoiceButton size="xl" onText={handle} className="[&_.text-ink-2]:text-paper/80" />
          <p className="mt-3 text-center text-sm text-paper/60">e.g. “मुझे कल चार लोगों के लिए शिर्डी से नासिक जाना है।”</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {msgs.map((m, i) => (
          <div key={i} className={`rise max-w-[88%] ${m.role === 'user' ? 'self-end' : 'self-start'}`}>
            <div className={`rounded-3xl px-5 py-3 text-lg ${m.role === 'user' ? 'rounded-br-md bg-ink text-paper' : 'rounded-bl-md bg-white ring-1 ring-ink/10'}`}>{m.text}</div>
            {m.planner && <Planner days={m.planner} />}
          </div>
        ))}

        {/* Collected trip so far */}
        {Object.keys(d).length > 0 && (
          <div className="rise self-stretch rounded-3xl bg-paper-2 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Your trip</div>
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              {d.from && <Tag>{t.from}: {destinationName(d.from)}</Tag>}
              {d.to && <Tag>{t.to}: {destinationName(d.to)}</Tag>}
              {d.date && <Tag>{t.date}: {d.date}</Tag>}
              {d.time && <Tag>{t.time}: {d.time}</Tag>}
              {d.passengers && <Tag>{t.passengers}: {d.passengers}</Tag>}
              {d.vehicleId && <Tag>{t.vehicle}: {findVehicle(d.vehicleId)?.name}</Tag>}
            </div>
            {!asking && msgs.some((m) => m.ready) && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button onClick={goQuote} className="press rounded-2xl bg-saffron py-4 text-lg font-bold text-white">{t.getFare} / {t.quotation} →</button>
                <a href={waLink(draftSummary({ ...draft, ...d }) + '\n\nConversation:\n' + msgs.filter((m) => m.role === 'user').map((m) => '• ' + m.text).join('\n'))} target="_blank" rel="noreferrer" className="press flex items-center justify-center gap-2 rounded-2xl bg-leaf py-4 font-bold text-white">
                  <MessageCircle className="h-5 w-5" /> {t.talkStaff}
                </a>
              </div>
            )}
          </div>
        )}
        <div ref={bottom} />
      </div>

      {/* Quick replies for the current question */}
      <div className="mt-4 flex flex-wrap gap-2">
        {asking === 'to' && destinations.filter((x) => x.group === 'popular').slice(1, 8).map((x) => <Quick key={x.id} onClick={() => answer('to', x.id, x.name)}>{x.name}</Quick>)}
        {asking === 'from' && ['shirdi', 'sainagar', 'air-shirdi', 'kopargaon'].map((id) => <Quick key={id} onClick={() => answer('from', id, destinationName(id))}>{destinationName(id)}</Quick>)}
        {asking === 'date' && ['today', 'tomorrow', 'day after tomorrow'].map((x) => <Quick key={x} onClick={() => quick(x)}>{x}</Quick>)}
        {asking === 'time' && ['5 am', '6 am', '7 am', '9 am', '2 pm', '6 pm'].map((x) => <Quick key={x} onClick={() => quick(x)}>{x}</Quick>)}
        {asking === 'passengers' && [1, 2, 3, 4, 5, 6, 7, 10, 13, 17].map((n) => <Quick key={n} onClick={() => quick(`${n} people`)}>{n}</Quick>)}
        {asking === 'vehicleId' &&
          vehicles.filter((v) => v.maxPassengers >= (d.passengers ?? 1)).map((v) => <Quick key={v.id} onClick={() => answer('vehicleId', v.id, v.name)}>{v.emoji} {v.name}</Quick>)}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handle(input)
          setInput('')
        }}
        className="sticky bottom-24 mt-4 flex items-center gap-2 rounded-full bg-white p-2 pl-5 shadow-xl ring-1 ring-ink/10"
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.askAiSub} className="min-w-0 flex-1 bg-transparent py-3 text-lg outline-none" />
        {!voice && <VoiceButton compact onText={handle} />}
        <button className="press grid h-12 w-12 place-items-center rounded-full bg-ink text-paper" aria-label="Send">
          <Send className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            local.current = {}
            setAsking(null)
            setMsgs([{ role: 'ai', text: t.ai.greeting }])
          }}
          className="press grid h-12 w-12 place-items-center rounded-full bg-ink/5"
          aria-label={t.startOver}
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </form>
      <p className="mt-3 text-center text-xs text-muted">Jeevan AI only quotes fares from Jeevan Holidays’ rate list. Anything else becomes a request for staff to confirm.</p>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white px-3 py-1 ring-1 ring-ink/10">{children}</span>
}

function Quick({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press rounded-full bg-white px-4 py-2 font-semibold ring-1 ring-ink/10 hover:ring-saffron">
      {children}
    </button>
  )
}

/** Draft itinerary built only from real packages; days beyond our tours are left for staff to plan. */
function Planner({ days }: { days: number }) {
  const one = packages.filter((p) => p.duration === '1 day')
  const plan = Array.from({ length: days }, (_, i) => (i === 0 ? null : one[(i - 1) % one.length]))
  return (
    <div className="mt-2 rounded-3xl bg-ink p-5 text-paper">
      <div className="font-display text-xl font-extrabold uppercase">{days}-day Maharashtra draft</div>
      <ol className="mt-3 space-y-2">
        {plan.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-marigold font-bold text-ink">{i + 1}</span>
            <div>
              <div className="font-semibold">{p ? p.name : 'Shirdi — Sai Baba darshan & local temples'}</div>
              {p && startingRate(p.id) != null && <div className="text-sm text-paper/70">from {inr(startingRate(p.id)!)} · {findPackage(p.id)?.startsFrom}</div>}
              {i >= one.length + 1 && <div className="text-sm text-marigold">Staff will suggest a route for this day</div>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a href={waLink(`Please plan a ${days}-day Maharashtra trip:\n` + plan.map((p, i) => `Day ${i + 1}: ${p ? p.name : 'Shirdi darshan'}`).join('\n'))} target="_blank" rel="noreferrer" className="press rounded-2xl bg-white/10 py-2 text-center font-bold">Save</a>
        <Link to="/packages" className="press rounded-2xl bg-white/10 py-2 text-center font-bold">Edit</Link>
        <Link to="/packages" className="press rounded-2xl bg-white/10 py-2 text-center font-bold">Get quote</Link>
        <Link to="/book" search={{ service: 'packages' }} className="press rounded-2xl bg-saffron py-2 text-center font-bold">Book</Link>
      </div>
    </div>
  )
}
