import { MessageCircle, Phone, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { business } from '@/data/fixtures'
import { useApp } from '@/lib/app-context'
import { draftSummary, telLink, waLink } from '@/lib/share'

/** Human handover. Shares the current enquiry with staff via the customer's own action (call / WhatsApp). */
export function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, draft, sessionId } = useApp()
  const [showCounter, setShowCounter] = useState(false)
  if (!open) return null
  const summary = draftSummary(draft) + `\nSession: ${sessionId}\nCustomer asked for staff help.`
  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm md:items-center" onClick={onClose}>
      <div className="rise w-full max-w-lg rounded-3xl bg-paper p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">👤 {t.talkStaff}</h2>
          <button onClick={onClose} className="press rounded-full p-2 hover:bg-ink/5" aria-label="Close">
            <X />
          </button>
        </div>
        {!showCounter ? (
          <div className="grid gap-3">
            {business.phones.map((p, i) => (
              <a key={p.e164} href={telLink(i)} className="press flex items-center gap-4 rounded-2xl bg-ink p-4 text-paper hover:bg-ink-2">
                <Phone className="h-6 w-6 text-marigold" />
                <div>
                  <div className="text-lg font-bold">{t.callStaff}</div>
                  <div className="text-paper/70">{p.display}</div>
                </div>
              </a>
            ))}
            <a href={waLink(summary)} target="_blank" rel="noreferrer" className="press flex items-center gap-4 rounded-2xl bg-leaf p-4 text-white hover:brightness-110">
              <MessageCircle className="h-6 w-6" />
              <div>
                <div className="text-lg font-bold">WhatsApp staff</div>
                <div className="text-white/75">Sends your trip details so you don’t repeat yourself</div>
              </div>
            </a>
            <button onClick={() => setShowCounter(true)} className="press flex items-center gap-4 rounded-2xl border-2 border-ink/15 p-4 text-left hover:border-saffron">
              <UserRound className="h-6 w-6 text-saffron" />
              <div>
                <div className="text-lg font-bold">{t.staffAssist}</div>
                <div className="text-muted">Show your enquiry at the counter</div>
              </div>
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-muted">Please show this to a Jeevan Holidays team member at the counter (opposite VIP Gate No. 2).</p>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 font-sans text-base ring-1 ring-ink/10">{summary}</pre>
            <button onClick={() => setShowCounter(false)} className="press mt-4 rounded-full px-4 py-2 font-semibold text-saffron-deep hover:bg-saffron/10">
              ← {t.back}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
