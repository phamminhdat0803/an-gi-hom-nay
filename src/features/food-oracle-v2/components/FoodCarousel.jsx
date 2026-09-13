import { useMotionValueEvent } from 'motion/react'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { applyCardPose, getLayout } from '../utils/carouselGeometry'
import { ActiveFoodCard } from './ActiveFoodCard'
import { FoodCard } from './FoodCard'

function PlacedCard({
  dish,
  index,
  count,
  layout,
  hideActive,
  rotation,
  frontIndex,
  onSelect,
}) {
  const ref = useRef(null)
  const confRef = useRef({ index, count, layout, hideActive })

  useLayoutEffect(() => {
    confRef.current = { index, count, layout, hideActive }
    applyCardPose(ref.current, rotation.get(), confRef.current)
  }, [count, hideActive, index, layout, rotation])

  useMotionValueEvent(rotation, 'change', (rot) => {
    applyCardPose(ref.current, rot, confRef.current)
  })

  return (
    <div ref={ref} className="fo2-card-slot">
      <FoodCard
        dish={dish}
        variant="side"
        onSelect={() => onSelect(index)}
        id={`fo2-dish-${dish.id}`}
        ariaSelected={index === frontIndex}
      />
    </div>
  )
}

export function FoodCarousel({
  dishes,
  rotation,
  spinning,
  frontIndex,
  winner,
  dragging,
  settled,
  selectCard,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onWheelDelta,
  onNudge,
}) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(max-width: 1199px)')
  const isShort = useMediaQuery('(max-height: 800px)')
  const stageRef = useRef(null)
  const count = dishes.length
  const layout = useMemo(
    () => getLayout({ isMobile, isTablet: isTablet && !isMobile, isShort }),
    [isMobile, isShort, isTablet],
  )
  const facing = dishes[frontIndex]
  const hideActive = settled && !spinning
  const showHero = hideActive && Boolean(facing)

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onWheel = (event) => {
      event.preventDefault()
      onWheelDelta(event.deltaX + event.deltaY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheelDelta])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onKey = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNudge(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onNudge(-1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        selectCard(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        selectCard(count - 1)
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [count, onNudge, selectCard])

  return (
    <div
      className="fo2-stage-clip"
      style={{
        '--fo2-card-w': `${layout.cardW}px`,
        '--fo2-card-h': `${layout.cardH}px`,
      }}
    >
      <div
        ref={stageRef}
        className={['fo2-stage', dragging ? 'is-dragging' : '']
          .filter(Boolean)
          .join(' ')}
        style={{
          perspective: `${layout.perspective}px`,
        }}
        tabIndex={0}
        role="listbox"
        aria-label="Vòng bài món ăn"
        aria-activedescendant={facing ? `fo2-dish-${facing.id}` : undefined}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture?.(event.pointerId)
          onPointerDown(event)
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onLostPointerCapture={onPointerCancel}
      >
        <div className="fo2-track">
          {dishes.map((dish, index) => (
            <PlacedCard
              key={dish.id}
              dish={dish}
              index={index}
              count={count}
              layout={layout}
              hideActive={hideActive}
              rotation={rotation}
              frontIndex={frontIndex}
              onSelect={selectCard}
            />
          ))}
        </div>
      </div>
      <ActiveFoodCard
        dish={facing}
        winner={Boolean(winner) && facing?.id === winner?.id}
        visible={showHero}
      />
    </div>
  )
}
