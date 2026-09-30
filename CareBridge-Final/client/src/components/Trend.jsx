export default function Trend({ title, unit, points, low, high }) {
  if (!points.length) {
    return (
      <div className="trend">
        <div className="trend-head"><h4>{title}</h4></div>
        <p className="muted">No readings yet</p>
      </div>
    );
  }
  const W = 320, H = 110, PX = 14, PY = 14;
  const ys = points.map((p) => p.y).concat([low, high].filter((v) => v != null));
  let min = Math.min(...ys), max = Math.max(...ys);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  min -= pad; max += pad;
  const x = (i) => (points.length === 1 ? W / 2 : PX + (i * (W - 2 * PX)) / (points.length - 1));
  const y = (v) => H - PY - ((v - min) / (max - min)) * (H - 2 * PY);
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  const outside = last.y > high || last.y < low;

  return (
    <div className="trend">
      <div className="trend-head">
        <h4>{title}</h4>
        <strong className={outside ? 'out' : ''}>{last.y} {unit}{outside ? ' (outside limit)' : ''}</strong>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title} over recent check-ins, latest ${last.y} ${unit}`}>
        {[high, low].map((v, i) =>
          v != null ? <line key={i} x1={PX} x2={W - PX} y1={y(v)} y2={y(v)} className="limit" /> : null
        )}
        <path d={path} className="line" />
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.y)} r={i === points.length - 1 ? 4.5 : 3} className={p.y > high || p.y < low ? 'dot out' : 'dot'} />
        ))}
      </svg>
    </div>
  );
}
