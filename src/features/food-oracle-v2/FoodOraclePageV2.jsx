import { useMemo } from 'react'
import { useDishSpin } from '../../hooks/useDishSpin'
import { CarouselHint } from './components/CarouselHint'
import { CinematicScene } from './components/CinematicScene'
import { FoodCarousel } from './components/FoodCarousel'
import { HeroHeader } from './components/HeroHeader'
import { RandomizeButton } from './components/RandomizeButton'
import './styles/food-oracle-v2.css'
import { attachDishAssets } from './utils/dishAssets'

export function FoodOraclePageV2() {
  const {
    dishes,
    rotation,
    visualProgress,
    rubberX,
    dragLive,
    status,
    winner,
    frontIndex,
    spinning,
    dragging,
    settled,
    dragPhase,
    gestureStartIndex,
    incomingIndex,
    spin,
    nudge,
    selectCard,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheelDelta,
  } = useDishSpin()

  const gallery = useMemo(() => attachDishAssets(dishes), [dishes])
  const facing = gallery[frontIndex]
  const hasSpun = status === 'done' || Boolean(winner)

  let live = facing ? `Đang xem ${facing.name}` : ''
  if (spinning) live = 'Đang chọn món'
  else if (winner) live = `Hôm nay ăn ${winner.name}`

  return (
    <main className="fo2">
      <CinematicScene />
      <HeroHeader />
      <section className="fo2-hero" aria-label="Bói món hôm nay">
        <p className="fo2-live" aria-live="polite">
          {live}
        </p>
        <FoodCarousel
          dishes={gallery}
          rotation={rotation}
          visualProgress={visualProgress}
          rubberX={rubberX}
          dragLive={dragLive}
          spinning={spinning}
          frontIndex={frontIndex}
          winner={winner}
          dragging={dragging}
          settled={settled}
          dragPhase={dragPhase}
          gestureStartIndex={gestureStartIndex}
          incomingIndex={incomingIndex}
          selectCard={selectCard}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onWheelDelta={onWheelDelta}
          onNudge={nudge}
        />
      </section>
      <CarouselHint index={frontIndex} total={gallery.length} />
      <RandomizeButton spinning={spinning} hasSpun={hasSpun} onSpin={spin} />
    </main>
  )
}
