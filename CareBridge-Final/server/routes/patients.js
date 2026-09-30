import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getAccessiblePatient } from '../utils/access.js';
import { DEFAULT_THRESHOLDS } from '../utils/riskEngine.js';

const router = Router();
router.use(requireAuth);

const PROFILE_FIELDS = [
  'name', 'age', 'phone', 'village', 'language', 'caregiverName', 'caregiverPhone',
  'condition', 'dischargeDate', 'followUpDate'
];
const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined && obj[k] !== '').map((k) => [k, obj[k]]));
const ORDER = { red: 0, amber: 1, green: 2 };

// Clinician: register a discharged patient, their care plan, and their login
router.post('/', requireRole('clinician'), async (req, res, next) => {
  try {
    const { email, password, medicines = [], thresholds = {} } = req.body;
    if (!req.body.name || !email || !password) {
      return res.status(400).json({ message: 'Name, login email and password are required' });
    }
    if (await User.findOne({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({ message: 'That email is already in use' });
    }
    const patient = await Patient.create({
      ...pick(req.body, PROFILE_FIELDS),
      medicines,
      thresholds: { ...DEFAULT_THRESHOLDS, ...thresholds },
      assignedClinician: req.user.id
    });
    await User.create({
      name: patient.name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: 'patient',
      patient: patient._id
    });
    res.status(201).json(patient);
  } catch (e) {
    next(e);
  }
});

// Clinician: my patients, sickest first
router.get('/', requireRole('clinician'), async (req, res, next) => {
  try {
    const patients = await Patient.find({ assignedClinician: req.user.id }).lean();
    patients.sort(
      (a, b) =>
        (ORDER[a.riskLevel] ?? 3) - (ORDER[b.riskLevel] ?? 3) ||
        new Date(b.lastCheckinAt || 0) - new Date(a.lastCheckinAt || 0)
    );
    res.json(patients);
  } catch (e) {
    next(e);
  }
});

// Patient: my own record (must be declared before '/:id')
router.get('/me', requireRole('patient'), async (req, res, next) => {
  try {
    res.json(await Patient.findById(req.user.patient));
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const patient = await getAccessiblePatient(req, req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', requireRole('clinician'), async (req, res, next) => {
  try {
    const patient = await getAccessiblePatient(req, req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    Object.assign(patient, pick(req.body, ['followUpDate', 'condition', 'medicines']));
    if (req.body.thresholds) patient.thresholds = { ...patient.thresholds?.toObject?.(), ...req.body.thresholds };
    await patient.save();
    res.json(patient);
  } catch (e) {
    next(e);
  }
});

export default router;
