import { Router } from 'express';
import Patient from '../models/Patient.js';
import Checkin from '../models/Checkin.js';
import Alert from '../models/Alert.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAccessiblePatient } from '../utils/access.js';
import { assessCheckin } from '../utils/riskEngine.js';

const router = Router();
router.use(requireAuth);

const num = (v) => {
  if (v === '' || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Patient / caregiver submits a daily check-in (safe to re-send: clientId de-duplicates)
router.post('/', requireRole('patient'), async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.patient);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const b = req.body;
    if (b.clientId) {
      const existing = await Checkin.findOne({ patient: patient._id, clientId: b.clientId });
      if (existing) return res.json(existing);
    }

    const takenAt = b.takenAt && !Number.isNaN(Date.parse(b.takenAt)) ? new Date(b.takenAt) : new Date();
    const data = {
      patient: patient._id,
      clientId: b.clientId,
      takenAt: takenAt > new Date() ? new Date() : takenAt,
      temperature: num(b.temperature),
      spo2: num(b.spo2),
      heartRate: num(b.heartRate),
      systolic: num(b.systolic),
      diastolic: num(b.diastolic),
      glucose: num(b.glucose),
      pain: num(b.pain),
      symptoms: Array.isArray(b.symptoms) ? b.symptoms : [],
      medicinesTaken: typeof b.medicinesTaken === 'boolean' ? b.medicinesTaken : undefined,
      note: (b.note || '').slice(0, 500),
      enteredBy: ['self', 'caregiver', 'health-worker'].includes(b.enteredBy) ? b.enteredBy : 'self'
    };

    const risk = assessCheckin(data, patient);
    const checkin = await Checkin.create({ ...data, risk });

    // A late-arriving offline entry must not overwrite a newer status
    if (!patient.lastCheckinAt || checkin.takenAt >= patient.lastCheckinAt) {
      patient.riskLevel = risk.level;
      patient.lastCheckinAt = checkin.takenAt;
      await patient.save();
    }

    if (risk.level !== 'green') {
      await Alert.create({ patient: patient._id, checkin: checkin._id, level: risk.level, reasons: risk.reasons });
    }
    res.status(201).json(checkin);
  } catch (e) {
    next(e);
  }
});

// History for one patient (patient themself or their clinician)
router.get('/patient/:id', async (req, res, next) => {
  try {
    const patient = await getAccessiblePatient(req, req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const items = await Checkin.find({ patient: patient._id }).sort({ takenAt: -1 }).limit(30);
    res.json(items);
  } catch (e) {
    next(e);
  }
});

export default router;
