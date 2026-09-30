import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    res.json({
      token: signToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, patient: user.patient || null }
    });
  } catch (e) {
    next(e);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
