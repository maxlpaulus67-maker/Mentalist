/** Schlanker SVG-Linienchart ohne Bibliothek. Lücken (null) werden übersprungen. */
export default function LineChart({ labels, values, unit = '', max, color = '#d9b968', label }: {
  labels: string[]; values: (number | null)[]; unit?: string; max?: number; color?: string; label: string
}) {
  const W = 600, H = 180, P = { l: 40, r: 12, t: 12, b: 26 }
  const nums = values.filter((v): v is number => v !== null)
  const top = max ?? Math.max(1, ...nums) * 1.15
  const x = (i: number) => P.l + (i / Math.max(1, labels.length - 1)) * (W - P.l - P.r)
  const y = (v: number) => P.t + (1 - v / top) * (H - P.t - P.b)
  let d = ''
  values.forEach((v, i) => { if (v !== null) d += `${d && values[i - 1] !== null ? 'L' : 'M'} ${x(i)} ${y(v)} ` })
  const ticks = [0, 0.5, 1].map((f) => top * f)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#34343a" strokeDasharray="3 4" />
          <text x={P.l - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#8a8a93">{Math.round(t)}{unit}</text>
        </g>
      ))}
      {labels.map((l, i) => (i % Math.ceil(labels.length / 7) === 0 || i === labels.length - 1) && (
        <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#8a8a93">{l}</text>
      ))}
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => v !== null && <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill={color}><title>{labels[i]}: {Math.round(v)}{unit}</title></circle>)}
    </svg>
  )
}
