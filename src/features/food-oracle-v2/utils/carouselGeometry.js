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

export function applyCardPose(el, rotation, conf) {
  if (!el) return
  const { index, count, layout, hideActive } = conf
  const floatIndex = floatIndexFromRotation(rotation, count)
  const offset = wrapOffset(index, floatIndex, count)
  const pose = coverflowPose(offset, layout)
  const isCenter = Math.abs(offset) < 0.42

  if (!pose.visible || (hideActive && isCenter)) {
    el.style.visibility = 'hidden'
    el.style.pointerEvents = 'none'
    el.style.opacity = '0'
    el.style.filter = 'none'
    el.style.transform = 'translate3d(0,0,-480px) scale(0.9)'
    return
  }

  el.style.visibility = 'visible'
  el.style.pointerEvents = pose.interactive ? 'auto' : 'none'
  el.style.opacity = String(pose.opacity)
  el.style.zIndex = String(pose.zIndex)
  el.style.filter = pose.brightness >= 0.98 ? 'none' : `brightness(${pose.brightness})`
  el.style.transform = `translate3d(${pose.x}px, ${pose.y}px, ${pose.z}px) rotateY(${pose.rotateY}deg) scale(${pose.scale})`
}
