import royalCrest from '../../../assets/card/royal-crest.png'
import royalDivider from '../../../assets/card/royal-divider.png'
import { RoyalCardShell } from './RoyalCardShell'

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
      <RoyalCardShell>
        <div className="fo2-royal-content">
          <img
            className="fo2-royal-crest"
            src={royalCrest}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <p className="fo2-card-kicker" aria-hidden="true">
            Hôm nay ăn
          </p>
          <p className="fo2-card-name">{name}</p>
          <div
            className={[
              'fo2-card-photo',
              dish?.id === 'goi-cuon' ? 'is-small-subject' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="fo2-card-photo-stage">
              {dish?.image ? (
                <img
                  src={dish.image}
                  alt={hero ? name : ''}
                  draggable="false"
                  style={photoStyle(dish.presentation)}
                />
              ) : null}
            </div>
          </div>
          <img
            className="fo2-royal-divider"
            src={royalDivider}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <p className="fo2-card-footer" aria-hidden="true">
            Tinh hoa ẩm thực Việt
          </p>
        </div>
      </RoyalCardShell>
    </article>
  )
}
