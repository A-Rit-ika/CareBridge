import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: Number,
    phone: String,
    village: String,
    language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    caregiverName: String,
    caregiverPhone: String,
    condition: { type: String, default: 'Post-discharge recovery' },
    dischargeDate: Date,
    followUpDate: Date,
    medicines: [String],
    // Clinician-approved limits used by the alert engine
    thresholds: {
      tempMax: Number, spo2Min: Number, hrMin: Number, hrMax: Number,
      sysMin: Number, sysMax: Number, glucoseMax: Number
    },
    assignedClinician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    riskLevel: { type: String, enum: ['green', 'amber', 'red'] },
    lastCheckinAt: Date,
    latestAdvice: { decision: String, note: String, at: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
