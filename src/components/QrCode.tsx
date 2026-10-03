import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

/** Renders a QR for a real URL. Shows nothing until a URL exists — never a placeholder code. */
export function QrCode({ value, size = 180, label }: { value?: string; size?: number; label?: string }) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    if (!value) return setSvg('')
    QRCode.toString(value, { type: 'svg', margin: 1, color: { dark: '#1b1430', light: '#ffffff' } }).then(setSvg)
  }, [value])
  return (
    <figure className="inline-flex flex-col items-center gap-2">
      <div
        className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-ink/10"
        style={{ width: size, height: size }}
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-label={label ?? 'QR code'}
        role="img"
      />
      {label && <figcaption className="text-center text-sm font-semibold text-muted">{label}</figcaption>}
    </figure>
  )
}
