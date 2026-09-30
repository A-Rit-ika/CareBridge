import mongoose from 'mongoose';
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: Date, required: true }, type: { type: String, enum: ['video','hospital','phone','follow-up'], default: 'video' },
  title: { type: String, default: 'Follow-up consultation' }, status: { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' }, note: String
}, { timestamps: true });
export default mongoose.model('Appointment', appointmentSchema);
