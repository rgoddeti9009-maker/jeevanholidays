import { business } from '@/data/fixtures'

/** Lotus-and-road mark: a stylised marigold sun over a winding road. */
export function Mark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="23" fill="var(--color-ink)" />
      <circle cx="24" cy="19" r="8" fill="var(--color-marigold)" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="23" y="6" width="2" height="4" rx="1" fill="var(--color-saffron)" transform={`rotate(${i * 36} 24 19)`} />
      ))}
      <path d="M8 40 C 18 33, 26 37, 40 29" stroke="var(--color-paper)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M12 43 C 20 38, 28 41, 38 35" stroke="var(--color-saffron)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
    </svg>
  )
}

export function Brand({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const title = size === 'lg' ? 'text-4xl md:text-6xl' : size === 'md' ? 'text-lg md:text-xl' : 'text-base'
  return (
    <div className="flex items-center gap-3">
      <Mark className={size === 'lg' ? 'h-16 w-16 md:h-20 md:w-20' : 'h-10 w-10'} />
      <div className="leading-none">
        <div className={`font-display font-extrabold uppercase ${title} ${light ? 'text-paper' : 'text-ink'}`}>{business.name}</div>
        <div className={`mt-1 text-xs font-semibold uppercase tracking-[0.25em] ${light ? 'text-marigold' : 'text-saffron-deep'}`}>
          Since {business.since}
        </div>
      </div>
    </div>
  )
}
