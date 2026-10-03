import { useCallback, useEffect, useRef, useState } from 'react'

/* Browser speech APIs. Both are optional hardware/browser features: every
   caller must keep working (touch + typing) when they are unavailable. */

type Recognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor(): (new () => Recognition) | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function useSpeechInput(lang: string, onFinal: (text: string) => void) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<'unclear' | 'denied' | null>(null)
  const rec = useRef<Recognition | null>(null)
  const cb = useRef(onFinal)
  cb.current = onFinal

  useEffect(() => setSupported(!!getRecognitionCtor()), [])
  useEffect(() => () => rec.current?.abort(), [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    rec.current?.abort()
    const r = new Ctor()
    r.lang = lang
    r.interimResults = true
    r.maxAlternatives = 1
    let got = false
    r.onresult = (e: any) => {
      let text = ''
      let final = false
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript
        if (e.results[i].isFinal) final = true
      }
      setInterim(text)
      if (final && text.trim()) {
        got = true
        cb.current(text.trim())
      }
    }
    r.onerror = (e: any) => setError(e.error === 'not-allowed' ? 'denied' : 'unclear')
    r.onend = () => {
      setListening(false)
      setInterim('')
      if (!got) setError((prev) => prev ?? 'unclear')
    }
    rec.current = r
    setError(null)
    setListening(true)
    r.start()
  }, [lang])

  const stop = useCallback(() => rec.current?.stop(), [])
  return { supported, listening, interim, error, start, stop }
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, lang: string) {
  if (!canSpeak()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang === lang) ?? window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(lang.slice(0, 2)))
  if (voice) u.voice = voice
  u.rate = 0.95
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}
