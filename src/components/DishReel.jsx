import { motion, useMotionValueEvent } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  ACTIVE_POPOUT,
  ACTIVE_SCALE,
  CARD_H,
  CARD_H_MOBILE,
  CARD_W,
  CARD_W_MOBILE,
  COVERFLOW_GAP,
  PERSPECTIVE,
  PERSPECTIVE_MOBILE,
  RING_RADIUS_SCALE,
  RING_SLOT_GAP,
  ringRadius,
  shortestDeg,
  stepDeg,
  TILT_X,
  TILT_X_TABLET,
} from '../lib/pickDish'
import { FoodCard } from './FoodCard'

function placeCard(el, rot, conf) {
  if (!el) return
  const { index, layout, radius, step, gap, hideActive } = conf
  const angle = shortestDeg(rot + index * step)
  const abs = Math.abs(angle)

  if (layout === 'coverflow') {
    const offset = angle / step
    const x = offset * gap
    const rotY = Math.max(-42, Math.min(42, offset * -28))
    let s = 1 - Math.min(0.16, Math.abs(offset) * 0.08)
    if (Math.abs(offset) < 0.5) s = 1.06
    const dist = Math.abs(offset)
    if (dist > 1.35) {
      el.style.visibility = 'hidden'
      el.style.pointerEvents = 'none'
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0,0,0)'
    } else {
      el.style.visibility = 'visible'
      el.style.pointerEvents = dist < 1.15 ? 'auto' : 'none'
      el.style.opacity = String(Math.max(0.42, 1 - dist * 0.3))
      el.style.transform = `translate3d(${x}px, 0, 0) rotateY(${rotY}deg) scale(${s})`
    }
    el.style.zIndex = String(Math.round(140 - abs))
    return
  }

  const grow = Math.max(0, 1 - abs / Math.max(6, step * 0.4))
  const dist = abs / step
  const recede = dist < 0.45 ? 0 : Math.min(0.22, (dist - 0.45) * 0.1)
  const s = 1 + grow * (ACTIVE_SCALE - 1) - recede
  const pop = grow * ACTIVE_POPOUT
  el.style.transform = `rotateY(${index * step}deg) translateZ(${radius + pop}px) scale(${s})`
  el.style.zIndex = String(Math.round(140 - abs))

  if (hideActive && abs < step * 0.42) {
    el.style.visibility = 'hidden'
    el.style.pointerEvents = 'none'
    el.style.opacity = '0'
    return
  }

  if (abs / step > 2.15) {
    el.style.visibility = 'hidden'
    el.style.pointerEvents = 'none'
    el.style.opacity = '0'
    return
  }

  el.style.visibility = 'visible'
  el.style.pointerEvents = abs < 62 ? 'auto' : 'none'
  el.style.opacity = String(Math.max(0.48, 1 - (abs / step) * 0.22))
}

function PlacedCard({
  dish,
  index,
  rotation,
  spinning,
  winner,
  frontIndex,
  layout,
  radius,
  step,
  gap,
  hideActive,
  onSelect,
}) {
  const ref = useRef(null)
  const confRef = useRef({ index, layout, radius, step, gap, hideActive })

  useLayoutEffect(() => {
    confRef.current = { index, layout, radius, step, gap, hideActive }
    placeCard(ref.current, rotation.get(), confRef.current)
  }, [gap, hideActive, index, layout, radius, rotation, step])

  useMotionValueEvent(rotation, 'change', (rot) => {
    placeCard(ref.current, rot, confRef.current)
  })

  return (
    <div ref={ref} className="food-card-slot">
      <FoodCard
        dish={dish}
        active={!spinning && index === frontIndex}
        winner={Boolean(winner) && index === frontIndex}
        onSelect={() => onSelect(index)}
        id={`dish-${dish.id}`}
        ariaSelected={index === frontIndex}
      />
    </div>
  )
}

export function DishReel({
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
  const isTablet = useMediaQuery('(max-width: 1023px)')
  const stageRef = useRef(null)
  const count = dishes.length
  const layout = isMobile ? 'coverflow' : 'ring'
  const width = isMobile ? CARD_W_MOBILE : CARD_W
  const height = isMobile ? CARD_H_MOBILE : CARD_H
  const step = stepDeg(count)
  const radius = Math.round(ringRadius(count, width) * RING_RADIUS_SCALE)
  const tilt = layout === 'coverflow' ? 0 : isTablet ? TILT_X_TABLET : TILT_X
  const perspective = layout === 'coverflow' ? PERSPECTIVE_MOBILE : PERSPECTIVE
  const facing = dishes[frontIndex]
  const showHero = layout === 'ring' && settled
  const hideActive = showHero

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
    <div className="oracle-stage-clip">
      <div
      ref={stageRef}
      className={[
        'oracle-stage',
        layout === 'coverflow' ? 'is-coverflow' : 'is-ring',
        dragging ? 'is-dragging' : '',
        hideActive ? 'has-hero' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        perspective: `${perspective}px`,
        '--card-width': `${width}px`,
        '--card-height': `${height}px`,
        '--carousel-radius': `${radius}px`,
        '--angle-step': `${step}deg`,
        '--active-scale': String(ACTIVE_SCALE),
        '--active-popout': `${ACTIVE_POPOUT}px`,
        '--card-gap': `${RING_SLOT_GAP}px`,
      }}
      tabIndex={0}
      role="listbox"
      aria-label="Vòng bài món ăn"
      aria-activedescendant={facing ? `dish-${facing.id}` : undefined}
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
      <div className="oracle-stage-shadow" />
      <div
        className="oracle-ring"
        style={{
          transform:
            layout === 'coverflow'
              ? 'none'
              : `translateY(12%) scale(${isTablet ? 0.92 : 0.98}) rotateX(${tilt}deg)`,
        }}
      >
        <motion.div
          className="oracle-ring-inner"
          style={{
            width,
            height,
            rotateY: layout === 'coverflow' ? 0 : rotation,
            transformStyle: 'preserve-3d',
          }}
        >
          {dishes.map((dish, index) => (
            <PlacedCard
              key={dish.id}
              dish={dish}
              index={index}
              rotation={rotation}
              spinning={spinning}
              winner={winner}
              frontIndex={frontIndex}
              layout={layout}
              radius={radius}
              step={step}
              gap={COVERFLOW_GAP}
              hideActive={hideActive}
              onSelect={selectCard}
            />
          ))}
        </motion.div>
      </div>

      {showHero && facing ? (
        <div
          className={hideActive ? 'oracle-active-layer is-on' : 'oracle-active-layer'}
          aria-hidden="true"
        >
          <div className="oracle-active-halo" />
          <FoodCard
            dish={facing}
            active
            winner={Boolean(winner)}
            hero
            onSelect={() => selectCard(frontIndex)}
            id={`dish-hero-${facing.id}`}
            ariaSelected
          />
        </div>
      ) : null}
      </div>
    </div>
  )
}
