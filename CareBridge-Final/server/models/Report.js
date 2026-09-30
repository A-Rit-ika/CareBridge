import mongoose from 'mongoose';
const reportSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  clinician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, type: { type: String, default: 'clinical' },
  summary: String, url: String, date: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.model('Report', reportSchema);
