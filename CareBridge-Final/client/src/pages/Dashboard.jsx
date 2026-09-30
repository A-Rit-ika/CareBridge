import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { fmt, fmtDate, hoursSince } from '../utils.js';
import RiskBadge from '../components/RiskBadge.jsx';

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () =>
      Promise.all([api('/patients'), api('/alerts?status=open')])
        .then(([p, a]) => { setPatients(p); setAlerts(a); setError(''); })
        .catch((e) => setError(e.message));
    load();
    const id = setInterval(load, 30000); // refresh every 30 s
    return () => clearInterval(id);
  }, []);

  const count = (lvl) => patients.filter((p) => p.riskLevel === lvl).length;
  const missed = patients.filter((p) => hoursSince(p.lastCheckinAt) > 36).length;

  return (
    <div className="wide">
      <div className="row between">
        <h1>Patients</h1>
        <Link className="button primary" to="/patients/new">Add patient</Link>
      </div>
      {error && <p className="error" role="alert">{error}</p>}

      <div className="stats">
        <div><strong>{count('red')}</strong> red</div>
        <div><strong>{count('amber')}</strong> amber</div>
        <div><strong>{count('green')}</strong> green</div>
        <div><strong>{missed}</strong> no check-in in 36 h</div>
      </div>

      <div className="split">
        <section>
          <h2>Needs your decision</h2>
          {alerts.length === 0 && <p className="muted">No open alerts. New check-ins that cross a limit will appear here.</p>}
          <ul className="alerts">
            {alerts.map((a) => (
              <li key={a._id} className={a.level}>
                <div className="row between">
                  <Link to={`/patients/${a.patient?._id}`}><strong>{a.patient?.name}</strong></Link>
                  <RiskBadge level={a.level} />
                </div>
                <p>{a.reasons.join('. ')}</p>
                <span className="muted small">{a.type === 'teleconsult' ? 'Video call request' : 'Check-in alert'}, {fmt(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>All patients</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Status</th><th>Last check-in</th><th>Follow-up</th></tr></thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p._id}>
                    <td><Link to={`/patients/${p._id}`}>{p.name}</Link><div className="muted small">{p.condition}{p.village ? `, ${p.village}` : ''}</div></td>
                    <td><RiskBadge level={p.riskLevel} /></td>
                    <td className={hoursSince(p.lastCheckinAt) > 36 ? 'out' : ''}>{fmt(p.lastCheckinAt)}</td>
                    <td>{fmtDate(p.followUpDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {patients.length === 0 && <p className="muted">No patients yet. Add the first one after discharge.</p>}
        </section>
      </div>
    </div>
  );
}
