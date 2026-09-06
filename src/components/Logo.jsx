export default function Logo({ size = 58, color = '#241242', className = '' }) {
  const fontSize = Math.round(size * 0.42)
  return (
    <span
      className={`font-black italic tracking-tight whitespace-nowrap ${className}`}
      style={{ fontSize, color, lineHeight: 1 }}
    >
      Bazaario
    </span>
  )
}

export function LogoMark({ size = 40, color = '#ffffff' }) {
  return (
    <span
      className="font-black italic"
      style={{ fontSize: size, color, lineHeight: 1 }}
    >
      B
    </span>
  )
}
