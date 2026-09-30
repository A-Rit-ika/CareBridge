# CareBridge

CareBridge is a full-stack **post-discharge remote patient monitoring and care coordination platform** built with the MERN stack. It helps patients complete daily health check-ins, track recovery information, communicate with their care team, view appointments and reports, and maintain emergency contacts. Clinicians can monitor assigned patients, review risk alerts, manage care plans, schedule appointments, communicate with patients, and view basic care analytics.

> **Important:** CareBridge is an educational/prototype healthcare application. Its risk engine is decision-support only and is not a medical diagnosis or a replacement for professional clinical judgment. Do not use the project with real patient data without appropriate security, privacy, consent, clinical validation, and regulatory/compliance controls.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Patient Portal](#patient-portal)
- [Clinician Portal](#clinician-portal)
- [Risk and Alert Engine](#risk-and-alert-engine)
- [Offline Check-ins](#offline-check-ins)
- [Authentication and Access Control](#authentication-and-access-control)
- [Database Models](#database-models)
- [API Reference](#api-reference)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Demo Accounts](#demo-accounts)
- [Seeding Demo Data](#seeding-demo-data)
- [Testing](#testing)
- [Production Build](#production-build)
- [How the Main Workflow Works](#how-the-main-workflow-works)
- [Security Considerations](#security-considerations)
- [Known Limitations](#known-limitations)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

### Patient features

- Modern responsive patient portal
- Personalized recovery overview
- Daily health check-ins
- Temperature, oxygen saturation, pulse, blood pressure, glucose, pain, symptoms, and medication adherence fields
- Automatic risk assessment after a check-in
- Health and recovery trends
- Medication list and adherence information
- Appointment management
- Care-team messaging
- Reports and clinical document references
- Care-plan information
- Emergency contact management
- Profile and personal information
- English, Hindi, and Marathi language support in the UI structure
- Offline check-in queueing when the device loses connectivity
- Automatic retry of queued check-ins when connectivity returns

### Clinician features

- Clinician dashboard
- Patient list prioritized by current risk level and recent check-in activity
- Patient search/management interface
- Add new discharged patients
- Individual patient detail view
- Risk and alert center
- Alert review workflow
- Remote-care / video-consult / hospital-visit decisions
- Patient care plans
- Appointments
- Patient messaging
- Clinical reports
- Emergency information
- Basic monitoring analytics
- Clinician profile

### Platform features

- React single-page application
- Express REST API
- MongoDB persistence with Mongoose
- JWT-based authentication
- Role-based access control for patients and clinicians
- Password hashing with bcryptjs
- Vite development server with API proxy
- Seed script with realistic demo recovery data
- Automated risk scoring and alert creation

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Routing | React Router 6 |
| Build tool | Vite 5 |
| Backend | Node.js + Express 4 |
| Database | MongoDB |
| ODM | Mongoose 8 |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcryptjs |
| API format | REST / JSON |
| Development runner | Nodemon |
| Concurrent development | concurrently |
| Styling | Custom CSS |

---

## Application Architecture

```text
                    ┌──────────────────────────┐
                    │       CareBridge UI       │
                    │     React + Vite SPA      │
                    │        Port 5173          │
                    └────────────┬─────────────┘
                                 │
                         /api/* requests
                                 │
                    ┌────────────▼─────────────┐
                    │      Express API         │
                    │        Port 5000         │
                    │                          │
                    │ Auth / Patients /        │
                    │ Check-ins / Alerts / Care│
                    └────────────┬─────────────┘
                                 │
                         Mongoose connection
                                 │
                    ┌────────────▼─────────────┐
                    │         MongoDB          │
                    │   CareBridge database    │
                    └──────────────────────────┘
```

During development, Vite proxies `/api` requests to `http://localhost:5000`, so the frontend can call paths such as `/api/auth/login` without hardcoding the backend host.

---

## Project Structure

```text
CareBridge-Final/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Icon.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── MiniChart.jsx
│   │   │   ├── PortalShell.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   └── Trend.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PatientOverview.jsx
│   │   │   ├── PatientHome.jsx
│   │   │   ├── Health.jsx
│   │   │   ├── Medications.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Messages.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ClinicianDashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── NewPatient.jsx
│   │   │   ├── PatientDetail.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── ClinicianProfile.jsx
│   │   │
│   │   ├── api.js
│   │   ├── auth.jsx
│   │   ├── i18n.js
│   │   ├── offlineQueue.js
│   │   ├── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Checkin.js
│   │   ├── Alert.js
│   │   ├── Appointment.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Report.js
│   │   ├── CarePlan.js
│   │   └── EmergencyContact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── checkins.js
│   │   ├── alerts.js
│   │   └── care.js
│   ├── utils/
│   │   ├── access.js
│   │   ├── riskEngine.js
│   │   └── riskEngine.test.js
│   ├── .env.example
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
```

---

## Patient Portal

The patient experience is designed around a simple recovery workflow.

### Main pages

| Route | Page | Purpose |
|---|---|---|
| `/me` | Patient Overview | Recovery summary and current health status |
| `/checkin` | Daily Check-in | Enter daily vitals, symptoms, pain, and medication status |
| `/health` | Health | Review health measurements and trends |
| `/medications` | Medications | View prescribed medicines and adherence information |
| `/appointments` | Appointments | View and manage care appointments |
| `/messages` | Messages | Communicate with the assigned care team |
| `/reports` | Reports | View clinical reports made available by the clinician |
| `/profile` | Profile | Manage profile and emergency information |

Patients can only access their own patient record through the protected API.

---

## Clinician Portal

The clinician experience is designed for remote monitoring and follow-up.

### Main pages

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Clinician Dashboard | Overview of assigned patients and risk levels |
| `/patients` | Patients | Browse and manage assigned patients |
| `/patients/new` | New Patient | Register a discharged patient and create their login |
| `/patients/:id` | Patient Detail | Review an individual patient's recovery information |
| `/alerts` | Alerts | Review amber/red alerts and decide the next action |
| `/analytics` | Analytics | View aggregate monitoring and adherence metrics |
| `/profile` | Clinician Profile | Clinician account area |

Patients are ordered using the risk priority:

```text
automatically prioritized by:
RED → AMBER → GREEN
```

Within the same risk level, more recently active patients are prioritized.

---

## Risk and Alert Engine

CareBridge contains a rules-based early-warning engine in:

```text
server/utils/riskEngine.js
```

The engine evaluates check-in values against clinician-approved thresholds and returns:

```js
{
  level: 'green' | 'amber' | 'red',
  score: Number,
  reasons: String[]
}
```

### Default thresholds

| Measurement | Default threshold |
|---|---:|
| Maximum temperature | 100.4 °F |
| Minimum SpO2 | 92% |
| Minimum heart rate | 50/min |
| Maximum heart rate | 110/min |
| Minimum systolic BP | 90 mmHg |
| Maximum systolic BP | 160 mmHg |
| Maximum glucose | 250 |

These defaults can be overridden for an individual patient by the clinician.

### Red-flag symptoms

The engine treats these as high-priority symptoms:

- Chest pain
- Trouble breathing
- Fainting
- Heavy bleeding
- Confusion

Other warning symptoms include:

- Wound discharge/redness
- Vomiting
- Swelling
- Dizziness
- Cough

### Risk levels

**Green**

No significant warning detected by the configured rules.

**Amber**

The check-in contains concerning measurements or symptoms that warrant review.

**Red**

The check-in contains a red-flag symptom, a severe individual measurement, or a sufficiently high combined score.

Every amber/red result is intended for **human clinical review**.

---

## Offline Check-ins

The frontend includes an offline queue in:

```text
client/src/offlineQueue.js
```

If a patient loses internet access while completing a check-in:

1. The application detects the offline state.
2. The check-in is stored locally on the device.
3. The UI displays an offline notification.
4. When connectivity returns, queued submissions can be sent to the backend.
5. A client-generated identifier helps prevent duplicate submissions when an offline check-in is retried.

This is intended for prototype/demo use and should be strengthened before production deployment.

---

## Authentication and Access Control

CareBridge uses JWT authentication.

### Login flow

1. User submits email and password.
2. Express looks up the user in MongoDB.
3. Password is checked using `bcryptjs`.
4. A JWT is issued with the user's ID, role, and patient association.
5. The frontend stores the token locally and sends it using:

```http
Authorization: Bearer <token>
```

### Roles

There are currently two roles:

- `patient`
- `clinician`

Protected backend routes use middleware such as:

```js
requireAuth
requireRole('patient')
requireRole('clinician')
```

Patient/clinician access is also checked against the assigned patient relationship before protected patient data is returned.

---

## Database Models

### User

Stores authentication and account information.

Important fields:

- `name`
- `email`
- `passwordHash`
- `role`
- `patient`

### Patient

Stores recovery profile and monitoring information.

Important fields:

- `name`
- `age`
- `phone`
- `village`
- `language`
- `caregiverName`
- `caregiverPhone`
- `condition`
- `dischargeDate`
- `followUpDate`
- `medicines`
- `thresholds`
- `assignedClinician`
- `riskLevel`
- `lastCheckinAt`
- `latestAdvice`

### Checkin

Stores daily health measurements.

Fields include:

- Temperature
- SpO2
- Heart rate
- Systolic/diastolic blood pressure
- Glucose
- Pain
- Symptoms
- Medication adherence
- Notes
- Entry source
- Risk result

### Alert

Stores risk or teleconsultation requests.

Possible alert levels:

- `amber`
- `red`

Possible clinician decisions:

- `remote`
- `teleconsult`
- `visit`

### Appointment

Stores scheduled care appointments such as video consultations, hospital visits, phone calls, and follow-ups.

### Message

Stores patient/clinician communication.

### Notification

Stores user notifications such as appointment, message, and report notifications.

### Report

Stores clinician-created clinical report references and summaries.

### CarePlan

Stores patient goals, instructions, and next review date.

### EmergencyContact

Stores emergency/caregiver contact information for a patient.

---

## API Reference

The Express server is mounted under:

```text
/api
```

Authentication is required for the protected endpoints.

### Health check

```http
GET /api/health
```

Returns:

```json
{
  "ok": true
}
```

### Authentication

```http
POST /api/auth/login
GET  /api/auth/me
```

Login body:

```json
{
  "email": "doctor@carebridge.test",
  "password": "doctor123"
}
```

### Patients

```http
POST  /api/patients
GET   /api/patients
GET   /api/patients/me
GET   /api/patients/:id
PATCH /api/patients/:id
```

### Check-ins

```http
POST /api/checkins
GET  /api/checkins/me
GET  /api/checkins/:patientId
```

The exact check-in request fields are based on the `Checkin` model and include temperature, SpO2, heart rate, blood pressure, glucose, pain, symptoms, medication status, notes, and entry source.

### Alerts

```http
POST  /api/alerts/teleconsult
GET   /api/alerts
PATCH /api/alerts/:id/review
```

A clinician review uses one of:

```json
{
  "decision": "remote",
  "note": "Continue home monitoring and repeat check-in."
}
```

Valid decisions:

```text
remote
teleconsult
visit
```

### Care coordination

Appointments:

```http
GET   /api/care/appointments
POST  /api/care/appointments
PATCH /api/care/appointments/:id
```

Messages:

```http
GET  /api/care/messages
POST /api/care/messages
```

Notifications:

```http
GET   /api/care/notifications
PATCH /api/care/notifications/:id/read
```

Reports:

```http
GET  /api/care/reports
POST /api/care/reports
```

Care plans:

```http
GET /api/care/care-plan/:patientId
PUT /api/care/care-plan/:patientId
```

Emergency contacts:

```http
GET /api/care/emergency
PUT /api/care/emergency
```

Clinician analytics:

```http
GET /api/care/analytics
```

---

## Prerequisites

Install the following before running CareBridge:

- Node.js 18+ recommended
- npm
- MongoDB 6+ recommended, or a MongoDB Atlas cluster
- Git (optional, for source-control workflows)

Check your Node/npm installation:

```bash
node -v
npm -v
```

---

## Installation

### 1. Extract or clone the project

```bash
git clone <your-repository-url>
cd CareBridge-Final
```

If you received the ZIP, simply extract it and open the extracted folder in VS Code.

### 2. Install all dependencies

From the project root:

```bash
npm run install-all
```

This installs:

- Root development dependencies
- Server dependencies
- Client dependencies

Alternatively, install each package separately:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

---

## Environment Configuration

Go to:

```text
server/
```

Copy the example environment file:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

The default configuration is:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carebridge
JWT_SECRET=replace_this_with_a_long_random_string
```

### MongoDB Atlas

For Atlas, replace `MONGO_URI` with your Atlas connection string, for example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/carebridge
```

Use a strong private value for `JWT_SECRET`.

Never commit `.env` to Git.

---

## Running the Project

### Recommended: run frontend and backend together

From the root folder:

```bash
npm run dev
```

This starts:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### Run backend separately

```bash
cd server
npm run dev
```

### Run frontend separately

In another terminal:

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Demo Accounts

The seed script creates one clinician and three patients.

### Clinician

```text
Email:    doctor@carebridge.test
Password: doctor123
```

### Patient 1

```text
Email:    sunita@carebridge.test
Password: patient123
```

### Patient 2

```text
Email:    ramesh@carebridge.test
Password: patient123
```

### Patient 3

```text
Email:    kavita@carebridge.test
Password: patient123
```

These credentials are for local/demo use only.

---

## Seeding Demo Data

Make sure MongoDB is running and `server/.env` is configured first.

From the project root:

```bash
npm run seed
```

The seed script:

1. Connects to MongoDB.
2. Clears existing demo `User`, `Patient`, `Checkin`, and `Alert` documents.
3. Creates the demo clinician.
4. Creates three demo patients.
5. Generates seven days of recovery check-ins for each patient.
6. Runs every check-in through the risk engine.
7. Creates alerts for non-green check-ins.
8. Updates each patient's current risk level.

> **Warning:** The seed script deletes existing documents from the collections it resets. Do not run it against a database containing data you need to keep.

---

## Testing

The backend includes a focused test for the risk engine.

Run:

```bash
cd server
npm test
```

The test file is:

```text
server/utils/riskEngine.test.js
```

The test suite validates important risk classifications and scoring behavior.

---

## Production Build

Build the React frontend:

```bash
cd client
npm run build
```

The production frontend is generated in:

```text
client/dist/
```

Preview the production build locally:

```bash
npm run preview
```

The current project keeps the frontend and Express API as separate applications. A production deployment can host the Vite-built frontend on a static hosting service and the Express API on a Node-compatible server, or the Express server can be extended to serve the frontend build directly.

---

## How the Main Workflow Works

### Patient check-in workflow

```text
Patient signs in
       ↓
Opens Daily Check-in
       ↓
Enters vitals + symptoms + medication status
       ↓
Frontend sends check-in to Express API
       ↓
Risk engine evaluates the values
       ↓
Green / Amber / Red result
       ↓
Check-in saved in MongoDB
       ↓
If Amber/Red → alert created
       ↓
Clinician reviews the alert
```

### Clinician response workflow

```text
Clinician opens dashboard
       ↓
Patients prioritized by risk
       ↓
Clinician opens Alerts
       ↓
Reviews patient measurements/reasons
       ↓
Chooses:
  • Remote care
  • Video consultation
  • Hospital visit
       ↓
Decision + note saved
       ↓
Patient's latest advice is updated
```

### Appointment workflow

```text
Patient/clinician creates appointment
       ↓
Appointment stored in MongoDB
       ↓
Relevant notification created
       ↓
Appointment appears in portal
       ↓
Status/date/note can be updated
```

### Messaging workflow

```text
Patient ↔ Assigned clinician
          ↓
Message stored
          ↓
Recipient notification created
```

---

## Security Considerations

The project includes several baseline security mechanisms:

- Password hashing with bcryptjs
- JWT authentication
- Protected API routes
- Patient/clinician role checks
- Patient access validation
- `.env` exclusion through `.gitignore`
- MongoDB models with schema validation
- Request body size limit on Express JSON requests
- No credentials hardcoded into the frontend

However, this project is **not production-ready for real medical data**.

Before a real deployment, consider implementing at minimum:

- HTTPS/TLS everywhere
- Secure, preferably HTTP-only cookie-based session/token strategy
- Short-lived access tokens and token rotation
- Strong password policies
- Multi-factor authentication
- Account lockout/rate limiting
- Comprehensive request validation
- CSRF protection where applicable
- Security headers
- Audit logging
- Encryption at rest
- Encrypted backups
- Fine-grained authorization
- Secure file upload handling
- Malware scanning for uploaded documents
- Database access restrictions
- Secret management through a production secret manager
- Monitoring and incident response
- Privacy/consent workflows
- Data retention and deletion policies
- Appropriate healthcare/legal/regulatory review

Do not treat this README or the application code as evidence of HIPAA, GDPR, DPDP, or any other regulatory compliance.

---

## Known Limitations

The current implementation is a strong academic/prototype foundation but intentionally remains lightweight.

### Current limitations include

- No real medical-device integration
- No live wearable/device data ingestion
- No production-grade file storage for reports
- Report `url` values are references rather than a complete secure upload system
- No real video consultation provider is integrated in this upgraded build
- No clinician-to-clinician collaboration workflow
- No advanced scheduling conflict engine
- No real-time WebSocket messaging
- No email/SMS/push notification provider
- No comprehensive audit trail
- No automated clinical escalation service
- Risk thresholds are rules-based and must be clinically validated before real use
- Offline data is stored locally and requires additional hardening for sensitive information
- Frontend authentication state currently uses browser local storage

---

## Future Enhancements

Potential next steps include:

1. **Real-time communication**
   - WebSockets/Socket.IO
   - Typing indicators
   - Read receipts
   - Live clinician alerts

2. **Telemedicine**
   - Jitsi, WebRTC, or another approved video provider
   - Secure consultation rooms
   - Appointment reminders

3. **Advanced analytics**
   - Long-term vital trends
   - Adherence charts
   - Population-level clinician dashboards
   - Exportable reports

4. **Notifications**
   - Email
   - SMS
   - Push notifications
   - Escalation workflows

5. **Caregiver access**
   - Dedicated caregiver accounts
   - Permission-based patient access
   - Caregiver notifications

6. **Document management**
   - Secure report upload
   - PDF/image preview
   - Access controls
   - Virus scanning

7. **Clinical interoperability**
   - FHIR-compatible data exchange
   - Hospital/EHR integration
   - Device and wearable integrations

8. **Production security**
   - MFA
   - Audit logs
   - Rate limiting
   - Secure cookies
   - Advanced authorization

---

## Troubleshooting

### MongoDB connection failed

Check that MongoDB is running and that `server/.env` contains the correct `MONGO_URI`.

For local MongoDB:

```env
MONGO_URI=mongodb://127.0.0.1:27017/carebridge
```

### JWT_SECRET error

If the server reports:

```text
JWT_SECRET is missing
```

create `server/.env` from `.env.example` and set `JWT_SECRET`.

### Port 5000 already in use

Change:

```env
PORT=5000
```

to another available port, then update the Vite proxy in `client/vite.config.js` to point to the same backend port.

### Port 5173 already in use

Vite may select another port, or you can configure the frontend port in `client/vite.config.js`.

### Frontend cannot reach the API

Make sure both servers are running:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

The frontend expects `/api` requests to be proxied to the Express server.

### Seed data does not appear

Make sure MongoDB is connected, then run:

```bash
npm run seed
```

After seeding, restart the application and log in using one of the demo accounts.

---

## License

No open-source license is currently declared in the repository. If this project is published or distributed, add an appropriate `LICENSE` file and update this section with the selected license and usage terms.

---

## Project Purpose

CareBridge demonstrates how a modern full-stack web application can combine:

- React-based patient and clinician portals
- REST APIs
- MongoDB data persistence
- JWT authentication
- Role-based authorization
- Offline-first check-in concepts
- Rule-based health-risk decision support
- Alerts and care coordination
- Appointment and messaging workflows
- Responsive healthcare-oriented UI

It is intended primarily as a **learning, academic, portfolio, and prototype project** demonstrating full-stack development and remote patient monitoring concepts.
