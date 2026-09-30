import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Icon from './Icon.jsx';

const patientNav = [
  ['/me', 'Overview', 'grid'], ['/checkin', 'Daily check-in', 'heart'], ['/health', 'My health', 'chart'],
  ['/medications', 'Medications', 'pill'], ['/appointments', 'Appointments', 'calendar'], ['/messages', 'Messages', 'message'],
  ['/reports', 'Reports', 'file'], ['/profile', 'Profile & settings', 'settings']
];
const clinicianNav = [
  ['/dashboard', 'Overview', 'grid'], ['/patients', 'Patients', 'users'], ['/alerts', 'Alert center', 'bell'],
  ['/appointments', 'Appointments', 'calendar'], ['/messages', 'Messages', 'message'], ['/analytics', 'Analytics', 'chart'], ['/profile', 'My profile', 'settings']
];

export default function PortalShell({ children, title, eyebrow }) {
  const { user, logout } = useAuth();
  const nav = user?.role === 'clinician' ? clinicianNav : patientNav;
  const location = useLocation();
  const navigate = useNavigate();
  const isPatient = user?.role === 'patient';
  const activePath = isPatient && location.pathname === '/' ? '/me' : location.pathname;
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand-mark" onClick={() => navigate(user?.role === 'clinician' ? '/dashboard' : '/me')}><span className="brand-symbol"><Icon name="heart" size={20}/></span><span>Care<span>Bridge</span></span></button>
      <div className="side-label">WORKSPACE</div>
      <nav className="side-nav">{nav.map(([to,label,icon]) => <NavLink key={to} to={to} className={({isActive}) => `side-link ${(isActive || activePath === to) ? 'active' : ''}`}><Icon name={icon}/><span>{label}</span>{label === 'Messages' && <span className="nav-dot"/>}</NavLink>)}</nav>
      <div className="sidebar-spacer" />
      <div className="safety-note"><span><Icon name="check" size={16}/></span><div><strong>Care, connected.</strong><p>Clinical alerts are reviewed by your care team.</p></div></div>
      <button className="side-link logout" onClick={logout}><Icon name="logout"/><span>Sign out</span></button>
    </aside>
    <section className="main-shell">
      <header className="portal-topbar">
        <div><span className="eyebrow">{eyebrow || (isPatient ? 'PATIENT PORTAL' : 'CLINICIAN PORTAL')}</span><h1>{title}</h1></div>
        <div className="top-actions"><button className="icon-btn" title="Notifications"><Icon name="bell"/></button><div className="user-chip"><span className="avatar">{(user?.name || 'U').slice(0,1).toUpperCase()}</span><div><strong>{user?.name}</strong><small>{isPatient ? 'Patient' : 'Care team'}</small></div></div></div>
      </header>
      <main className="page-content">{children}</main>
    </section>
  </div>;
}
