import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { dishes } from '../data/dishes'
import {
  clockwiseTarget,
  DRAG_PX_PER_CARD,
  facingRotation,
  frontIndexFromRotation,
  nearestFacing,
  pickWeighted,
  SPIN_EXTRA_TURNS,
  stepDeg,
} from '../lib/pickDish'

export function useDishSpin() {
  const reduceMotion = useReducedMotion()
  const rotation = useMotionValue(0)
  const [status, setStatus] = useState('idle')
  const [winner, setWinner] = useState(null)
  const [frontIndex, setFrontIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [animating, setAnimating] = useState(false)
  const runIdRef = useRef(0)
  const controlsRef = useRef(null)
  const spinningRef = useRef(false)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startRot: 0,
    moved: 0,
  })
  const wheelSnapRef = useRef(0)

  useMotionValueEvent(rotation, 'change', (latest) => {
    if (spinningRef.current || dragRef.current.active) return
    const next = frontIndexFromRotation(latest, dishes.length)
    setFrontIndex((prev) => (prev === next ? prev : next))
  })

  const stopControls = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
  }

  const snapToIndex = useCallback(
    (index) => {
      if (spinningRef.current) return
      const count = dishes.length
      const i = ((index % count) + count) % count
      const target = nearestFacing(rotation.get(), i, count)
      stopControls()
      setFrontIndex(i)
      if (reduceMotion) {
        rotation.set(target)
        setAnimating(false)
        return
      }
      setAnimating(true)
      const anim = animate(rotation, target, {
        type: 'spring',
        stiffness: 240,
        damping: 28,
        mass: 0.85,
      })
      controlsRef.current = anim
      anim.then(() => setAnimating(false)).catch(() => setAnimating(false))
    },
    [reduceMotion, rotation],
  )

  const snapToNearest = useCallback(() => {
    const idx = frontIndexFromRotation(rotation.get(), dishes.length)
    snapToIndex(idx)
  }, [rotation, snapToIndex])

  const nudge = useCallback(
    (dir) => {
      if (spinningRef.current) return
      const idx = frontIndexFromRotation(rotation.get(), dishes.length)
      snapToIndex(idx + dir)
    },
    [rotation, snapToIndex],
  )

  const selectCard = useCallback(
    (index) => {
      if (spinningRef.current) return
      if (dragRef.current.moved > 8) return
      snapToIndex(index)
    },
    [snapToIndex],
  )

  const onPointerDown = useCallback(
    (event) => {
      if (spinningRef.current) return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      stopControls()
      dragRef.current = {
        active: true,
        startX: event.clientX,
        startRot: rotation.get(),
        moved: 0,
      }
      setDragging(true)
    },
    [rotation],
  )

  const onPointerMove = useCallback(
    (event) => {
      const drag = dragRef.current
      if (!drag.active || spinningRef.current) return
      const dx = event.clientX - drag.startX
      drag.moved = Math.max(drag.moved, Math.abs(dx))
      const step = stepDeg(dishes.length)
      rotation.set(drag.startRot + (dx / DRAG_PX_PER_CARD) * step)
    },
    [rotation],
  )

  const endDrag = useCallback(() => {
    const drag = dragRef.current
    if (!drag.active) return
    drag.active = false
    setDragging(false)
    if (drag.moved > 0) snapToNearest()
  }, [snapToNearest])

  const onWheelDelta = useCallback(
    (delta) => {
      if (spinningRef.current) return
      if (reduceMotion) {
        nudge(delta > 0 ? 1 : -1)
        return
      }
      stopControls()
      rotation.set(rotation.get() - delta * 0.18)
      window.clearTimeout(wheelSnapRef.current)
      wheelSnapRef.current = window.setTimeout(() => {
        snapToNearest()
      }, 110)
    },
    [nudge, reduceMotion, rotation, snapToNearest],
  )

  const spin = useCallback(async () => {
    if (spinningRef.current) return
    spinningRef.current = true

    const next = pickWeighted(dishes)
    const winIndex = dishes.findIndex((dish) => dish.id === next.id)
    const runId = runIdRef.current + 1
    runIdRef.current = runId
    const stillCurrent = () => runIdRef.current === runId

    setAnimating(true)

    if (reduceMotion) {
      stopControls()
      rotation.set(facingRotation(winIndex, dishes.length))
      setFrontIndex(winIndex)
      setWinner(next)
      setStatus('done')
      spinningRef.current = false
      setAnimating(false)
      return
    }

    stopControls()
    setWinner(null)
    setStatus('spinning')

    const from = rotation.get()
    const target = clockwiseTarget(
      from,
      winIndex,
      dishes.length,
      SPIN_EXTRA_TURNS,
    )
    const delta = target - from

    try {
      const ramp = animate(rotation, from + delta * 0.16, {
        duration: 0.28,
        ease: [0.45, 0, 1, 1],
      })
      controlsRef.current = ramp
      await ramp
      if (!stillCurrent()) return

      const cruise = animate(rotation, from + delta * 0.7, {
        duration: 0.72,
        ease: 'linear',
      })
      controlsRef.current = cruise
      await cruise
      if (!stillCurrent()) return

      const land = animate(rotation, target, {
        type: 'spring',
        stiffness: 140,
        damping: 26,
        mass: 0.9,
        restDelta: 0.08,
        restSpeed: 0.08,
      })
      controlsRef.current = land
      await land
      if (!stillCurrent()) return

      stopControls()
      rotation.set(target)
      setFrontIndex(winIndex)
      setWinner(next)
      setStatus('done')
    } catch {
      if (stillCurrent()) setStatus('idle')
    } finally {
      if (stillCurrent()) {
        controlsRef.current = null
        spinningRef.current = false
        setAnimating(false)
      }
    }
  }, [reduceMotion, rotation])

  useEffect(() => {
    return () => {
      runIdRef.current += 1
      controlsRef.current?.stop()
      window.clearTimeout(wheelSnapRef.current)
    }
  }, [])

  return {
    dishes,
    rotation,
    status,
    winner,
    frontIndex,
    spinning: status === 'spinning',
    dragging,
    settled: status !== 'spinning' && !dragging && !animating,
    spin,
    nudge,
    selectCard,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onWheelDelta,
  }
}
