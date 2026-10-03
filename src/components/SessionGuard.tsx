import { useNavigate } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { kioskTiming, useApp } from '@/lib/app-context'

/**
 * Public-kiosk privacy: after inactivity, ask "Are you still booking?" and,
 * with no answer, wipe the session and return to the welcome screen.
 */
export function SessionGuard() {
  const { kiosk, t, resetSession } = useApp()
  const navigate = useNavigate()
  const [warning, setWarning] = useState<number | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const end = useCallback(() => {
    setWarning(null)
    resetSession()
    navigate({ to: '/kiosk', search: { ended: 1 } })
  }, [resetSession, navigate])

  const arm = useCallback(() => {
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setWarning(kioskTiming.warningSeconds), kioskTiming.idleMs)
  }, [])

  useEffect(() => {
    if (!kiosk) return
    const onActivity = () => {
      if (warning === null) arm()
    }
    arm()
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    return () => {
      clearTimeout(idleTimer.current)
      events.forEach((e) => window.removeEventListener(e, onActivity))
    }
  }, [kiosk, arm, warning])

  useEffect(() => {
    if (warning === null) return
    if (warning <= 0) return end()
    const id = setTimeout(() => setWarning((w) => (w ?? 1) - 1), 1000)
    return () => clearTimeout(id)
  }, [warning, end])

  if (!kiosk || warning === null) return null
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-6 backdrop-blur">
      <div className="rise w-full max-w-md rounded-3xl bg-paper p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-saffron font-display text-4xl font-extrabold text-white">{warning}</div>
        <h2 className="text-3xl font-extrabold">{t.stillBooking}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button onClick={() => { setWarning(null); arm() }} className="press rounded-2xl bg-ink py-4 text-lg font-bold text-paper">
            {t.continue}
          </button>
          <button onClick={end} className="press rounded-2xl border-2 border-ink/20 py-4 text-lg font-bold">
            {t.startNew}
          </button>
        </div>
      </div>
    </div>
  )
}
