import mongoose from 'mongoose';
import Patient from '../models/Patient.js';

// Returns the patient only if the signed-in user may see them:
// a patient sees themself, a clinician sees patients assigned to them.
export async function getAccessiblePatient(req, id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const patient = await Patient.findById(id);
  if (!patient) return null;
  if (req.user.role === 'patient') return req.user.patient === String(patient._id) ? patient : null;
  return String(patient.assignedClinician) === req.user.id ? patient : null;
}
