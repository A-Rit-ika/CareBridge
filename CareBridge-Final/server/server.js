import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import checkinRoutes from './routes/checkins.js';
import alertRoutes from './routes/alerts.js';
import careRoutes from './routes/care.js';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Copy .env.example to .env');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/care', careRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
