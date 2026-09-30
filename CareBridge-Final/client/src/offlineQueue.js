import { api } from './api.js';

// Check-ins are always saved on the phone first, then sent. If the network is down
// they wait in localStorage and go out when the connection returns.
const KEY = 'cb_queue';
export const readQueue = () => JSON.parse(localStorage.getItem(KEY) || '[]');
const write = (q) => localStorage.setItem(KEY, JSON.stringify(q));

export function enqueue(item) {
  write([...readQueue(), item]);
}

export async function flushQueue() {
  const remaining = [];
  for (const item of readQueue()) {
    try {
      await api('/checkins', { method: 'POST', body: item });
    } catch (e) {
      // keep for retry when offline, server down, or signed out; drop items the server rejects as invalid
      if (!e.status || e.status >= 500 || e.status === 401) remaining.push(item);
    }
  }
  write(remaining);
  return remaining.length;
}
