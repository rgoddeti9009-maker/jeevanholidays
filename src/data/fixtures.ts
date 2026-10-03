/**
 * Milestone 1 stub data.
 *
 * Every business fact the UI shows (rates, vehicles, destinations, packages,
 * CRM records) is read from this one module. Milestone 2 replaces these
 * exports with Netlify Database queries that have the same shapes, so the
 * screens do not need to change. Do NOT hard-code fares anywhere else.
 */

export const business = {
  name: 'Jeevan Holidays Shirdi',
  since: 1997,
  tagline: 'Your Trusted Travel Partner in Shirdi',
  proprietor: 'Robin Goddeti',
  address: 'Opposite VIP Gate No. 2, Pimpalwadi Road, Shirdi – 423109, Maharashtra, India',
  phones: [
    { display: '95111 88188', e164: '919511188188' },
    { display: '90966 90947', e164: '919096690947' },
  ],
  instagram: 'jeevanholidays',
}

export type ServiceId =
  | 'oneway'
  | 'roundtrip'
  | 'sightseeing'
  | 'packages'
  | 'airport'
  | 'railway'
  | 'hotel'
  | 'bus'
  | 'flight'
  | 'rental'

export type Service = {
  id: ServiceId
  emoji: string
  /** true = handled by the cab/package fare engine; false = staff-assisted enquiry */
  fareEngine: boolean
}

export const services: Service[] = [
  { id: 'oneway', emoji: '🚕', fareEngine: true },
  { id: 'roundtrip', emoji: '🔄', fareEngine: true },
  { id: 'sightseeing', emoji: '📍', fareEngine: true },
  { id: 'packages', emoji: '📦', fareEngine: true },
  { id: 'airport', emoji: '✈️', fareEngine: true },
  { id: 'railway', emoji: '🚆', fareEngine: true },
  { id: 'hotel', emoji: '🏨', fareEngine: false },
  { id: 'bus', emoji: '🚌', fareEngine: false },
  { id: 'flight', emoji: '🛫', fareEngine: false },
  { id: 'rental', emoji: '🚗', fareEngine: true },
]

export type VehicleId = 'dzire' | 'ertiga' | 'tavera' | 'crysta' | 'tempo' | 'actraveller'

export type Vehicle = {
  id: VehicleId
  name: string
  seats: string
  maxPassengers: number
  ac: boolean
  luggage: string
  emoji: string
}

export const vehicles: Vehicle[] = [
  { id: 'dzire', name: 'Swift Dzire', seats: '4 passengers', maxPassengers: 4, ac: true, luggage: '2 bags', emoji: '🚗' },
  { id: 'ertiga', name: 'Ertiga', seats: '6 passengers', maxPassengers: 6, ac: true, luggage: '3 bags', emoji: '🚙' },
  { id: 'tavera', name: 'Tavera', seats: '7 passengers', maxPassengers: 7, ac: true, luggage: '3 bags', emoji: '🚙' },
  { id: 'crysta', name: 'Innova Crysta', seats: '6–7 passengers', maxPassengers: 7, ac: true, luggage: '4 bags', emoji: '🚘' },
  { id: 'tempo', name: 'Tempo Traveller', seats: '12 passengers', maxPassengers: 12, ac: false, luggage: '8 bags', emoji: '🚐' },
  { id: 'actraveller', name: 'AC Traveller 13/17', seats: '13 or 17 passengers', maxPassengers: 17, ac: true, luggage: '10 bags', emoji: '🚐' },
]

export type DestinationGroup = 'popular' | 'railway' | 'airport'

export type Destination = {
  id: string
  name: string
  group: DestinationGroup
  /** Generated photo in /public/img, if any */
  image?: string
  services: ServiceId[]
  /** Alternate spellings / scripts used by search and the voice parser */
  aliases: string[]
}

export const destinations: Destination[] = [
  { id: 'shirdi', name: 'Shirdi', group: 'popular', image: 'shirdi.png', services: ['sightseeing', 'oneway', 'roundtrip'], aliases: ['shirdi', 'शिर्डी', 'షిర్డీ', 'శిర్డీ', 'sai baba'] },
  { id: 'nashik', name: 'Nashik', group: 'popular', image: 'nashik.png', services: ['sightseeing', 'oneway', 'roundtrip'], aliases: ['nashik', 'nasik', 'नासिक', 'नाशिक', 'నాసిక్'] },
  { id: 'trimbakeshwar', name: 'Trimbakeshwar', group: 'popular', image: 'trimbakeshwar.png', services: ['sightseeing', 'oneway', 'roundtrip'], aliases: ['trimbakeshwar', 'trimbak', 'त्र्यंबकेश्वर', 'त्रिंबकेश्वर', 'త్రయంబకేశ్వర్'] },
  { id: 'shani', name: 'Shani Shingnapur', group: 'popular', image: 'shani.png', services: ['sightseeing', 'roundtrip'], aliases: ['shani shingnapur', 'shingnapur', 'shani', 'शनि शिंगणापूर', 'शनि शिंगनापुर', 'शिंगणापूर', 'శని శింగ్నాపూర్'] },
  { id: 'sambhajinagar', name: 'Chh. Sambhajinagar', group: 'popular', image: 'sambhajinagar.png', services: ['sightseeing', 'oneway', 'packages'], aliases: ['sambhajinagar', 'aurangabad', 'ellora', 'संभाजीनगर', 'औरंगाबाद', 'సంభాజీనగర్', 'ఔరంగాబాద్'] },
  { id: 'saptashrungi', name: 'Vani / Saptashrungi', group: 'popular', image: 'saptashrungi.png', services: ['sightseeing', 'packages'], aliases: ['vani', 'saptashrungi', 'saptashringi', 'वणी', 'सप्तश्रृंगी', 'सप्तशृंगी', 'సప్తశృంగి'] },
  { id: 'bhimashankar', name: 'Bhimashankar', group: 'popular', image: 'bhimashankar.png', services: ['sightseeing', 'roundtrip'], aliases: ['bhimashankar', 'भीमाशंकर', 'భీమశంకర్'] },
  { id: 'pune', name: 'Pune', group: 'popular', image: 'pune.png', services: ['oneway', 'airport'], aliases: ['pune', 'poona', 'पुणे', 'పూణే'] },
  { id: 'mumbai', name: 'Mumbai', group: 'popular', image: 'mumbai.png', services: ['oneway', 'airport'], aliases: ['mumbai', 'bombay', 'मुंबई', 'ముంబై'] },
  { id: 'kopargaon', name: 'Kopargaon', group: 'railway', services: ['railway'], aliases: ['kopargaon', 'कोपरगाव', 'कोपरगांव', 'కోపర్గావ్'] },
  { id: 'manmad', name: 'Manmad', group: 'railway', services: ['railway'], aliases: ['manmad', 'मनमाड', 'మన్మాడ్'] },
  { id: 'nagarsol', name: 'Nagarsol', group: 'railway', services: ['railway'], aliases: ['nagarsol', 'नगरसोल', 'నగర్సోల్'] },
  { id: 'nashikroad', name: 'Nashik Road', group: 'railway', services: ['railway'], aliases: ['nashik road', 'नाशिक रोड', 'नासिक रोड'] },
  { id: 'sainagar', name: 'Sainagar Shirdi', group: 'railway', services: ['railway'], aliases: ['sainagar', 'साईनगर', 'సాయినగర్'] },
  { id: 'air-shirdi', name: 'Shirdi Airport', group: 'airport', services: ['airport'], aliases: ['shirdi airport', 'शिर्डी विमानतळ', 'शिर्डी एयरपोर्ट'] },
  { id: 'air-ozar', name: 'Nashik Ozar Airport', group: 'airport', services: ['airport'], aliases: ['ozar', 'ओझर'] },
  { id: 'air-sambhajinagar', name: 'Chh. Sambhajinagar Airport', group: 'airport', services: ['airport'], aliases: ['aurangabad airport', 'sambhajinagar airport'] },
  { id: 'air-pune', name: 'Pune Airport', group: 'airport', services: ['airport'], aliases: ['pune airport', 'पुणे विमानतळ'] },
  { id: 'air-mumbai-t1', name: 'Mumbai T1', group: 'airport', services: ['airport'], aliases: ['mumbai t1', 'terminal 1'] },
  { id: 'air-mumbai-t2', name: 'Mumbai T2', group: 'airport', services: ['airport'], aliases: ['mumbai t2', 'terminal 2', 'mumbai airport'] },
]

export type TourPackage = {
  id: string
  name: string
  duration: string
  startsFrom: string
  /** destination ids this package covers — used to match a requested trip */
  covers: string[]
  image?: string
  includes: string[]
  excludes: string[]
}

export const packages: TourPackage[] = [
  {
    id: 'nashik-darshan',
    name: 'Nashik Darshan',
    duration: '1 day',
    startsFrom: 'Shirdi',
    covers: ['nashik', 'trimbakeshwar'],
    image: 'nashik.png',
    includes: ['AC vehicle with driver', 'Fuel', 'Driver allowance'],
    excludes: ['Toll & parking', 'Temple entry / darshan passes', 'Meals'],
  },
  {
    id: 'shani-sambhajinagar',
    name: 'Shani Shingnapur + Chh. Sambhajinagar',
    duration: '1 day',
    startsFrom: 'Shirdi',
    covers: ['shani', 'sambhajinagar'],
    image: 'shani.png',
    includes: ['AC vehicle with driver', 'Fuel', 'Driver allowance'],
    excludes: ['Toll & parking', 'Monument entry tickets', 'Meals'],
  },
  {
    id: 'vani-nashik',
    name: 'Vani Saptashrungi + Nashik',
    duration: '1 day',
    startsFrom: 'Shirdi',
    covers: ['saptashrungi', 'nashik'],
    image: 'saptashrungi.png',
    includes: ['AC vehicle with driver', 'Fuel', 'Driver allowance'],
    excludes: ['Toll & parking', 'Ropeway tickets', 'Meals'],
  },
  {
    id: 'bhimashankar',
    name: 'Bhimashankar',
    duration: '1 day',
    startsFrom: 'Shirdi',
    covers: ['bhimashankar'],
    image: 'bhimashankar.png',
    includes: ['AC vehicle with driver', 'Fuel', 'Driver allowance'],
    excludes: ['Toll & parking', 'Meals'],
  },
  {
    id: 'sambhajinagar-nashik-2d',
    name: 'Chh. Sambhajinagar + Nashik',
    duration: '2 days / 1 night',
    startsFrom: 'Shirdi',
    covers: ['sambhajinagar', 'nashik'],
    image: 'sambhajinagar.png',
    includes: ['AC vehicle with driver', 'Fuel', 'Driver allowance & night halt'],
    excludes: ['Hotel', 'Toll & parking', 'Entry tickets', 'Meals'],
  },
]

/** RATES table — editable initial values, active rows only. */
export type Rate = {
  id: string
  packageId: string
  vehicleId: VehicleId
  amount: number
  active: boolean
  updatedAt: string
}

export const rates: Rate[] = [
  { id: 'r1', packageId: 'nashik-darshan', vehicleId: 'dzire', amount: 3500, active: true, updatedAt: '2026-09-01' },
  { id: 'r2', packageId: 'shani-sambhajinagar', vehicleId: 'dzire', amount: 4000, active: true, updatedAt: '2026-09-01' },
  { id: 'r3', packageId: 'shani-sambhajinagar', vehicleId: 'ertiga', amount: 4500, active: true, updatedAt: '2026-09-01' },
  { id: 'r4', packageId: 'shani-sambhajinagar', vehicleId: 'tavera', amount: 5000, active: true, updatedAt: '2026-09-01' },
  { id: 'r5', packageId: 'shani-sambhajinagar', vehicleId: 'crysta', amount: 6500, active: true, updatedAt: '2026-09-01' },
  { id: 'r6', packageId: 'shani-sambhajinagar', vehicleId: 'actraveller', amount: 9000, active: true, updatedAt: '2026-09-01' },
  { id: 'r7', packageId: 'vani-nashik', vehicleId: 'dzire', amount: 5000, active: true, updatedAt: '2026-09-01' },
  { id: 'r8', packageId: 'vani-nashik', vehicleId: 'ertiga', amount: 6000, active: true, updatedAt: '2026-09-01' },
  { id: 'r9', packageId: 'bhimashankar', vehicleId: 'dzire', amount: 5000, active: true, updatedAt: '2026-09-01' },
  { id: 'r10', packageId: 'bhimashankar', vehicleId: 'ertiga', amount: 6000, active: true, updatedAt: '2026-09-01' },
  { id: 'r11', packageId: 'sambhajinagar-nashik-2d', vehicleId: 'dzire', amount: 9999, active: true, updatedAt: '2026-09-01' },
  { id: 'r12', packageId: 'sambhajinagar-nashik-2d', vehicleId: 'ertiga', amount: 12499, active: true, updatedAt: '2026-09-01' },
]

/** SETTINGS table */
export const settings = {
  /** Advance collected at booking, as % of total. Confirm with the owner before go-live. */
  advancePercent: 25,
  kioskTimeoutSeconds: 60,
  kioskWarningSeconds: 15,
  softwareVersion: '0.1.0',
}

/** Integration status — every one is NOT CONNECTED until a later milestone wires it up. */
export const integrations = [
  { id: 'database', name: 'Netlify Database (Postgres)', connected: false },
  { id: 'payment', name: 'Payment gateway / UPI', connected: false },
  { id: 'whatsapp-api', name: 'WhatsApp Business Platform', connected: false },
  { id: 'ai', name: 'AI travel agent (AI Gateway)', connected: false },
  { id: 'sheets', name: 'Google Sheets sync', connected: false },
  { id: 'maps', name: 'Google Maps distance', connected: false },
  { id: 'sms', name: 'SMS', connected: false },
  { id: 'email', name: 'Email', connected: false },
  { id: 'flight', name: 'Flight API', connected: false },
  { id: 'rail', name: 'Railway API', connected: false },
  { id: 'hotel', name: 'Hotel API', connected: false },
  { id: 'printer', name: 'Thermal receipt printer', connected: false },
]

// ---------------------------------------------------------------------------
// Sample CRM records (admin preview only). Replaced by real tables in M2.
// ---------------------------------------------------------------------------

export const bookingStatuses = [
  'NEW ENQUIRY',
  'QUOTATION SENT',
  'CUSTOMER CONFIRMED',
  'ADVANCE PENDING',
  'ADVANCE RECEIVED',
  'AWAITING AVAILABILITY',
  'BOOKING CONFIRMED',
  'DRIVER ASSIGNED',
  'TRIP STARTED',
  'TRIP COMPLETED',
  'CANCELLED',
] as const
export type BookingStatus = (typeof bookingStatuses)[number]

export type DriverStatus = 'Available' | 'Assigned' | 'On Trip' | 'Unavailable'
export type Driver = { id: string; name: string; phone: string; vehicleId: VehicleId; plate: string; status: DriverStatus }

export const sampleDrivers: Driver[] = [
  { id: 'DRV-001', name: 'Sanjay Pawar', phone: '98XXXXXX12', vehicleId: 'crysta', plate: 'MH17 AB 1997', status: 'On Trip' },
  { id: 'DRV-002', name: 'Imran Shaikh', phone: '97XXXXXX40', vehicleId: 'ertiga', plate: 'MH17 CD 4521', status: 'Assigned' },
  { id: 'DRV-003', name: 'Prakash Gaikwad', phone: '99XXXXXX08', vehicleId: 'dzire', plate: 'MH17 EF 8830', status: 'Available' },
  { id: 'DRV-004', name: 'Venkat Rao', phone: '90XXXXXX77', vehicleId: 'actraveller', plate: 'MH17 GH 1717', status: 'Available' },
  { id: 'DRV-005', name: 'Rahul Jadhav', phone: '95XXXXXX63', vehicleId: 'tavera', plate: 'MH17 JK 2290', status: 'Unavailable' },
]

export type LeadSource = 'Kiosk' | 'Mobile' | 'WhatsApp' | 'Instagram' | 'Phone' | 'Website' | 'Staff'

export type SampleBooking = {
  id: string
  customer: string
  mobile: string
  service: ServiceId
  pickup: string
  destination: string
  date: string
  time: string
  passengers: number
  vehicleId: VehicleId
  driverId?: string
  fare: number
  advance: number
  paymentStatus: 'Unpaid' | 'Advance paid' | 'Paid in full'
  status: BookingStatus
  source: LeadSource
}

export const sampleBookings: SampleBooking[] = [
  { id: 'JH-2026-000141', customer: 'Lakshmi Narayana', mobile: '98XXXXXX21', service: 'packages', pickup: 'Shirdi', destination: 'Shani Shingnapur + Chh. Sambhajinagar', date: '2026-10-03', time: '06:30', passengers: 6, vehicleId: 'crysta', driverId: 'DRV-001', fare: 6500, advance: 1625, paymentStatus: 'Advance paid', status: 'TRIP STARTED', source: 'Kiosk' },
  { id: 'JH-2026-000142', customer: 'Amit Deshmukh', mobile: '97XXXXXX88', service: 'sightseeing', pickup: 'Shirdi', destination: 'Nashik Darshan', date: '2026-10-04', time: '07:00', passengers: 4, vehicleId: 'dzire', driverId: 'DRV-002', fare: 3500, advance: 875, paymentStatus: 'Advance paid', status: 'DRIVER ASSIGNED', source: 'Mobile' },
  { id: 'JH-2026-000143', customer: 'Priya Sharma', mobile: '99XXXXXX45', service: 'packages', pickup: 'Shirdi', destination: 'Vani Saptashrungi + Nashik', date: '2026-10-04', time: '05:30', passengers: 5, vehicleId: 'ertiga', fare: 6000, advance: 1500, paymentStatus: 'Unpaid', status: 'ADVANCE PENDING', source: 'WhatsApp' },
  { id: 'JH-2026-000144', customer: 'Ravi Teja', mobile: '90XXXXXX10', service: 'packages', pickup: 'Shirdi', destination: 'Bhimashankar', date: '2026-10-05', time: '05:00', passengers: 3, vehicleId: 'dzire', fare: 5000, advance: 1250, paymentStatus: 'Advance paid', status: 'BOOKING CONFIRMED', source: 'Instagram' },
  { id: 'JH-2026-000145', customer: 'Sunita Kulkarni', mobile: '95XXXXXX32', service: 'packages', pickup: 'Shirdi', destination: 'Chh. Sambhajinagar + Nashik (2D/1N)', date: '2026-10-06', time: '06:00', passengers: 6, vehicleId: 'ertiga', fare: 12499, advance: 0, paymentStatus: 'Unpaid', status: 'QUOTATION SENT', source: 'Phone' },
]

export type SampleLead = {
  id: string
  customer: string
  service: ServiceId
  route: string
  date: string
  passengers: number
  status: 'New' | 'Contacted' | 'Quoted' | 'Follow-up' | 'Lost' | 'Won'
  followUp?: string
  source: LeadSource
  receivedAt: string
}

export const sampleLeads: SampleLead[] = [
  { id: 'LD-2026-000311', customer: 'Kiosk visitor', service: 'oneway', route: 'Shirdi → Pune Airport', date: '2026-10-04', passengers: 2, status: 'New', source: 'Kiosk', receivedAt: '09:12' },
  { id: 'LD-2026-000312', customer: 'Meera Iyer', service: 'hotel', route: 'Shirdi · 2 rooms', date: '2026-10-08', passengers: 4, status: 'Follow-up', followUp: 'Today 5:00 PM', source: 'Mobile', receivedAt: '09:47' },
  { id: 'LD-2026-000313', customer: 'Harish Patel', service: 'roundtrip', route: 'Shirdi ⇄ Mumbai T2', date: '2026-10-10', passengers: 6, status: 'Quoted', followUp: 'Tomorrow 11:00 AM', source: 'WhatsApp', receivedAt: '10:20' },
  { id: 'LD-2026-000314', customer: 'Srinivas K.', service: 'railway', route: 'Manmad → Shirdi', date: '2026-10-03', passengers: 3, status: 'Contacted', source: 'Phone', receivedAt: '11:05' },
  { id: 'LD-2026-000315', customer: 'Anjali More', service: 'sightseeing', route: 'Trimbakeshwar', date: '2026-10-05', passengers: 4, status: 'New', source: 'Instagram', receivedAt: '11:38' },
]

export const sampleKiosks = [
  { id: 'KIOSK-01', name: 'Front office — floor kiosk', online: true, lastActive: '2 min ago', currentSession: 'KSK-2026-000214', version: settings.softwareVersion },
  { id: 'KIOSK-02', name: 'Counter tablet', online: false, lastActive: 'Yesterday 8:41 PM', currentSession: '—', version: settings.softwareVersion },
]

export const sampleWeek = [
  { day: 'Sat', enquiries: 31, bookings: 12 },
  { day: 'Sun', enquiries: 44, bookings: 19 },
  { day: 'Mon', enquiries: 22, bookings: 8 },
  { day: 'Tue', enquiries: 19, bookings: 7 },
  { day: 'Wed', enquiries: 25, bookings: 10 },
  { day: 'Thu', enquiries: 28, bookings: 11 },
  { day: 'Fri', enquiries: 37, bookings: 15 },
]
