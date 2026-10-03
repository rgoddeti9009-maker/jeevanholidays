import { useApp } from '@/lib/app-context'
import { languages } from '@/lib/i18n'

export function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useApp()
  return (
    <div className={`flex rounded-full p-1 ${dark ? 'bg-white/10' : 'bg-ink/5'}`} role="radiogroup" aria-label="Language">
      {languages.map((l) => (
        <button
          key={l.id}
          role="radio"
          aria-checked={lang === l.id}
          onClick={() => setLang(l.id)}
          className={`press rounded-full px-3 py-1 text-sm font-semibold ${
            lang === l.id ? 'bg-saffron text-white' : dark ? 'text-paper/80 hover:text-paper' : 'text-ink/70 hover:text-ink'
          }`}
        >
          {l.native}
        </button>
      ))}
    </div>
  )
}
