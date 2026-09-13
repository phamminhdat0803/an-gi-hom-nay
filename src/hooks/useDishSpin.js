import {
  animate,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { dishes } from '../data/dishes'
import {
  clockwiseTarget,
  DRAG_PX_PER_CARD,
  facingRotation,
  frontIndexFromRotation,
  nearestFacing,
  pickWeighted,
  SPIN_EXTRA_TURNS,
} from '../lib/pickDish'

const COMMIT_PX = DRAG_PX_PER_CARD * 0.38
const FLICK_PX_PER_MS = 0.55
const RUBBER_MAX_PX = 14
const DRAG_DISTANCE = DRAG_PX_PER_CARD

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function wrapIndex(index, count) {
  return ((index % count) + count) % count
}

function neighborFromProgress(startIndex, visualProgress, count) {
  if (visualProgress > 0) return wrapIndex(startIndex - 1, count)
  if (visualProgress < 0) return wrapIndex(startIndex + 1, count)
  return null
}

function rubberTranslation(rawDx) {
  const extra = Math.abs(rawDx) - DRAG_DISTANCE
  if (extra <= 0) return 0
  return Math.sign(rawDx) * Math.min(extra * 0.08, RUBBER_MAX_PX)
}

function publishQa(payload) {
  if (!import.meta.env.DEV) return
  window.__fo2Drag = payload
}

export function useDishSpin() {
  const reduceMotion = useReducedMotion()
  const rotation = useMotionValue(0)
  const visualProgress = useMotionValue(0)
  const rubberX = useMotionValue(0)
  const dragLive = useMotionValue(0)
  const [status, setStatus] = useState('idle')
  const [winner, setWinner] = useState(null)
  const [committedIndex, setCommittedIndexState] = useState(0)
  const [dragPhase, setDragPhase] = useState('idle')
  const [gestureStartIndex, setGestureStartIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState(null)
  const [animating, setAnimating] = useState(false)
  const runIdRef = useRef(0)
  const controlsRef = useRef(null)
  const spinningRef = useRef(false)
  const animatingRef = useRef(false)
  const dragPhaseRef = useRef('idle')
  const committedIndexRef = useRef(0)
  const gestureStartIndexRef = useRef(0)
  const incomingIndexRef = useRef(null)
  const dragRef = useRef({
    startX: 0,
    rawDx: 0,
    moved: 0,
    lastX: 0,
    lastT: 0,
    vx: 0,
    pointerId: null,
  })
  const wheelSnapRef = useRef(0)
  const snapAnimRef = useRef(null)

  const commitIndex = useCallback((nextIndex) => {
    const wrapped = wrapIndex(nextIndex, dishes.length)
    committedIndexRef.current = wrapped
    gestureStartIndexRef.current = wrapped
    setCommittedIndexState(wrapped)
    setGestureStartIndex(wrapped)
    return wrapped
  }, [])

  const setPhase = (phase) => {
    dragPhaseRef.current = phase
    setDragPhase(phase)
  }

  const stopControls = () => {
    controlsRef.current?.stop()
    controlsRef.current = null
  }

  const stopSnap = () => {
    snapAnimRef.current?.stop()
    snapAnimRef.current = null
  }

  const clearDragMotion = useCallback(() => {
    incomingIndexRef.current = null
    setIncomingIndex(null)
    dragRef.current.rawDx = 0
    dragRef.current.moved = 0
    dragRef.current.vx = 0
    dragRef.current.pointerId = null
  }, [])

  const snapToIndex = useCallback(
    (index) => {
      if (spinningRef.current) return
      if (dragPhaseRef.current !== 'idle') return
      const i = commitIndex(index)
      const target = nearestFacing(rotation.get(), i, dishes.length)
      stopControls()
      if (reduceMotion) {
        rotation.set(target)
        animatingRef.current = false
        setAnimating(false)
        return
      }
      animatingRef.current = true
      setAnimating(true)
      const anim = animate(rotation, target, {
        type: 'spring',
        stiffness: 240,
        damping: 28,
        mass: 0.85,
      })
      controlsRef.current = anim
      const finish = () => {
        commitIndex(i)
        animatingRef.current = false
        setAnimating(false)
      }
      anim.then(finish).catch(finish)
    },
    [commitIndex, reduceMotion, rotation],
  )

  const snapToNearest = useCallback(() => {
    if (dragPhaseRef.current !== 'idle') return
    snapToIndex(frontIndexFromRotation(rotation.get(), dishes.length))
  }, [rotation, snapToIndex])

  const nudge = useCallback(
    (dir) => {
      if (spinningRef.current) return
      if (dragPhaseRef.current !== 'idle') return
      snapToIndex(committedIndexRef.current + dir)
    },
    [snapToIndex],
  )

  const selectCard = useCallback(
    (index) => {
      if (spinningRef.current) return
      if (dragPhaseRef.current !== 'idle') return
      if (dragRef.current.moved > 8) return
      snapToIndex(index)
    },
    [snapToIndex],
  )

  const finishIdle = useCallback(() => {
    clearDragMotion()
    visualProgress.set(0)
    rubberX.set(0)
    dragLive.set(0)
    setPhase('idle')
    publishQa({
      dragPhase: 'idle',
      isDragging: false,
      isSnapping: false,
      visualProgress: 0,
      rawDragX: 0,
      incomingIndex: null,
      committedIndex: committedIndexRef.current,
      startIndex: gestureStartIndexRef.current,
    })
  }, [clearDragMotion, dragLive, rubberX, visualProgress])

  useLayoutEffect(() => {
    if (dragPhase !== 'idle') return
    visualProgress.set(0)
    rubberX.set(0)
    dragLive.set(0)
  }, [dragLive, dragPhase, rubberX, visualProgress])

  const animateProgressTo = useCallback(
    (target, onDone) => {
      stopSnap()
      rubberX.set(0)
      if (reduceMotion || Math.abs(visualProgress.get() - target) < 0.001) {
        visualProgress.set(target)
        onDone()
        return
      }
      const anim = animate(visualProgress, target, {
        type: 'spring',
        stiffness: 320,
        damping: 34,
        mass: 0.7,
        restDelta: 0.001,
        restSpeed: 0.01,
      })
      snapAnimRef.current = anim
      const finish = () => {
        visualProgress.set(target)
        snapAnimRef.current = null
        onDone()
      }
      anim.then(finish).catch(finish)
    },
    [reduceMotion, rubberX, visualProgress],
  )

  const onPointerDown = useCallback(
    (event) => {
      if (spinningRef.current) return
      if (dragPhaseRef.current !== 'idle') return
      if (event.pointerType === 'mouse' && event.button !== 0) return
      stopControls()
      stopSnap()
      const startIndex = committedIndexRef.current
      gestureStartIndexRef.current = startIndex
      incomingIndexRef.current = null
      if (import.meta.env.DEV && gestureStartIndexRef.current !== committedIndexRef.current) {
        console.error('[fo2] gesture must start from committed index')
      }
      dragRef.current = {
        startX: event.clientX,
        rawDx: 0,
        moved: 0,
        lastX: event.clientX,
        lastT: event.timeStamp,
        vx: 0,
        pointerId: event.pointerId,
      }
      visualProgress.set(0)
      rubberX.set(0)
      dragLive.set(1)
      setGestureStartIndex(startIndex)
      setIncomingIndex(null)
      setPhase('dragging')
      publishQa({
        dragPhase: 'dragging',
        isDragging: true,
        isSnapping: false,
        visualProgress: 0,
        rawDragX: 0,
        incomingIndex: null,
        committedIndex: startIndex,
        startIndex,
      })
    },
    [dragLive, rubberX, visualProgress],
  )

  const onPointerMove = useCallback(
    (event) => {
      if (dragLive.get() !== 1 || spinningRef.current) return
      const drag = dragRef.current
      const rawDx = event.clientX - drag.startX
      const dt = event.timeStamp - drag.lastT
      if (dt > 0) drag.vx = (event.clientX - drag.lastX) / dt
      drag.lastX = event.clientX
      drag.lastT = event.timeStamp
      drag.rawDx = rawDx
      drag.moved = Math.max(drag.moved, Math.abs(rawDx))

      const progress = clamp(rawDx / DRAG_DISTANCE, -1, 1)
      const incoming = neighborFromProgress(gestureStartIndexRef.current, progress, dishes.length)
      visualProgress.set(progress)
      rubberX.set(Math.abs(progress) >= 1 ? rubberTranslation(rawDx) : 0)

      if (incoming !== incomingIndexRef.current) {
        incomingIndexRef.current = incoming
        setIncomingIndex(incoming)
      }

      if (import.meta.env.DEV) {
        publishQa({
          dragPhase: 'dragging',
          isDragging: true,
          isSnapping: false,
          visualProgress: progress,
          rawDragX: rawDx,
          incomingIndex: incoming,
          committedIndex: committedIndexRef.current,
          startIndex: gestureStartIndexRef.current,
        })
      }
    },
    [dragLive, rubberX, visualProgress],
  )

  const endDrag = useCallback(() => {
    if (dragPhaseRef.current !== 'dragging') return

    const drag = dragRef.current
    const rawDx = drag.rawDx
    const moved = drag.moved
    const vx = drag.vx
    const startIndex = gestureStartIndexRef.current

    const flick = Math.abs(vx) >= FLICK_PX_PER_MS
    const far = Math.abs(rawDx) >= COMMIT_PX
    let dir = 0
    if (moved > 0 && far) dir = rawDx > 0 ? -1 : 1
    else if (moved > 0 && flick) dir = vx > 0 ? -1 : 1

    if (dir === 0) {
      setPhase('snap-back')
      animateProgressTo(0, finishIdle)
      return
    }

    const next = wrapIndex(startIndex + dir, dishes.length)
    incomingIndexRef.current = next
    setIncomingIndex(next)
    rotation.set(facingRotation(next, dishes.length))
    commitIndex(next)
    visualProgress.set(0)
    rubberX.set(0)
    dragLive.set(0)
    finishIdle()
  }, [animateProgressTo, commitIndex, dragLive, finishIdle, rotation, rubberX, visualProgress])

  const onWheelDelta = useCallback(
    (delta) => {
      if (spinningRef.current) return
      if (dragPhaseRef.current !== 'idle') return
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
    if (dragPhaseRef.current !== 'idle') return
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
      commitIndex(winIndex)
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
      commitIndex(winIndex)
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
  }, [commitIndex, reduceMotion, rotation])

  useEffect(() => {
    const onBlur = () => {
      if (dragPhaseRef.current === 'dragging') endDrag()
    }
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('blur', onBlur)
      runIdRef.current += 1
      controlsRef.current?.stop()
      stopSnap()
      window.clearTimeout(wheelSnapRef.current)
    }
  }, [endDrag])

  const dragging = dragPhase !== 'idle'

  return {
    dishes,
    rotation,
    visualProgress,
    rubberX,
    dragLive,
    status,
    winner,
    frontIndex: committedIndex,
    dragPhase,
    gestureStartIndex,
    incomingIndex,
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
