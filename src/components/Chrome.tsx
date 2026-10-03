import { Link, useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { ArrowLeft, Bot, CalendarCheck, Home, LifeBuoy, Package, RotateCcw, Ticket } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Brand } from './Brand'
import { HelpSheet } from './HelpSheet'
import { LangSwitch } from './LangSwitch'
import { SessionGuard } from './SessionGuard'

/** Customer-facing frame shared by kiosk and mobile: header, bottom navigation, help, privacy guard. */
export function Chrome({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  const { kiosk, t, resetSession } = useApp()
  const [help, setHelp] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()

  if (pathname.startsWith('/admin')) return <>{children}</>
  const bare = pathname === '/kiosk'

  const startOver = () => {
    resetSession()
    navigate({ to: kiosk ? '/kiosk' : '/' })
  }

  const navItem = 'press flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold md:text-sm'
  const active = (p: string) => (pathname === p ? 'text-saffron' : 'text-paper/75 hover:text-paper')

  return (
    <div className="flex min-h-dvh flex-col">
      {!bare && (
        <header className="no-print sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" aria-label={t.home}>
              <Brand size="sm" />
            </Link>
            <div className="hidden sm:block">
              <LangSwitch />
            </div>
          </div>
          <div className="flex justify-center pb-2 sm:hidden">
            <LangSwitch />
          </div>
        </header>
      )}

      <main className="flex-1 pb-28">{children}</main>

      {!bare && (
        <nav className="no-print fixed inset-x-0 bottom-0 z-40 bg-ink px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(27,20,48,0.25)]">
          <div className="mx-auto flex max-w-3xl gap-1">
            {kiosk ? (
              <>
                <Link to="/" className={`${navItem} ${active('/')}`}><Home className="h-6 w-6" />{t.home}</Link>
                <button onClick={() => router.history.back()} className={`${navItem} text-paper/75 hover:text-paper`}><ArrowLeft className="h-6 w-6" />{t.back}</button>
                <Link to="/ai" className={`${navItem} ${active('/ai')}`}><Bot className="h-6 w-6" />AI</Link>
                <button onClick={() => setHelp(true)} className={`${navItem} text-paper/75 hover:text-paper`}><LifeBuoy className="h-6 w-6" />{t.help}</button>
                <button onClick={startOver} className={`${navItem} bg-saffron text-white`}><RotateCcw className="h-6 w-6" />{t.startOver}</button>
              </>
            ) : (
              <>
                <Link to="/" className={`${navItem} ${active('/')}`}><Home className="h-6 w-6" />{t.home}</Link>
                <Link to="/ai" className={`${navItem} ${active('/ai')}`}><Bot className="h-6 w-6" />AI</Link>
                <Link to="/book" className={`${navItem} ${active('/book')}`}><CalendarCheck className="h-6 w-6" />{t.book}</Link>
                <Link to="/packages" className={`${navItem} ${active('/packages')}`}><Package className="h-6 w-6" />{t.packages}</Link>
                <Link to="/trip" className={`${navItem} ${active('/trip')}`}><Ticket className="h-6 w-6" />{t.myTrip}</Link>
              </>
            )}
          </div>
        </nav>
      )}

      {!kiosk && !bare && (
        <button
          onClick={() => setHelp(true)}
          className="no-print press fixed bottom-24 right-4 z-40 rounded-full bg-paper px-4 py-2 text-sm font-bold shadow-lg ring-1 ring-ink/10 hover:ring-saffron"
        >
          👤 {t.needHelp}
        </button>
      )}
      {kiosk && bare && (
        <button
          onClick={() => setHelp(true)}
          className="no-print press fixed right-5 top-5 z-40 rounded-full bg-white/10 px-5 py-3 font-bold text-paper ring-1 ring-white/20"
        >
          👤 {t.needHelp}
        </button>
      )}
      <HelpSheet open={help} onClose={() => setHelp(false)} />
      <SessionGuard />
    </div>
  )
}
