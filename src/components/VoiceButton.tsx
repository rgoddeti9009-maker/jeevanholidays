import { Mic, MicOff } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { useSpeechInput } from '@/lib/voice'

type Props = { onText: (text: string) => void; size?: 'md' | 'xl'; className?: string; compact?: boolean }

export function VoiceButton({ onText, size = 'md', className = '', compact = false }: Props) {
  const { speechLang, t } = useApp()
  const { supported, listening, interim, error, start, stop } = useSpeechInput(speechLang, onText)

  if (!supported) {
    if (compact) return null
    return (
      <div className={`flex items-center gap-2 text-sm text-muted ${className}`}>
        <MicOff className="h-4 w-4" /> Voice input isn’t available in this browser — type instead.
      </div>
    )
  }
  const big = size === 'xl'
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={listening ? stop : start}
        className={`press grid place-items-center rounded-full bg-saffron text-white shadow-lg shadow-saffron/30 hover:bg-saffron-deep ${
          big ? 'h-28 w-28' : 'h-14 w-14'
        } ${listening ? 'mic-live' : ''}`}
        aria-label={t.tapSpeak}
      >
        <Mic className={big ? 'h-12 w-12' : 'h-6 w-6'} />
      </button>
      {big && <div className="font-display text-xl font-bold uppercase">{listening ? t.listening : `🎙 ${t.tapSpeak}`}</div>}
      {!compact && listening && interim && <div className="max-w-md text-center text-lg italic text-ink-2">“{interim}”</div>}
      {!compact && !listening && error === 'unclear' && <div className="text-sm font-semibold text-temple">{t.speakAgain}</div>}
      {!compact && !listening && error === 'denied' && <div className="text-sm font-semibold text-temple">Microphone permission is blocked.</div>}
    </div>
  )
}
