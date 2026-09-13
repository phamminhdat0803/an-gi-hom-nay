import { FoodCard } from './FoodCard'

export function ActiveFoodCard({ dish, winner, visible }) {
  if (!dish) return null

  return (
    <div
      className={[
        'fo2-active-layer',
        visible ? 'is-on' : '',
        winner ? 'is-winner' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <div className="fo2-active-halo" />
      <div className="fo2-hero-card">
        <FoodCard dish={dish} variant="hero" winner={Boolean(winner)} />
      </div>
    </div>
  )
}
