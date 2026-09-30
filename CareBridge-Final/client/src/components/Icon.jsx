const paths = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  heart: 'M20.8 8.8c0 5.4-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 8 4c1.7 0 3.1.8 4 2 0.9-1.2 2.3-2 4-2a4.8 4.8 0 0 1 4.8 4.8Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16.5 3.1a4 4 0 0 1 0 7.8',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  calendar: 'M7 2v4M17 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Z',
  message: 'M21 11.5a8 8 0 0 1-8.5 8 9.7 9.7 0 0 1-3.6-.7L4 21l1.5-4A7.7 7.7 0 0 1 5 12a8 8 0 0 1 16-.5Z',
  pill: 'M7 3h4a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM3 11h12',
  chart: 'M4 19V5M4 19h17M8 16v-4M12 16V8M16 16v-6M20 16v-9',
  file: 'M6 2h8l4 4v16H6zM14 2v5h5M9 12h6M9 16h6',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L9 7l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3L17.4 6l1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.4h-.1a1.7 1.7 0 0 0-1.6 1Z',
  logout: 'M10 17l5-5-5-5M15 12H3M19 4h2v16h-2',
  arrow: 'M5 12h13M13 6l6 6-6 6',
  check: 'M20 6 9 17l-5-5',
  alert: 'M12 3 2 21h20L12 3ZM12 9v5M12 18h.01',
  phone: 'M6.6 2h2.7l1.3 5-2 1.7a15 15 0 0 0 5.7 5.7l1.7-2 5 1.3v2.7c0 1.1-.9 2-2 2C10.7 18.4 3.6 11.3 3.6 3.9c0-1.1.9-1.9 2-1.9Z'
};
export default function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const d = paths[name] || paths.grid;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
}
