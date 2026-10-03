import { Link, createFileRoute } from '@tanstack/react-router'
import { MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Brand } from '@/components/Brand'
import { LangSwitch } from '@/components/LangSwitch'
import { QrCode } from '@/components/QrCode'
import { cdn } from '@/components/img'
import { business, services } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { dictionaries, languages } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { continuationUrl, telLink, waLink } from '@/lib/share'
import { useSpeechInput } from '@/lib/voice'

export const Route = createFileRoute('/kiosk')({
  validateSearch: (s: Record<string, unknown>): { ended?: number } => (s.ended ? { ended: 1 } : {}),
  component: Kiosk,
})

const LANG_WORDS: [Lang, RegExp][] = [
  ['hi', /hindi|हिंदी|हिन्दी/i],
  ['mr', /marathi|मराठी/i],
  ['te', /telugu|తెలుగు|तेलुगु/i],
  ['en', /english|अंग्रेज़ी|इंग्रजी|ఇంగ్లీష్/i],
]

function Kiosk() {
  const { ended } = Route.useSearch()
  const { t, setKiosk, langChosen, setLang, sessionId } = useApp()
  const [appUrl, setAppUrl] = useState<string>()
  const [notice, setNotice] = useState(!!ended)

  useEffect(() => setKiosk(true), [setKiosk])
  useEffect(() => setAppUrl(continuationUrl({}, '/')), [])
  useEffect(() => {
    if (!notice) return
    const id = setTimeout(() => setNotice(false), 6000)
    return () => clearTimeout(id)
  }, [notice])

  const voiceLang = useSpeechInput('hi-IN', (text) => {
    const hit = LANG_WORDS.find(([, re]) => re.test(text))
    if (hit) setLang(hit[0])
  })

  return (
    <div className="relative min-h-dvh overflow-hidden bg-ink text-paper">
      <img src={cdn('shirdi.png', 1920)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/85 to-ink-2/70" />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <Brand size="lg" light />
        </div>

        {notice && (
          <div className="rise mt-8 flex items-center gap-3 rounded-2xl bg-leaf/90 p-4 text-lg font-semibold">
            <ShieldCheck className="h-7 w-7 shrink-0" /> {t.sessionEnded}
          </div>
        )}

        {!langChosen ? (
          <section className="my-auto py-10">
            <h1 className="rise text-center text-5xl font-extrabold uppercase md:text-6xl">
              {dictionaries.en.selectLanguage}
              <span className="mt-2 block text-2xl font-semibold normal-case text-marigold">भाषा चुनें · भाषा निवडा · భాషను ఎంచుకోండి</span>
            </h1>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4">
              {languages.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className="press rise flex items-center gap-4 rounded-3xl bg-paper p-6 text-left text-ink hover:bg-white"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <span className="text-4xl">{l.id === 'en' ? '🇬🇧' : '🇮🇳'}</span>
                  <span>
                    <span className="block font-display text-3xl font-extrabold">{l.native}</span>
                    <span className="text-muted">{l.label}</span>
                  </span>
                </button>
              ))}
            </div>
            {voiceLang.supported && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={voiceLang.listening ? voiceLang.stop : voiceLang.start}
                  className={`press flex items-center gap-3 rounded-full bg-saffron px-8 py-5 text-2xl font-bold ${voiceLang.listening ? 'mic-live' : ''}`}
                >
                  🎙 {voiceLang.listening ? '…' : `${dictionaries.en.speakLanguage} · ${dictionaries.hi.speakLanguage}`}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="my-auto py-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="rise text-2xl font-semibold text-marigold">{t.welcome}</div>
                <h1 className="rise text-5xl font-extrabold uppercase leading-none md:text-6xl">{t.howHelp}</h1>
              </div>
              <LangSwitch dark />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {services.map((s, i) => (
                <Link
                  key={s.id}
                  to={s.id === 'packages' ? '/packages' : '/book'}
                  search={s.id === 'packages' ? undefined : { service: s.id }}
                  className="press rise flex min-h-32 flex-col justify-between rounded-3xl bg-paper p-5 text-ink hover:bg-white"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  <span className="text-5xl">{s.emoji}</span>
                  <span className="font-display text-xl font-extrabold uppercase leading-tight">{t.services[s.id]}</span>
                </Link>
              ))}
              <Link to="/ai" className="press rise flex min-h-32 flex-col justify-between rounded-3xl bg-saffron p-5 hover:bg-saffron-deep">
                <span className="text-5xl">🤖</span>
                <span className="font-display text-xl font-extrabold uppercase">{t.askAi}</span>
              </Link>
              <Link to="/ai" search={{ voice: 1 }} className="press rise flex min-h-32 flex-col justify-between rounded-3xl bg-marigold p-5 text-ink hover:brightness-105">
                <span className="text-5xl">🎙</span>
                <span className="font-display text-xl font-extrabold uppercase">{t.voice}</span>
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <a href={waLink('Namaste Jeevan Holidays, I am at your office kiosk and need help with a booking.')} target="_blank" rel="noreferrer" className="press flex items-center justify-center gap-3 rounded-3xl bg-leaf p-5 text-2xl font-bold">
                <MessageCircle className="h-8 w-8" /> 💬 {t.whatsapp}
              </a>
              <a href={telLink(0)} className="press flex items-center justify-center gap-3 rounded-3xl bg-white/10 p-5 text-2xl font-bold ring-1 ring-white/25">
                <Phone className="h-8 w-8" /> ☎️ {t.callStaff}
              </a>
              <div className="flex items-center gap-4 rounded-3xl bg-white/5 p-4 ring-1 ring-white/15">
                <QrCode value={appUrl} size={112} />
                <div className="max-w-40 font-display text-lg font-bold uppercase leading-tight">📱 {t.bookOnPhone}</div>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-sm text-paper/55">
          <span>{business.address}</span>
          <span className="font-mono">KIOSK SESSION: {sessionId || '—'}</span>
        </footer>
      </div>
    </div>
  )
}
