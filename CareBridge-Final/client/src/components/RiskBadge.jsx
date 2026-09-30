const ICON = { green: '●', amber: '▲', red: '■' };
const TEXT = { green: 'Green', amber: 'Amber', red: 'Red' };

// Shape + word + colour, so status never depends on colour alone.
export default function RiskBadge({ level, label }) {
  return (
    <span className={`badge ${level || 'none'}`}>
      <span aria-hidden="true">{ICON[level] || '○'}</span> {label || TEXT[level] || 'No data'}
    </span>
  );
}
