import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['patient', 'clinician'], required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' } // only for role=patient
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
