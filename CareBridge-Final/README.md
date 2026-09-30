# CareBridge — Remote Patient Monitoring

CareBridge is a MERN/Vite prototype for post-discharge remote monitoring. It connects patients and care teams through daily check-ins, rules-based risk alerts, appointments, messages, reports and care-plan workflows.

> **Clinical safety:** CareBridge is a decision-support prototype, not a diagnostic or emergency-response system. Thresholds and patient-facing decisions must be reviewed by an appropriately qualified clinician. Do not use real patient data without appropriate consent, security, privacy and regulatory controls.

## What was upgraded

### Patient workspace
- New responsive dashboard and health overview
- Daily check-in with existing offline queue preserved
- Health trends for oxygen, pulse and temperature
- Medication checklist
- Appointment requests and appointment status
- Care-team messaging
- Reports area
- Profile and emergency-contact view
- English / Hindi / Marathi check-in language support

### Clinician workspace
- Prioritized dashboard with patient and alert metrics
- Searchable patient roster
- Alert center with remote / video / hospital decisions
- Patient detail page with trends and history
- Appointment coordination
- Care-team messaging
- 30-day operational analytics
- Clinician profile and safety guidance

### Backend APIs added
All new APIs are under `/api/care` and use the existing JWT authentication/RBAC layer.

- `GET/POST /api/care/appointments`
- `PATCH /api/care/appointments/:id`
- `GET/POST /api/care/messages`
- `GET/PATCH /api/care/notifications...`
- `GET/POST /api/care/reports`
- `GET/PUT /api/care/care-plan/:patientId`
- `GET/PUT /api/care/emergency`
- `GET /api/care/analytics`

New MongoDB models include appointments, messages, notifications, reports, care plans and emergency contacts.

## Run locally

### 1. Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 2. Configure the server

Copy `server/.env.example` to `server/.env` and set:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carebridge
JWT_SECRET=replace_this_with_a_long_random_string
```

### 3. Install dependencies

From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 4. Seed demo data

```bash
npm run seed
```

Demo accounts:

- Clinician: `doctor@carebridge.test` / `doctor123`
- Patient: `sunita@carebridge.test` / `patient123`
- Patient: `ramesh@carebridge.test` / `patient123`
- Patient: `kavita@carebridge.test` / `patient123`

### 5. Start the app

```bash
npm run dev
```

The Vite client runs on `http://localhost:5173` and proxies `/api` requests to the Express server on port `5000`.

## Validation performed

- JavaScript/JSX parsing checked across the application source
- Existing risk-engine unit tests pass
- Server route syntax checked

The supplied ZIP contained Windows-native `node_modules`. Those modules were excluded from the final deliverable so dependencies can be installed correctly for the target operating system.
