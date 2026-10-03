import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { parseRequest, searchDestinations } from '@/lib/intent'
import { VoiceButton } from './VoiceButton'

/** "Type or speak destination". Unknown places still go forward as a custom fare request. */
export function DestinationSearch({ dark = false }: { dark?: boolean }) {
  const { t, updateDraft } = useApp()
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const hits = searchDestinations(q).slice(0, 6)

  const go = (to: string) => {
    updateDraft({ to })
    navigate({ to: '/book', search: { service: 'oneway', to } })
  }
  const onVoice = (text: string) => {
    const p = parseRequest(text)
    if (p.to || p.from) {
      updateDraft(p)
      navigate({ to: '/book', search: { service: p.service ?? 'oneway', to: p.to, from: p.from } })
    } else setQ(text)
  }

  return (
    <div className="relative">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (hits[0]) go(hits[0].id)
          else if (q.trim()) go(q.trim())
        }}
        className={`flex items-center gap-2 rounded-full p-2 pl-5 shadow-xl ring-1 ${dark ? 'bg-white ring-white/30' : 'bg-white ring-ink/10'}`}
      >
        <Search className="h-6 w-6 shrink-0 text-saffron" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent py-3 text-lg text-ink outline-none placeholder:text-muted"
          aria-label={t.searchPlaceholder}
        />
        <VoiceButton onText={onVoice} compact />
      </form>
      {q && (
        <ul className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-3xl bg-white text-ink shadow-2xl ring-1 ring-ink/10">
          {hits.map((d) => (
            <li key={d.id}>
              <button onClick={() => go(d.id)} className="flex w-full items-center justify-between px-5 py-3 text-left text-lg hover:bg-paper">
                <span className="font-semibold">{d.name}</span>
                <span className="text-sm text-muted">{d.group === 'airport' ? '✈️ Airport' : d.group === 'railway' ? '🚆 Railway' : '📍'}</span>
              </button>
            </li>
          ))}
          <li>
            <button onClick={() => go(q.trim())} className="w-full border-t border-ink/10 px-5 py-3 text-left hover:bg-paper">
              <span className="font-semibold">“{q.trim()}”</span>{' '}
              <span className="text-sm text-muted">— any destination in India · custom fare request</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
