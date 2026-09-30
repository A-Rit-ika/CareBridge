import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { enqueue, flushQueue, readQueue } from '../offlineQueue.js';
import { STRINGS, SYMPTOM_KEYS, RED_FLAGS } from '../i18n.js';
import { fmt, fmtDate, newId, roomUrl } from '../utils.js';
import RiskBadge from '../components/RiskBadge.jsx';
import PortalShell from '../components/PortalShell.jsx';

const blank = {
  temperature: '', spo2: '', heartRate: '', systolic: '', diastolic: '', glucose: '',
  pain: 0, symptoms: [], medicinesTaken: true, note: '', enteredBy: 'self'
};

export default function PatientHome() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState(localStorage.getItem('cb_lang') || 'en');
  const t = STRINGS[lang];
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(readQueue().length);
  const [busy, setBusy] = useState(false);
  const [callAsked, setCallAsked] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = await api('/patients/me');
      setPatient(p);
      setHistory(await api(`/checkins/patient/${p._id}`));
      if (!localStorage.getItem('cb_lang') && p.language) setLang(p.language);
    } catch { /* offline: keep what is on screen */ }
  }, []);

  const sync = useCallback(async () => {
    const left = await flushQueue();
    setPending(left);
    if (left === 0) load();
  }, [load]);

  useEffect(() => {
    load();
    if (readQueue().length) sync();
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, [load, sync]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const toggleSymptom = (k) =>
    setForm({ ...form, symptoms: form.symptoms.includes(k) ? form.symptoms.filter((s) => s !== k) : [...form.symptoms, k] });
  const emergency = form.symptoms.some((s) => RED_FLAGS.includes(s));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus('');
    enqueue({ ...form, clientId: newId(), takenAt: new Date().toISOString() });
    const left = await flushQueue();
    setPending(left);
    setStatus(left ? 'offline' : 'sent');
    setForm(blank);
    setBusy(false);
    if (!left) load();
  }

  async function askForCall() {
    try { await api('/alerts/teleconsult', { method: 'POST' }); setCallAsked(true); } catch { /* needs internet */ }
  }

  const latest = history[0];
  const advice = patient?.latestAdvice;

  return (
    <PortalShell title="Daily check-in" eyebrow="TODAY'S RECOVERY"><div className="patient">
      <div className="row between">
        <h1>{t.hello}, {user.name.split(' ')[0]}</h1>
        <select aria-label="Language" value={lang} onChange={(e) => { setLang(e.target.value); localStorage.setItem('cb_lang', e.target.value); }}>
          {Object.entries(STRINGS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
      </div>

      {pending > 0 && <p className="notice">{pending} {t.pending}</p>}
      {status === 'sent' && <p className="notice ok" role="status">{t.sent}</p>}
      {status === 'offline' && <p className="notice" role="status">{t.savedOffline}</p>}

      {latest?.risk && (
        <section className={`status-panel ${latest.risk.level}`}>
          <RiskBadge level={latest.risk.level} label={t.level[latest.risk.level][0]} />
          <p>{t.level[latest.risk.level][1]}</p>
        </section>
      )}

      {advice?.decision && (
        <section className="panel">
          <h2>{t.advice}</h2>
          <p><strong>{t.decision[advice.decision]}</strong></p>
          {advice.note && <p>{advice.note}</p>}
          {(advice.decision === 'teleconsult' || callAsked) && (
            <a className="button primary" href={roomUrl(patient._id)} target="_blank" rel="noreferrer">{t.joinCall}</a>
          )}
        </section>
      )}

      {patient?.followUpDate && <p className="muted">{t.nextVisit}: <strong>{fmtDate(patient.followUpDate)}</strong></p>}

      <form onSubmit={submit} className="stack panel">
        <h2>{t.title}</h2>
        <p className="muted">{t.optional}</p>
        <div className="grid2">
          <label>{t.temperature}<input inputMode="decimal" value={form.temperature} onChange={set('temperature')} /></label>
          <label>{t.spo2}<input inputMode="numeric" value={form.spo2} onChange={set('spo2')} /></label>
          <label>{t.pulse}<input inputMode="numeric" value={form.heartRate} onChange={set('heartRate')} /></label>
          <label>{t.sugar}<input inputMode="numeric" value={form.glucose} onChange={set('glucose')} /></label>
          <label>{t.bpTop}<input inputMode="numeric" value={form.systolic} onChange={set('systolic')} /></label>
          <label>{t.bpBottom}<input inputMode="numeric" value={form.diastolic} onChange={set('diastolic')} /></label>
        </div>
        <label>{t.pain}: <strong>{form.pain}</strong>
          <input type="range" min="0" max="10" value={form.pain} onChange={set('pain')} />
        </label>

        <fieldset>
          <legend>{t.symptoms}</legend>
          <div className="chips">
            {SYMPTOM_KEYS.map((k) => (
              <label key={k} className={`chip ${form.symptoms.includes(k) ? 'on' : ''} ${RED_FLAGS.includes(k) ? 'flag' : ''}`}>
                <input type="checkbox" checked={form.symptoms.includes(k)} onChange={() => toggleSymptom(k)} />
                {t.sym[k]}
              </label>
            ))}
          </div>
        </fieldset>

        {emergency && <p className="emergency" role="alert">{t.emergency}</p>}

        <label className="check">
          <input type="checkbox" checked={form.medicinesTaken} onChange={(e) => setForm({ ...form, medicinesTaken: e.target.checked })} />
          {t.meds}
        </label>
        <label>{t.note}<textarea rows="2" value={form.note} onChange={set('note')} /></label>
        <button className="primary big" disabled={busy}>{t.submit}</button>
      </form>

      <button className="secondary big" onClick={askForCall} disabled={callAsked}>{callAsked ? t.callAsked : t.video}</button>

      {history.length > 0 && (
        <section>
          <h2>{t.history}</h2>
          <ul className="history">
            {history.slice(0, 7).map((c) => (
              <li key={c._id}>
                <span>{fmt(c.takenAt)}</span>
                <RiskBadge level={c.risk?.level} label={t.level[c.risk?.level]?.[0]} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <button className="link" onClick={logout}>{t.signOut}</button>
    </div></PortalShell>
  );
}
