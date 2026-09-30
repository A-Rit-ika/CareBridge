import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    clientId: String, // generated on the phone so offline re-sends never create duplicates
    takenAt: { type: Date, default: Date.now },
    temperature: Number, // Fahrenheit
    spo2: Number,
    heartRate: Number,
    systolic: Number,
    diastolic: Number,
    glucose: Number,
    pain: Number,
    symptoms: [String],
    medicinesTaken: Boolean,
    note: String,
    enteredBy: { type: String, enum: ['self', 'caregiver', 'health-worker'], default: 'self' },
    risk: {
      level: { type: String, enum: ['green', 'amber', 'red'] },
      score: Number,
      reasons: [String]
    }
  },
  { timestamps: true }
);

checkinSchema.index({ patient: 1, clientId: 1 });

export default mongoose.model('Checkin', checkinSchema);
