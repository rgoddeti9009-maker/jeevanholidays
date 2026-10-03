import { Link } from '@tanstack/react-router'
import { services } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'

export function ServiceGrid({ big = false }: { big?: boolean }) {
  const { t } = useApp()
  return (
    <div className={`grid gap-3 ${big ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
      {services.map((s, i) => (
        <Link
          key={s.id}
          to={s.id === 'packages' ? '/packages' : '/book'}
          search={s.id === 'packages' ? undefined : { service: s.id }}
          className={`press rise group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-ink/10 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-saffron/10 hover:ring-saffron ${
            big ? 'min-h-36' : 'min-h-28'
          }`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span className={`${big ? 'text-5xl' : 'text-4xl'} transition-transform group-hover:scale-110`} aria-hidden>
            {s.emoji}
          </span>
          <span className={`font-display font-bold uppercase leading-tight ${big ? 'text-lg' : 'text-base'}`}>{t.services[s.id]}</span>
          <span className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-marigold/0 transition-colors group-hover:bg-marigold/20" />
        </Link>
      ))}
    </div>
  )
}
