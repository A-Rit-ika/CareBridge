import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    checkin: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkin' },
    type: { type: String, enum: ['risk', 'teleconsult'], default: 'risk' },
    level: { type: String, enum: ['amber', 'red'], required: true },
    reasons: [String],
    status: { type: String, enum: ['open', 'reviewed'], default: 'open' },
    decision: { type: String, enum: ['remote', 'teleconsult', 'visit'] },
    note: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model('Alert', alertSchema);
