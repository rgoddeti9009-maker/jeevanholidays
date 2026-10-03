# AGENTS.md

Jeevan Holidays Shirdi kiosk + mobile booking app (TanStack Start, React 19, Tailwind 4, Netlify). **Continue from PLAN.md.**

## Layout
- `src/data/fixtures.ts` — the ONLY source of business data (rates, vehicles, destinations, packages, sample CRM). Milestone 3 swaps it for Netlify Database queries with the same shapes. Never hard-code fares elsewhere.
- `src/lib/` — `fare.ts` (quote engine: active rate or custom fare request, never estimates), `intent.ts` (multilingual rule-based parser for AI/voice), `i18n.ts` (en/hi/mr/te dictionaries), `app-context.tsx` (language, kiosk mode, session draft, `resetSession`), `voice.ts` (speech in/out, optional), `share.ts` (WhatsApp/tel links, QR continuation URLs without personal data).
- `src/components/` — `Chrome` (header, kiosk vs mobile bottom nav, help sheet, `SessionGuard` idle reset), `QuotationDoc` (printable), `QrCode`, `VoiceButton`, cards.
- `src/routes/` — `index` (home), `kiosk`, `book` (progressive steps), `ai`. `/explore`, `/packages`, `/trip`, `/admin` are linked but not built yet.

## Rules
- Never fake success: payment shows NOT CONNECTED; bookings are "requests" until staff confirm.
- Customer details never go to storage; kiosk sessions are wiped on reset/timeout.
- Images in `public/img` are served via `/.netlify/images` (`components/img.ts`).
