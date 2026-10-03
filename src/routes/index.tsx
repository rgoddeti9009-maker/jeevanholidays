import { Link, createFileRoute } from '@tanstack/react-router'
import { Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { DestinationCard } from '@/components/DestinationCard'
import { DestinationSearch } from '@/components/DestinationSearch'
import { QrCode } from '@/components/QrCode'
import { SectionTitle } from '@/components/SectionTitle'
import { ServiceGrid } from '@/components/ServiceGrid'
import { cdn } from '@/components/img'
import { business, destinations, packages } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { inr, startingRate } from '@/lib/fare'
import { continuationUrl, telLink, waLink } from '@/lib/share'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const { t, kiosk } = useApp()
  const [appUrl, setAppUrl] = useState<string>()
  useEffect(() => setAppUrl(continuationUrl({}, '/')), [])
  const popular = destinations.filter((d) => d.group === 'popular')

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <img src={cdn('hero.png', 1800)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 md:pb-20 md:pt-20">
          <p className="rise text-sm font-bold uppercase tracking-[0.3em] text-marigold">{business.tagline}</p>
          <h1 className="rise mt-3 max-w-3xl text-4xl font-extrabold uppercase leading-[0.95] md:text-7xl" style={{ animationDelay: '60ms' }}>
            {t.whereGo}
          </h1>
          <div className="rise mt-8 max-w-2xl" style={{ animationDelay: '120ms' }}>
            <DestinationSearch dark />
          </div>
          <div className="rise mt-6 flex flex-wrap gap-2" style={{ animationDelay: '180ms' }}>
            {['nashik', 'trimbakeshwar', 'shani', 'saptashrungi', 'air-shirdi'].map((id) => {
              const d = destinations.find((x) => x.id === id)!
              return (
                <Link key={id} to="/book" search={{ service: d.group === 'airport' ? 'airport' : 'oneway', to: id }} className="press rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20">
                  {d.name}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        {/* AI + Voice */}
        <section className="relative z-10 -mt-8 grid gap-4 md:grid-cols-2">
          <Link to="/ai" className="press rise group flex items-center gap-5 rounded-3xl bg-saffron p-6 text-white shadow-xl shadow-saffron/25 hover:bg-saffron-deep">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-4xl">🤖</span>
            <div>
              <div className="font-display text-2xl font-extrabold uppercase md:text-3xl">{t.askAi}</div>
              <div className="text-white/85">“{t.askAiSub}”</div>
            </div>
          </Link>
          <Link to="/ai" search={{ voice: 1 }} className="press rise group flex items-center gap-5 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-ink/10 hover:ring-saffron" style={{ animationDelay: '60ms' }}>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink text-4xl text-white">🎙</span>
            <div>
              <div className="font-display text-2xl font-extrabold uppercase md:text-3xl">{t.voice}</div>
              <div className="text-muted">“{t.voiceSub}”</div>
            </div>
          </Link>
        </section>

        {/* Services */}
        <section className="mt-12">
          <SectionTitle kicker={t.howHelp} title="Services" />
          <ServiceGrid big={kiosk} />
        </section>

        {/* Destinations */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <SectionTitle kicker="Popular from Shirdi" title={t.explore} />
            <Link to="/explore" className="mb-5 font-bold text-saffron-deep hover:underline">
              All destinations →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        </section>

        {/* Packages teaser */}
        <section className="mt-14">
          <SectionTitle kicker="Fixed-price day tours" title={t.services.packages} />
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {packages.map((p) => {
              const from = startingRate(p.id)
              return (
                <Link key={p.id} to="/book" search={{ service: 'packages', packageId: p.id }} className="press group relative w-72 shrink-0 snap-start overflow-hidden rounded-3xl bg-ink text-paper">
                  {p.image && <img src={cdn(p.image, 600)} alt="" loading="lazy" className="h-44 w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />}
                  <div className="p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-marigold">{p.duration}</div>
                    <div className="mt-1 font-display text-xl font-bold leading-tight">{p.name}</div>
                    {from != null && <div className="mt-2 text-paper/75">from <span className="text-lg font-bold text-paper">{inr(from)}</span></div>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Contact + phone QR */}
        <section className="mt-14 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-3xl bg-paper-2 p-6 paper-grain">
            <h2 className="text-2xl font-extrabold uppercase">Visit or call us</h2>
            <p className="mt-2 flex items-start gap-2 text-ink-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-saffron" /> {business.address}
            </p>
            <p className="mt-1 text-sm text-muted">Proprietor: {business.proprietor}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={waLink('Namaste Jeevan Holidays, I would like to enquire about a trip.')} target="_blank" rel="noreferrer" className="press flex items-center gap-2 rounded-full bg-leaf px-5 py-3 font-bold text-white">
                <MessageCircle className="h-5 w-5" /> 💬 {t.whatsapp}
              </a>
              {business.phones.map((p, i) => (
                <a key={p.e164} href={telLink(i)} className="press flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-paper">
                  <Phone className="h-5 w-5" /> {p.display}
                </a>
              ))}
              <a href={`https://instagram.com/${business.instagram}`} target="_blank" rel="noreferrer" className="press flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-3 font-bold">
                <Instagram className="h-5 w-5" /> @{business.instagram}
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 ring-1 ring-ink/10">
            <div className="mb-3 font-display text-lg font-extrabold uppercase">📱 {t.bookOnPhone}</div>
            <QrCode value={appUrl} size={168} label="Scan to open on your phone" />
          </div>
        </section>
        <footer className="mt-10 pb-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} {business.name} · Since {business.since}
        </footer>
      </div>
    </div>
  )
}
