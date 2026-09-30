import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Patient from './models/Patient.js';
import Checkin from './models/Checkin.js';
import Alert from './models/Alert.js';
import { DEFAULT_THRESHOLDS, assessCheckin } from './utils/riskEngine.js';

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User, Patient, Checkin, Alert].map((m) => m.deleteMany({})));

const hash = (p) => bcrypt.hash(p, 10);
const day = 24 * 3600 * 1000;

const doctor = await User.create({
  name: 'Dr. Mehta', email: 'doctor@carebridge.test', passwordHash: await hash('doctor123'), role: 'clinician'
});

// [temp, spo2, pulse, systolic, diastolic, pain, symptoms, medicinesTaken] - oldest day first
const people = [
  {
    profile: { name: 'Sunita Patil', age: 58, village: 'Velhe', language: 'mr', condition: 'Post-cardiac surgery recovery', caregiverName: 'Anil Patil', medicines: ['Aspirin 75 mg - morning', 'Metoprolol 25 mg - morning and night'] },
    email: 'sunita@carebridge.test',
    rows: [
      [98.4, 97, 76, 128, 82, 3, [], true], [98.6, 97, 78, 130, 84, 3, [], true], [98.8, 96, 80, 126, 80, 2, [], true],
      [99.0, 96, 84, 132, 84, 3, [], true], [99.6, 95, 88, 136, 86, 4, [], true], [100.2, 94, 96, 140, 88, 5, ['wound_discharge'], true],
      [101.0, 93, 104, 146, 90, 6, ['wound_discharge'], false]
    ]
  },
  {
    profile: { name: 'Ramesh Jadhav', age: 64, village: 'Mulshi', language: 'hi', condition: 'Post-hernia repair', caregiverName: 'Seema Jadhav', medicines: ['Paracetamol 500 mg - as needed'] },
    email: 'ramesh@carebridge.test',
    rows: [
      [98.2, 98, 72, 122, 78, 4, [], true], [98.4, 98, 74, 124, 80, 3, [], true], [98.4, 97, 72, 120, 78, 2, [], true],
      [98.6, 98, 70, 118, 76, 2, [], true], [98.4, 98, 72, 122, 78, 1, [], true], [98.6, 98, 74, 120, 80, 1, [], true],
      [98.4, 98, 72, 120, 78, 1, [], true]
    ]
  },
  {
    profile: { name: 'Kavita More', age: 47, village: 'Bhor', language: 'en', condition: 'Post-C-section recovery', caregiverName: 'Vijay More', medicines: ['Iron + folic acid - daily'] },
    email: 'kavita@carebridge.test',
    rows: [
      [98.4, 98, 82, 118, 76, 3, [], true], [98.6, 98, 84, 120, 78, 3, [], true], [98.6, 97, 86, 118, 76, 2, [], true],
      [98.8, 97, 84, 122, 78, 2, [], true], [98.6, 98, 82, 120, 76, 2, [], true], [98.8, 97, 88, 122, 78, 2, [], true],
      [99.0, 96, 96, 100, 64, 3, ['heavy_bleeding', 'dizziness'], true]
    ]
  }
];

for (const p of people) {
  const patient = await Patient.create({
    ...p.profile,
    dischargeDate: new Date(Date.now() - 7 * day),
    followUpDate: new Date(Date.now() + 5 * day),
    thresholds: DEFAULT_THRESHOLDS,
    assignedClinician: doctor._id
  });
  await User.create({
    name: p.profile.name, email: p.email, passwordHash: await hash('patient123'), role: 'patient', patient: patient._id
  });

  for (let i = 0; i < p.rows.length; i++) {
    const [temperature, spo2, heartRate, systolic, diastolic, pain, symptoms, medicinesTaken] = p.rows[i];
    const data = { temperature, spo2, heartRate, systolic, diastolic, pain, symptoms, medicinesTaken };
    const risk = assessCheckin(data, patient);
    const takenAt = new Date(Date.now() - (p.rows.length - 1 - i) * day - 2 * 3600 * 1000);
    const checkin = await Checkin.create({ patient: patient._id, takenAt, ...data, risk });
    if (risk.level !== 'green') {
      await Alert.create({ patient: patient._id, checkin: checkin._id, level: risk.level, reasons: risk.reasons });
    }
    patient.riskLevel = risk.level;
    patient.lastCheckinAt = takenAt;
  }
  await patient.save();
}

console.log('Seeded. Log in with:');
console.log('  Doctor : doctor@carebridge.test  / doctor123');
console.log('  Patient: sunita@carebridge.test  / patient123  (also ramesh@, kavita@)');
await mongoose.disconnect();
