import mongoose from 'mongoose';
const carePlanSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
  clinician: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goals: [String], instructions: String, nextReview: Date, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
export default mongoose.model('CarePlan', carePlanSchema);
