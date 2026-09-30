import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { fmt, fmtDate, roomUrl } from '../utils.js';
import RiskBadge from '../components/RiskBadge.jsx';
import Trend from '../components/Trend.jsx';

function ReviewForm({ alert, patientId, onDone }) {
  const [decision, setDecision] = useState('remote');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function save(e) {
    e.preventDefault();
    try {
      await api(`/alerts/${alert._id}/review`, { method: 'PATCH', body: { decision, note } });
      onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={save} className="stack review">
      <div className="row between">
        <RiskBadge level={alert.level} />
        <span className="muted small">{fmt(alert.createdAt)}</span>
      </div>
      <p>{alert.reasons.join('. ')}</p>
      <label>Decision
        <select value={decision} onChange={(e) => setDecision(e.target.value)}>
          <option value="remote">Keep recovering at home</option>
          <option value="teleconsult">Video call</option>
          <option value="visit">Ask them to visit the hospital</option>
        </select>
      </label>
      <label>Message to the family
        <textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Short and clear, for example: drink fluids, we will call at 5 pm" />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="primary">Save decision</button>
    </form>
  );
}

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, c, a] = await Promise.all([api(`/patients/${id}`), api(`/checkins/patient/${id}`), api(`/alerts?status=open&patient=${id}`)]);
      setPatient(p); setCheckins(c); setAlerts(a);
    } catch (e) { setError(e.message); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) return <div className="wide"><p className="error">{error}</p></div>;
  if (!patient) return <div className="wide"><p className="muted">Loading...</p></div>;

  const asc = [...checkins].reverse();
  const series = (key) => asc.filter((c) => typeof c[key] === 'number').map((c) => ({ x: c.takenAt, y: c[key] }));
  const th = patient.thresholds || {};

  return (
    <div className="wide">
      <p><Link to="/dashboard">Back to patients</Link></p>
      <div className="row between">
        <div>
          <h1>{patient.name}</h1>
          <p className="muted">{patient.age ? `${patient.age} yrs, ` : ''}{patient.condition}{patient.village ? `, ${patient.village}` : ''}</p>
        </div>
        <div className="row">
          <RiskBadge level={patient.riskLevel} />
       
        </div>
      </div>

      <div className="facts">
        <div><span className="muted">Discharged</span><br />{fmtDate(patient.dischargeDate)}</div>
        <div><span className="muted">Next follow-up</span><br />{fmtDate(patient.followUpDate)}</div>
        <div><span className="muted">Caregiver</span><br />{patient.caregiverName || '-'}</div>
        <div><span className="muted">Phone</span><br />{patient.phone || '-'}</div>
      </div>

      {alerts.length > 0 && (
        <section>
          <h2>Open alerts</h2>
          {alerts.map((a) => <ReviewForm key={a._id} alert={a} patientId={id} onDone={load} />)}
        </section>
      )}

      <section>
        <h2>Trends</h2>
        <div className="trends">
          <Trend title="Temperature" unit="°F" points={series('temperature')} high={th.tempMax} />
          <Trend title="Oxygen (SpO₂)" unit="%" points={series('spo2')} low={th.spo2Min} />
          <Trend title="Pulse" unit="/min" points={series('heartRate')} low={th.hrMin} high={th.hrMax} />
          <Trend title="Systolic BP" unit="mmHg" points={series('systolic')} low={th.sysMin} high={th.sysMax} />
        </div>
      </section>

      <section>
        <h2>Check-ins</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>When</th><th>Status</th><th>Temp</th><th>SpO₂</th><th>Pulse</th><th>BP</th><th>Pain</th><th>Symptoms and notes</th></tr></thead>
            <tbody>
              {checkins.map((c) => (
                <tr key={c._id}>
                  <td>{fmt(c.takenAt)}</td>
                  <td><RiskBadge level={c.risk?.level} /></td>
                  <td>{c.temperature ?? '-'}</td><td>{c.spo2 ?? '-'}</td><td>{c.heartRate ?? '-'}</td>
                  <td>{c.systolic ? `${c.systolic}/${c.diastolic ?? '?'}` : '-'}</td><td>{c.pain ?? '-'}</td>
                  <td>{[...c.symptoms.map((s) => s.replace(/_/g, ' ')), c.medicinesTaken === false ? 'missed medicines' : '', c.note].filter(Boolean).join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {patient.medicines?.length > 0 && (
        <section><h2>Medicines</h2><ul>{patient.medicines.map((m) => <li key={m}>{m}</li>)}</ul></section>
      )}
    </div>
  );
}
