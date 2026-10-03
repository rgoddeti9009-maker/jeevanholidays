# Jeevan Holidays Shirdi — Product Roadmap

1. **Customer surface (done)** — Home, kiosk welcome + language picker, progressive booking flow (place → date → time → passengers → luggage → vehicle → name → mobile → quotation → pay at counter → request status), Jeevan AI chat with voice input/spoken replies and trip planner, QR continuation, WhatsApp hand-off, print/PDF, kiosk idle reset, 4 languages. All business data lives in `src/data/fixtures.ts`.
2. **Remaining customer screens** — `/explore` (destination explorer), `/packages`, `/trip` (My Trip timeline). Links already point to them.
3. **Data model** — Netlify Database + Drizzle schema for the 18 tables (customers, leads, quotations, bookings, rates, packages, destinations, vehicles, drivers, payments, invoices, settings, kiosk_sessions, audit_log, …); seed from fixtures; server functions replace fixture imports; server-issued sequential IDs (QT-/JH-/KSK-); duplicate protection; automatic lead creation for custom fare requests.
4. **Admin CRM** — Netlify Identity with OWNER/ADMIN/STAFF/DRIVER roles; dashboard, bookings/trip management, driver assignment, rates & packages editing, kiosk management, audit log, reports.
5. **AI** — LLM via AI Gateway with tools that read active rates only; admin AI assistant with confirmation for financial actions.
6. **Integrations** — payment gateway/UPI (webhook-confirmed), WhatsApp Business API, Google Sheets sync, SMS/email notifications, maps distance fares.
7. **Analytics & hardening** — kiosk analytics, PWA offline shell, thermal-printer layout.
