import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

const LIMITS = [
  ['tempMax', 'Fever above (°F)', 100.4], ['spo2Min', 'Oxygen below (%)', 92],
  ['hrMin', 'Pulse below', 50], ['hrMax', 'Pulse above', 110],
  ['sysMin', 'Systolic BP below', 90], ['sysMax', 'Systolic BP above', 160], ['glucoseMax', 'Blood sugar above', 250]
];

export default function NewPatient() {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: '', age: '', phone: '', village: '', language: 'mr', caregiverName: '', caregiverPhone: '',
    condition: '', dischargeDate: new Date().toISOString().slice(0, 10), followUpDate: '', medicines: '', email: '', password: ''
  });
  const [limits, setLimits] = useState(Object.fromEntries(LIMITS.map(([k, , v]) => [k, v])));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const p = await api('/patients', {
        method: 'POST',
        body: {
          ...f,
          age: f.age ? Number(f.age) : undefined,
          medicines: f.medicines.split('\n').map((m) => m.trim()).filter(Boolean),
          thresholds: Object.fromEntries(Object.entries(limits).map(([k, v]) => [k, Number(v)]))
        }
      });
      nav(`/patients/${p._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="narrow wider">
      <p><Link to="/dashboard">Back to patients</Link></p>
      <h1>Add a discharged patient</h1>
      <form onSubmit={submit} className="stack">
        <h2>Patient</h2>
        <div className="grid2">
          <label>Full name<input value={f.name} onChange={set('name')} required /></label>
          <label>Age<input inputMode="numeric" value={f.age} onChange={set('age')} /></label>
          <label>Village or town<input value={f.village} onChange={set('village')} /></label>
          <label>Phone<input inputMode="tel" value={f.phone} onChange={set('phone')} /></label>
          <label>Caregiver name<input value={f.caregiverName} onChange={set('caregiverName')} /></label>
          <label>Caregiver phone<input inputMode="tel" value={f.caregiverPhone} onChange={set('caregiverPhone')} /></label>
          <label>Language
            <select value={f.language} onChange={set('language')}>
              <option value="mr">Marathi</option><option value="hi">Hindi</option><option value="en">English</option>
            </select>
          </label>
        </div>

        <h2>Care plan</h2>
        <label>Diagnosis or procedure<input value={f.condition} onChange={set('condition')} placeholder="For example: post-cardiac surgery recovery" /></label>
        <div className="grid2">
          <label>Discharge date<input type="date" value={f.dischargeDate} onChange={set('dischargeDate')} /></label>
          <label>Next follow-up<input type="date" value={f.followUpDate} onChange={set('followUpDate')} /></label>
        </div>
        <label>Medicines, one per line<textarea rows="3" value={f.medicines} onChange={set('medicines')} /></label>

        <h2>Alert limits</h2>
        <p className="muted">Defaults are general adult limits. Set them for this patient's condition before saving.</p>
        <div className="grid3">
          {LIMITS.map(([k, label]) => (
            <label key={k}>{label}<input inputMode="decimal" value={limits[k]} onChange={(e) => setLimits({ ...limits, [k]: e.target.value })} /></label>
          ))}
        </div>

        <h2>Patient login</h2>
        <div className="grid2">
          <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
          <label>Password<input type="text" value={f.password} onChange={set('password')} minLength={6} required /></label>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Saving...' : 'Save patient'}</button>
      </form>
    </div>
  );
}
