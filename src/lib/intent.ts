/**
 * Local trip-request understanding for the assistant and voice booking.
 *
 * Extracts pickup, destination, date, time, passengers, vehicle and service
 * from free text in English, Hindi, Marathi or Telugu. It only ever fills
 * fields — it never produces fares or availability. A hosted LLM replaces /
 * augments this in a later milestone behind the same `parseRequest` shape.
 */
import { destinations, vehicles } from '@/data/fixtures'
import type { ServiceId, VehicleId } from '@/data/fixtures'
import type { Draft } from './fare'

export type Parsed = Partial<Draft> & { days?: number }

const NUMBER_WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, पाँच: 5, छह: 6, छः: 6, सात: 7, आठ: 8, नौ: 9, दस: 10,
  दोन: 2, सहा: 6, नऊ: 9, पाच: 5,
  ఒకరు: 1, ఇద్దరు: 2, ముగ్గురు: 3, నలుగురు: 4, ఐదుగురు: 5, ఆరుగురు: 6, ఏడుగురు: 7, ఎనిమిది: 8,
}

const PEOPLE = '(?:people|persons|person|pax|adults|members|passengers|log|लोग|लोगों|लोगो|व्यक्ति|जण|जणांसाठी|जणांना|लोक|प्रवासी|మంది|మందికి|ప్రయాణికులు)'

const VEHICLE_ALIASES: [VehicleId, string[]][] = [
  ['dzire', ['dzire', 'desire', 'sedan', 'डिजायर', 'डिझायर', 'డిజైర్']],
  ['ertiga', ['ertiga', 'अर्टिगा', 'एर्टिगा', 'ఎర్టిగా']],
  ['tavera', ['tavera', 'तवेरा', 'टवेरा', 'తవేరా']],
  ['crysta', ['crysta', 'innova', 'इनोवा', 'क्रिस्टा', 'ఇన్నోవా', 'క్రిస్టా']],
  ['actraveller', ['ac traveller', 'ac traveler', 'एसी ट्रैवलर']],
  ['tempo', ['tempo', 'traveller', 'traveler', 'टेम्पो', 'ट्रैवलर', 'ట్రావెలర్', 'టెంపో']],
]

const SERVICE_KEYWORDS: [ServiceId, RegExp][] = [
  ['airport', /airport|flight pickup|एयरपोर्ट|विमानतळ|హవాయి|ఎయిర్‌పోర్ట్|ఎయిర్ పోర్ట్/i],
  ['railway', /railway|station|train|रेलवे|स्टेशन|रेल्वे|స్టేషన్|రైల్వే/i],
  ['roundtrip', /round ?trip|return|आना जाना|वापसी|परत|రిటర్న్|రౌండ్/i],
  ['packages', /package|tour|पैकेज|पॅकेज|टूर|ప్యాకేజీ|టూర్/i],
  ['sightseeing', /sightseeing|darshan|दर्शन|घूमना|సందర్శన|దర్శనం/i],
  ['hotel', /hotel|room|होटल|हॉटेल|హోటల్/i],
  ['bus', /\bbus\b|बस|బస్/i],
  ['flight', /flight ticket|फ़्लाइट|फ्लाइट|విమానం/i],
  ['rental', /rental|self drive|full day|किराये|भाड्याने|అద్దె/i],
]

const FROM_AFTER = /^\s*(?:से|पासून|हून|నుండి|నుంచి|se\b)/
const FROM_BEFORE = /(?:from|pickup at|pick up from|pick me from)\s*$/i

const isoDate = (d: Date) => {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

function dateFrom(text: string): string | undefined {
  const now = new Date()
  const plus = (n: number) => isoDate(new Date(now.getTime() + n * 86400000))
  if (/day after tomorrow|परसों|परवा|ఎల్లుండి/i.test(text)) return plus(2)
  // "kal" is tomorrow in a booking context
  if (/tomorrow|\bkal\b|कल|उद्या|రేపు/i.test(text)) return plus(1)
  if (/today|tonight|\baaj\b|आज|ఈ ?రోజు|ఈరోజు/i.test(text)) return plus(0)
  const iso = text.match(/\b(20\d\d)-(\d{2})-(\d{2})\b/)
  if (iso) return iso[0]
  const dm = text.match(/\b(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?\b/)
  if (dm && +dm[2] >= 1 && +dm[2] <= 12 && +dm[1] >= 1 && +dm[1] <= 31 && !/am|pm|बजे|वाजता/i.test(text.slice(dm.index! + dm[0].length, dm.index! + dm[0].length + 4))) {
    const y = dm[3] ? (dm[3].length === 2 ? 2000 + +dm[3] : +dm[3]) : now.getFullYear()
    return `${y}-${dm[2].padStart(2, '0')}-${dm[1].padStart(2, '0')}`
  }
  return undefined
}

function timeFrom(text: string): string | undefined {
  const m = text.match(/\b(\d{1,2})(?::|\.)?(\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/i)
  const local = text.match(/(\d{1,2})(?::(\d{2}))?\s*(?:बजे|वाजता|గంటలకు|baje|o'?clock)/i)
  const hit = m ?? local
  if (!hit) return undefined
  let h = +hit[1]
  const min = hit[2] ? +hit[2] : 0
  const pm = /pm|p\.m\./i.test(hit[3] ?? '') || /शाम|संध्याकाळी|रात|రాత్రి|సాయంత్రం|evening|night/i.test(text)
  if (pm && h < 12) h += 12
  if (/am|a\.m\./i.test(hit[3] ?? '') && h === 12) h = 0
  if (h > 23 || min > 59) return undefined
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function passengersFrom(text: string): number | undefined {
  const digit = text.match(new RegExp(`(\\d{1,2})\\s*${PEOPLE}`, 'i'))
  if (digit) return +digit[1]
  for (const [word, n] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`(?:^|\\s)${word}(?:\\s*${PEOPLE}|\\s|$)`, 'i').test(text) && new RegExp(PEOPLE, 'i').test(text)) return n
    if (/[ఁ-౿]/.test(word) && text.includes(word)) return n
  }
  const bare = text.match(/^\s*(\d{1,2})\s*$/)
  return bare ? +bare[1] : undefined
}

/** Find destination mentions, longest alias first, in order of appearance. */
function placesFrom(text: string) {
  const lower = text.toLowerCase()
  const masked = lower.split('')
  const all = destinations
    .flatMap((d) => d.aliases.map((a) => ({ id: d.id, alias: a.toLowerCase() })))
    .sort((a, b) => b.alias.length - a.alias.length)
  const hits: { id: string; index: number; end: number }[] = []
  for (const { id, alias } of all) {
    let from = 0
    while (true) {
      const i = masked.join('').indexOf(alias, from)
      if (i < 0) break
      hits.push({ id, index: i, end: i + alias.length })
      for (let k = i; k < i + alias.length; k++) masked[k] = '\u0000'
      from = i + alias.length
    }
  }
  return hits.sort((a, b) => a.index - b.index).map((h) => ({ ...h, after: lower.slice(h.end), before: lower.slice(0, h.index) }))
}

export function parseRequest(text: string): Parsed {
  const out: Parsed = {}
  const places = placesFrom(text)
  const fromHit = places.find((p) => FROM_AFTER.test(p.after) || FROM_BEFORE.test(p.before))
  if (fromHit) {
    out.from = fromHit.id
    const other = places.find((p) => p !== fromHit)
    if (other) out.to = other.id
  } else if (places.length >= 2) {
    out.from = places[0].id
    out.to = places[1].id
  } else if (places.length === 1) {
    out.to = places[0].id
  }

  const date = dateFrom(text)
  if (date) out.date = date
  const time = timeFrom(text)
  if (time) out.time = time
  const pax = passengersFrom(text)
  if (pax) out.passengers = pax

  const lower = text.toLowerCase()
  const v = VEHICLE_ALIASES.find(([, list]) => list.some((a) => lower.includes(a)))
  if (v) out.vehicleId = v[0]

  const s = SERVICE_KEYWORDS.find(([, re]) => re.test(text))
  if (s) out.service = s[0]

  const days = text.match(/(\d{1,2})\s*(?:days|day|दिन|दिवस|రోజులు|రోజుల)/i)
  if (days) out.days = +days[1]
  return out
}

export const destinationName = (idOrText: string) => destinations.find((d) => d.id === idOrText)?.name ?? idOrText

export function searchDestinations(q: string) {
  const s = q.trim().toLowerCase()
  if (!s) return []
  return destinations.filter((d) => d.name.toLowerCase().includes(s) || d.aliases.some((a) => a.toLowerCase().includes(s)))
}

export const vehicleIds = vehicles.map((v) => v.id)
