import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { settings } from '@/data/fixtures'
import type { Draft } from './fare'
import { newReference } from './fare'
import { dictionaries, languages } from './i18n'
import type { Lang } from './i18n'
import { stopSpeaking } from './voice'

type AppState = {
  lang: Lang
  langChosen: boolean
  setLang: (l: Lang) => void
  speechLang: string
  t: (typeof dictionaries)['en']
  kiosk: boolean
  setKiosk: (on: boolean) => void
  sessionId: string
  draft: Draft
  updateDraft: (patch: Partial<Draft>) => void
  /** Wipes every trace of the current customer and starts a fresh session. */
  resetSession: () => void
  voiceReplies: boolean
  setVoiceReplies: (on: boolean) => void
}

const Ctx = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [langChosen, setLangChosen] = useState(false)
  const [kiosk, setKioskState] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [draft, setDraft] = useState<Draft>({})
  const [voiceReplies, setVoiceReplies] = useState(true)

  // Only non-personal preferences survive a reload; customer details never touch storage.
  useEffect(() => {
    const l = sessionStorage.getItem('jh.lang') as Lang | null
    if (l && dictionaries[l]) {
      setLangState(l)
      setLangChosen(true)
    }
    setKioskState(localStorage.getItem('jh.kiosk') === '1')
    setSessionId(newReference('KSK'))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.kiosk = kiosk ? 'on' : 'off'
    document.documentElement.lang = lang
  }, [kiosk, lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    setLangChosen(true)
    sessionStorage.setItem('jh.lang', l)
  }, [])

  const setKiosk = useCallback((on: boolean) => {
    setKioskState(on)
    localStorage.setItem('jh.kiosk', on ? '1' : '0')
  }, [])

  const updateDraft = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), [])

  const resetSession = useCallback(() => {
    stopSpeaking()
    setDraft({})
    setLangState('en')
    setLangChosen(false)
    sessionStorage.clear()
    setSessionId(newReference('KSK'))
  }, [])

  const value = useMemo<AppState>(
    () => ({
      lang,
      langChosen,
      setLang,
      speechLang: languages.find((l) => l.id === lang)!.speech,
      t: dictionaries[lang],
      kiosk,
      setKiosk,
      sessionId,
      draft,
      updateDraft,
      resetSession,
      voiceReplies,
      setVoiceReplies,
    }),
    [lang, langChosen, setLang, kiosk, setKiosk, sessionId, draft, updateDraft, resetSession, voiceReplies],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}

export const kioskTiming = {
  idleMs: (settings.kioskTimeoutSeconds - settings.kioskWarningSeconds) * 1000,
  warningSeconds: settings.kioskWarningSeconds,
}
