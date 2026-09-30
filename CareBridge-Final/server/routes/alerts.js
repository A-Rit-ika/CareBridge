import { Router } from 'express';
import mongoose from 'mongoose';
import Alert from '../models/Alert.js';
import Patient from '../models/Patient.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// Patient asks for a video consultation instead of travelling
router.post('/teleconsult', requireRole('patient'), async (req, res, next) => {
  try {
    const open = await Alert.findOne({ patient: req.user.patient, type: 'teleconsult', status: 'open' });
    if (open) return res.json(open);
    const alert = await Alert.create({
      patient: req.user.patient,
      type: 'teleconsult',
      level: 'amber',
      reasons: ['Patient asked for a video consultation']
    });
    res.status(201).json(alert);
  } catch (e) {
    next(e);
  }
});

// Clinician: alerts for my patients (?status=open&patient=<id>)
router.get('/', requireRole('clinician'), async (req, res, next) => {
  try {
    const mine = await Patient.find({ assignedClinician: req.user.id }).select('_id');
    const ids = mine.map((p) => String(p._id));
    const query = { patient: { $in: ids } };
    if (req.query.status) query.status = req.query.status;
    if (req.query.patient) {
      if (!ids.includes(String(req.query.patient))) return res.json([]);
      query.patient = req.query.patient;
    }
    const alerts = await Alert.find(query).sort({ createdAt: -1 }).limit(100).populate('patient', 'name village riskLevel').lean();
    alerts.sort((a, b) => (a.level === b.level ? 0 : a.level === 'red' ? -1 : 1));
    res.json(alerts);
  } catch (e) {
    next(e);
  }
});

// Clinician: decide what happens next (stay home / video call / come in)
router.patch('/:id/review', requireRole('clinician'), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Alert not found' });
    const { decision, note = '' } = req.body;
    if (!['remote', 'teleconsult', 'visit'].includes(decision)) {
      return res.status(400).json({ message: 'Choose remote care, video call, or hospital visit' });
    }
    const alert = await Alert.findById(req.params.id);
    const patient = alert && (await Patient.findById(alert.patient));
    if (!alert || String(patient?.assignedClinician) !== req.user.id) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    Object.assign(alert, { status: 'reviewed', decision, note, reviewedBy: req.user.id, reviewedAt: new Date() });
    await alert.save();
    patient.latestAdvice = { decision, note, at: new Date() };
    await patient.save();
    res.json(alert);
  } catch (e) {
    next(e);
  }
});

export default router;
