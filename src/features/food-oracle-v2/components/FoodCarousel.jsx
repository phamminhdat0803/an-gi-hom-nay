import { useMotionValueEvent } from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import {
  applyCardPose,
  applyFrozenTrackCard,
  applyOverlayPose,
  getCardPose,
  getLayout,
  neighborFromProgress,
  twoCardPoses,
  wrapIndex,
} from '../utils/carouselGeometry'
import { ActiveFoodCard } from './ActiveFoodCard'
import { FoodCard } from './FoodCard'

function paintFrozen(el, conf, progress) {
  const hideSet = new Set([conf.startIndex])
  const incoming = neighborFromProgress(conf.startIndex, progress, conf.count)
  if (incoming != null) hideSet.add(incoming)
  applyFrozenTrackCard(el, {
    index: conf.index,
    count: conf.count,
    layout: conf.layout,
    startIndex: conf.startIndex,
    hideSet,
    visualProgress: progress,
  })
}

function PlacedCard({
  dish,
  index,
  count,
  layout,
  hideIndex,
  freezeChrome,
  rotation,
  visualProgress,
  dragLive,
  frontIndex,
  onSelect,
  dragPhase,
  startIndex,
  incomingIndex,
}) {
  const ref = useRef(null)
  const confRef = useRef({})

  useLayoutEffect(() => {
    confRef.current = {
      index,
      count,
      layout,
      hideIndex,
      freezeChrome,
      dragPhase,
      startIndex,
      incomingIndex,
    }
    if (dragLive.get() === 1) {
      paintFrozen(ref.current, confRef.current, visualProgress.get())
      return
    }
    applyCardPose(ref.current, rotation.get(), confRef.current)
  }, [
    count,
    dragLive,
    dragPhase,
    freezeChrome,
    hideIndex,
    incomingIndex,
    index,
    layout,
    rotation,
    startIndex,
    visualProgress,
  ])

  useMotionValueEvent(rotation, 'change', (rot) => {
    if (dragLive.get() === 1) return
    applyCardPose(ref.current, rot, confRef.current)
  })

  useMotionValueEvent(visualProgress, 'change', (progress) => {
    if (dragLive.get() !== 1) return
    paintFrozen(ref.current, confRef.current, progress)
  })

  useMotionValueEvent(dragLive, 'change', (live) => {
    if (live === 1) {
      paintFrozen(ref.current, confRef.current, visualProgress.get())
      return
    }
    applyCardPose(ref.current, rotation.get(), confRef.current)
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

function OverlayPair({
  dishes,
  startIndex,
  count,
  winner,
  spinning,
  layout,
  dragPhase,
  visualProgress,
  rubberX,
  dragLive,
}) {
  const outRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const outHaloRef = useRef(null)
  const prevHaloRef = useRef(null)
  const nextHaloRef = useRef(null)
  const confRef = useRef({})

  const prevIndex = wrapIndex(startIndex - 1, count)
  const nextIndex = wrapIndex(startIndex + 1, count)
  const outgoingDish = dishes[startIndex]
  const prevDish = dishes[prevIndex]
  const nextDish = dishes[nextIndex]

  const hideNeighbors = useCallback(() => {
    applyOverlayPose(prevRef.current, null, prevHaloRef.current)
    applyOverlayPose(nextRef.current, null, nextHaloRef.current)
  }, [])

  const paintIdle = useCallback(
    (nextLayout) => {
      applyOverlayPose(outRef.current, getCardPose(0, nextLayout), outHaloRef.current)
      hideNeighbors()
    },
    [hideNeighbors],
  )

  const paintTwoCard = useCallback(
    (nextLayout) => {
      const progress = visualProgress.get()
      const poses = twoCardPoses(progress, nextLayout, rubberX.get())
      applyOverlayPose(outRef.current, poses.outgoing, outHaloRef.current)
      if (progress > 0) {
        applyOverlayPose(prevRef.current, poses.incoming, prevHaloRef.current)
        applyOverlayPose(nextRef.current, null, nextHaloRef.current)
      } else if (progress < 0) {
        applyOverlayPose(nextRef.current, poses.incoming, nextHaloRef.current)
        applyOverlayPose(prevRef.current, null, prevHaloRef.current)
      } else {
        hideNeighbors()
      }
    },
    [hideNeighbors, rubberX, visualProgress],
  )

  const paint = useCallback(() => {
    const { layout: nextLayout, dragPhase: phase, spinning: isSpin } = confRef.current
    if (!nextLayout) return
    if (isSpin) {
      applyOverlayPose(outRef.current, null, outHaloRef.current)
      hideNeighbors()
      return
    }
    if (phase === 'idle' && dragLive.get() !== 1) {
      paintIdle(nextLayout)
      return
    }
    paintTwoCard(nextLayout)
  }, [dragLive, hideNeighbors, paintIdle, paintTwoCard])

  useLayoutEffect(() => {
    confRef.current = { layout, dragPhase, spinning }
    if (spinning) {
      applyOverlayPose(outRef.current, null, outHaloRef.current)
      hideNeighbors()
      return
    }
    if (dragPhase === 'idle') {
      paintIdle(layout)
      return
    }
    paintTwoCard(layout)
  }, [dragPhase, hideNeighbors, layout, paintIdle, paintTwoCard, spinning, startIndex])

  useMotionValueEvent(visualProgress, 'change', paint)
  useMotionValueEvent(rubberX, 'change', paint)
  useMotionValueEvent(dragLive, 'change', paint)

  return (
    <>
      <ActiveFoodCard
        dish={outgoingDish}
        winner={Boolean(winner) && outgoingDish?.id === winner?.id && dragPhase === 'idle'}
        cardRef={outRef}
        haloRef={outHaloRef}
        role="outgoing"
      />
      <ActiveFoodCard
        dish={prevDish}
        winner={false}
        cardRef={prevRef}
        haloRef={prevHaloRef}
        role="incoming-prev"
      />
      <ActiveFoodCard
        dish={nextDish}
        winner={false}
        cardRef={nextRef}
        haloRef={nextHaloRef}
        role="incoming-next"
      />
    </>
  )
}

export function FoodCarousel({
  dishes,
  rotation,
  visualProgress,
  rubberX,
  dragLive,
  spinning,
  frontIndex,
  winner,
  dragging,
  settled,
  dragPhase,
  gestureStartIndex,
  incomingIndex,
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
  const trackRef = useRef(null)
  const count = dishes.length
  const layout = useMemo(
    () => getLayout({ isMobile, isTablet: isTablet && !isMobile, isShort }),
    [isMobile, isShort, isTablet],
  )
  const gestureActive = dragPhase !== 'idle'
  const startIndex = gestureActive ? gestureStartIndex : frontIndex
  const facing = dishes[frontIndex]
  const showHero = !spinning && Boolean(facing)
  const hideIndex = showHero ? frontIndex : -1
  const freezeChrome = !settled

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

  useMotionValueEvent(dragLive, 'change', (live) => {
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return
    if (live === 1) {
      stage.classList.add('is-dragging')
      track.style.transformStyle = 'flat'
      return
    }
    if (dragPhase === 'idle') {
      stage.classList.remove('is-dragging')
      track.style.transformStyle = 'preserve-3d'
    }
  })

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
      >
        <div ref={trackRef} className="fo2-track">
          {dishes.map((dish, index) => (
            <PlacedCard
              key={dish.id}
              dish={dish}
              index={index}
              count={count}
              layout={layout}
              hideIndex={hideIndex}
              freezeChrome={freezeChrome}
              rotation={rotation}
              visualProgress={visualProgress}
              dragLive={dragLive}
              frontIndex={frontIndex}
              onSelect={selectCard}
              dragPhase={dragPhase}
              startIndex={startIndex}
              incomingIndex={incomingIndex}
            />
          ))}
          <OverlayPair
            dishes={dishes}
            startIndex={startIndex}
            count={count}
            winner={winner}
            spinning={spinning}
            layout={layout}
            dragPhase={dragPhase}
            visualProgress={visualProgress}
            rubberX={rubberX}
            dragLive={dragLive}
          />
        </div>
      </div>
    </div>
  )
}
