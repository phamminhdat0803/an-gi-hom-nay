function photoStyle(presentation) {
  const scale = presentation?.scale ?? 1
  const x = presentation?.x ?? 0
  const y = presentation?.y ?? 0
  return {
    transform: `translate(${x}px, ${y}px) scale(${scale})`,
  }
}

export function FoodCard({
  dish,
  variant = 'side',
  winner = false,
  onSelect,
  id,
  ariaSelected,
}) {
  const hero = variant === 'hero'
  const name = dish?.name ?? ''

  return (
    <article
      id={hero ? undefined : id}
      role={hero ? undefined : 'option'}
      aria-selected={hero ? undefined : ariaSelected}
      className={[
        'fo2-card',
        hero ? 'is-hero' : 'is-side',
        winner ? 'is-winner' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={hero ? undefined : onSelect}
    >
      <div className="fo2-card-face">
        <div
          className={[
            'fo2-card-photo',
            dish?.id === 'goi-cuon' ? 'is-small-subject' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {dish?.image ? (
            <img
              src={dish.image}
              alt={hero ? name : ''}
              draggable="false"
              style={photoStyle(dish.presentation)}
            />
          ) : null}
        </div>
        <div className="fo2-card-caption">
          {winner ? <p className="fo2-card-kicker">Hôm nay ăn</p> : null}
          <p className="fo2-card-name">{name}</p>
        </div>
      </div>
    </article>
  )
}
