import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: String, body: String, type: { type: String, default: 'general' }, readAt: Date
}, { timestamps: true });
export default mongoose.model('Notification', notificationSchema);
