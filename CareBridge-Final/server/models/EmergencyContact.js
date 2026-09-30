import mongoose from 'mongoose';
const emergencySchema = new mongoose.Schema({ patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true }, contacts: [{ name: String, relationship: String, phone: String }] }, { timestamps: true });
export default mongoose.model('EmergencyContact', emergencySchema);
