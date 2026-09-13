import { DishArt } from './DishArt'

function CardBack() {
  return (
    <div className="food-card-face food-card-back" aria-hidden="true">
      <div className="food-card-back-pattern" />
      <svg
        className="food-card-mark"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.5 16.5c.4-4.2 14.6-4.2 15 0"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M18.2 17.2c.3-3.2 11.3-3.2 11.6 0"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
        <path
          d="M9.5 27.5c1.2 8.4 7.2 13 14.5 13s13.3-4.6 14.5-13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse
          cx="24"
          cy="27.2"
          rx="14.6"
          ry="4.4"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  )
}

function CardFace({ dish, winner, hero }) {
  return (
    <div className="food-card-face food-card-front">
      <div
        className="food-visual"
        style={{
          '--dish-tone': dish.tone,
        }}
      >
        {dish.image ? (
          <img
            src={dish.image}
            alt=""
            draggable="false"
            className="food-visual-image"
          />
        ) : (
          <>
            <span className="food-visual-wash" />
            <DishArt id={dish.id} />
          </>
        )}
      </div>
      <div className="food-caption-block">
        {hero || winner ? <p className="food-kicker">Hôm nay ăn</p> : null}
        <p className="food-caption">{dish.name}</p>
      </div>
    </div>
  )
}

export function FoodCard({
  dish,
  active = false,
  winner = false,
  hero = false,
  onSelect,
  id,
  ariaSelected,
}) {
  return (
    <article
      id={hero ? undefined : id}
      role={hero ? undefined : 'option'}
      aria-selected={hero ? undefined : ariaSelected}
      className={[
        'food-card',
        active ? 'is-active' : '',
        winner ? 'is-winner' : '',
        hero ? 'is-hero' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onSelect}
    >
      <CardFace dish={dish} winner={winner} hero={hero} />
      {hero ? null : <CardBack />}
    </article>
  )
}
