import { FoodCard } from './FoodCard'

export function ActiveFoodCard({
  dish,
  winner,
  cardRef,
  haloRef,
  role = 'idle',
}) {
  if (!dish) return null

  return (
    <div
      ref={cardRef}
      className={['fo2-hero-card', winner ? 'is-winner' : ''].filter(Boolean).join(' ')}
      data-fo2-role={role}
      aria-hidden="true"
    >
      <div ref={haloRef} className="fo2-active-halo" />
      <FoodCard dish={dish} variant="hero" winner={Boolean(winner)} />
    </div>
  )
}
