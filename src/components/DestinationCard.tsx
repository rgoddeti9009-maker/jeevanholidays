import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import type { Destination } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { packagesCovering, startingRate, inr } from '@/lib/fare'
import { cdn } from './img'

const GROUP_ICON = { popular: '🛕', railway: '🚆', airport: '✈️' } as const

export function DestinationCard({ d }: { d: Destination }) {
  const { t } = useApp()
  const tours = packagesCovering(d.id)
  const from = tours.map((p) => startingRate(p.id)).filter((n): n is number => n != null)
  const lowest = from.length ? Math.min(...from) : undefined
  const primaryService = d.services[0]

  return (
    <article className="rise group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink to-ink-2">
        {d.image ? (
          <img src={cdn(d.image, 640)} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="grid h-full place-items-center text-7xl opacity-80">{GROUP_ICON[d.group]}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-4 pt-12">
          <h3 className="text-2xl font-extrabold text-paper">{d.name}</h3>
          <div className="mt-1 flex items-center gap-1 text-sm text-paper/80">
            <MapPin className="h-3.5 w-3.5" /> From Shirdi
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {d.services.map((s) => (
            <span key={s} className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-semibold text-ink-2">{t.services[s]}</span>
          ))}
        </div>
        {lowest != null && (
          <div className="text-sm text-muted">
            Day tours from <span className="font-bold text-ink">{inr(lowest)}</span>
          </div>
        )}
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            to="/book"
            search={tours.length ? { service: 'packages', to: d.id } : { service: primaryService, to: d.id }}
            className="press rounded-2xl bg-saffron py-3 text-center font-bold text-white hover:bg-saffron-deep"
          >
            {t.book}
          </Link>
          <Link
            to="/book"
            search={{ service: primaryService, to: d.id }}
            className="press rounded-2xl bg-ink py-3 text-center font-bold text-paper hover:bg-ink-2"
          >
            {t.getFare}
          </Link>
          <Link to="/ai" search={{ q: `${d.name}` }} className="press rounded-2xl border-2 border-ink/10 py-2 text-center text-sm font-bold hover:border-saffron">
            🤖 AI
          </Link>
          <Link to="/ai" search={{ voice: 1 }} className="press rounded-2xl border-2 border-ink/10 py-2 text-center text-sm font-bold hover:border-saffron">
            🎙 {t.tapSpeak}
          </Link>
        </div>
      </div>
    </article>
  )
}
