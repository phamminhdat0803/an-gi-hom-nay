function pad(n) {
  return String(n).padStart(2, '0')
}

export function CarouselHint({ index, total }) {
  return (
    <div className="fo2-hint">
      <p className="fo2-hint-line">← Kéo để khám phá →</p>
      <p className="fo2-hint-count">
        {pad(index + 1)} / {pad(total)}
      </p>
    </div>
  )
}
