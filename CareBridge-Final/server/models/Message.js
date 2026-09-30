import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  text: { type: String, required: true, maxlength: 1000 }, readAt: Date
}, { timestamps: true });
export default mongoose.model('Message', messageSchema);
