export const fmt = (d) =>
  d ? new Date(d).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-';
export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) : '-');
export const hoursSince = (d) => (d ? (Date.now() - new Date(d)) / 36e5 : Infinity);
export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
export const roomUrl = (patientId) => `https://meet.jit.si/CareBridge-${patientId}`;
