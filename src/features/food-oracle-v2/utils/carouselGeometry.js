export const LAYOUTS = {
  desktop: {
    cardW: 308,
    cardH: 412,
    spacing: 118,
    rotate: 22,
    depth: 96,
    y: 8,
    maxDist: 3.35,
    perspective: 1560,
    scales: [1, 0.9, 0.8, 0.72],
    opacities: [1, 0.84, 0.58, 0.34],
    brightness: [1, 0.78, 0.6, 0.46],
  },
  laptop: {
    cardW: 276,
    cardH: 372,
    spacing: 108,
    rotate: 20,
    depth: 78,
    y: 6,
    maxDist: 3.2,
    perspective: 1380,
    scales: [1, 0.9, 0.8, 0.72],
    opacities: [1, 0.84, 0.56, 0.32],
    brightness: [1, 0.78, 0.6, 0.46],
  },
  tablet: {
    cardW: 248,
    cardH: 334,
    spacing: 112,
    rotate: 17,
    depth: 54,
    y: 6,
    maxDist: 2.4,
    perspective: 1180,
    scales: [1, 0.9, 0.8, 0.72],
    opacities: [1, 0.84, 0.58, 0.32],
    brightness: [1, 0.78, 0.62, 0.48],
  },
  mobile: {
    cardW: 228,
    cardH: 308,
    spacing: 104,
    rotate: 14,
    depth: 36,
    y: 0,
    maxDist: 1.35,
    perspective: 900,
    scales: [1, 0.88, 0.78, 0.7],
    opacities: [1, 0.78, 0.42, 0.2],
    brightness: [1, 0.82, 0.6, 0.45],
  },
}

export function getLayout({ isMobile, isTablet, isShort }) {
  if (isMobile) return LAYOUTS.mobile
  if (isTablet) return LAYOUTS.tablet
  if (isShort) return LAYOUTS.laptop
  return LAYOUTS.desktop
}

export function wrapIndex(index, count) {
  return ((index % count) + count) % count
}

export function floatIndexFromRotation(rotation, count) {
  return -rotation / (360 / count)
}

export function wrapOffset(index, floatIndex, count) {
  let offset = index - floatIndex
  const half = count / 2
  while (offset > half) offset -= count
  while (offset <= -half) offset += count
  return offset
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function sample(stops, dist) {
  if (dist <= 0) return stops[0]
  if (dist >= 3) return stops[3]
  const i = Math.floor(dist)
  const t = dist - i
  return lerp(stops[i], stops[Math.min(3, i + 1)], t)
}

export function coverflowPose(offset, layout) {
  const dist = Math.abs(offset)
  if (dist > layout.maxDist) {
    return {
      visible: false,
      interactive: false,
      x: 0,
      y: 0,
      z: -400,
      rotateY: 0,
      scale: 0.7,
      opacity: 0,
      brightness: 0.4,
      zIndex: 0,
    }
  }

  return {
    visible: true,
    interactive: dist < 1.2,
    x: offset * layout.spacing,
    y: layout.y + dist * 6,
    z: -dist * layout.depth,
    rotateY: -offset * layout.rotate,
    scale: sample(layout.scales, dist),
    opacity: sample(layout.opacities, dist),
    brightness: sample(layout.brightness, dist),
    zIndex: Math.round((layout.maxDist - dist) * 20),
  }
}

export function getCardPose(relativeOffset, layout) {
  return coverflowPose(relativeOffset, layout)
}

export function interpolatePose(from, to, t) {
  const u = Math.min(1, Math.max(0, t))
  return {
    visible: true,
    interactive: false,
    x: lerp(from.x, to.x, u),
    y: lerp(from.y, to.y, u),
    z: lerp(from.z, to.z, u),
    rotateY: lerp(from.rotateY, to.rotateY, u),
    scale: lerp(from.scale, to.scale, u),
    opacity: lerp(from.opacity, to.opacity, u),
    brightness: lerp(from.brightness, to.brightness, u),
    zIndex: Math.round(lerp(from.zIndex, to.zIndex, u)),
  }
}

export function twoCardPoses(visualProgress, layout, rubberX = 0) {
  const center = getCardPose(0, layout)
  const p = Math.min(1, Math.abs(visualProgress))
  if (p === 0 || visualProgress === 0) {
    return {
      p: 0,
      sideSign: 0,
      outgoing: { ...center, interactive: false },
      incoming: null,
    }
  }

  const sideSign = visualProgress > 0 ? 1 : -1
  const outgoingSide = getCardPose(sideSign, layout)
  const incomingSide = getCardPose(-sideSign, layout)
  const outgoing = interpolatePose(center, outgoingSide, p)
  const incoming = interpolatePose(incomingSide, center, p)
  if (rubberX) {
    outgoing.x += rubberX
    incoming.x += rubberX
  }
  outgoing.interactive = false
  incoming.interactive = false

  if (p < 0.5) {
    outgoing.zIndex = 80
    incoming.zIndex = 40
  } else {
    outgoing.zIndex = outgoingSide.zIndex
    incoming.zIndex = 200
  }

  return { p, sideSign, outgoing, incoming }
}

function distanceBucket(dist) {
  if (dist > 1.55) return '2'
  if (dist > 0.55) return '1'
  return '0'
}

export function applyPoseStyle(el, pose, conf = {}) {
  if (!el) return
  const { hide = false, freezeChrome = false, dist = 1, interactive } = conf
  if (hide || !pose || !pose.visible) {
    el.style.visibility = 'hidden'
    el.style.pointerEvents = 'none'
    el.style.opacity = '0'
    el.style.filter = 'none'
    el.style.zIndex = '0'
    el.style.transform = 'translate3d(0,0,-480px) scale(0.9)'
    el.dataset.fo2Scale = '0'
    return
  }

  if (!freezeChrome) {
    el.dataset.distance = distanceBucket(dist)
  }

  const canClick = interactive ?? pose.interactive
  el.style.visibility = 'visible'
  el.style.pointerEvents = canClick ? 'auto' : 'none'
  el.style.opacity = String(pose.opacity)
  el.style.zIndex = String(pose.zIndex)
  el.style.filter = pose.brightness >= 0.98 ? 'none' : `brightness(${pose.brightness})`
  el.style.transform = `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateY(${pose.rotateY}deg) scale(${pose.scale})`
  el.dataset.fo2Scale = String(pose.scale)
}

export function applyCardPose(el, rotation, conf) {
  if (!el) return
  const { index, count, layout, hideIndex, freezeChrome } = conf
  const floatIndex = floatIndexFromRotation(rotation, count)
  const offset = wrapOffset(index, floatIndex, count)
  const pose = getCardPose(offset, layout)
  applyPoseStyle(el, pose, {
    hide: index === hideIndex,
    freezeChrome,
    dist: Math.abs(offset),
  })
}

export function applyFrozenTrackCard(el, conf) {
  if (!el) return
  const { index, count, layout, startIndex, hideSet, visualProgress = 0 } = conf
  const floatIndex = startIndex - visualProgress
  const offset = wrapOffset(index, floatIndex, count)
  const pose = getCardPose(offset, layout)
  const hide = hideSet.has(index) || Math.abs(offset) < 0.5
  applyPoseStyle(el, pose, {
    hide,
    freezeChrome: true,
    dist: Math.abs(offset),
    interactive: false,
  })
}

export function applyOverlayPose(el, pose, haloEl) {
  if (!el) return
  if (!pose) {
    applyPoseStyle(el, null, { hide: true })
    return
  }
  applyPoseStyle(el, pose, {
    hide: false,
    freezeChrome: true,
    dist: pose.scale >= 0.98 ? 0 : 1,
    interactive: false,
  })
  el.style.filter = 'none'
  if (haloEl) {
    const glow = pose.scale >= 0.98 ? 1 : 0
    haloEl.style.opacity = String(glow)
  }
}

export function neighborFromProgress(startIndex, visualProgress, count) {
  if (visualProgress > 0) return wrapIndex(startIndex - 1, count)
  if (visualProgress < 0) return wrapIndex(startIndex + 1, count)
  return null
}
