export const CARD_W = 248
export const CARD_H = 332
export const CARD_W_MOBILE = 168
export const CARD_H_MOBILE = 228
export const TILT_X = -7
export const TILT_X_TABLET = -5
export const PERSPECTIVE = 1680
export const PERSPECTIVE_MOBILE = 980
export const DRAG_PX_PER_CARD = 108
export const SPIN_EXTRA_TURNS = 1
export const COVERFLOW_GAP = 148
export const ACTIVE_SCALE = 1.02
export const ACTIVE_POPOUT = 24
export const RING_SLOT_GAP = 8
export const RING_RADIUS_SCALE = 0.7

export function pickWeighted(list) {
  const total = list.reduce((sum, item) => sum + (item.weight ?? 1), 0)
  let ticket = Math.random() * total
  for (const item of list) {
    ticket -= item.weight ?? 1
    if (ticket <= 0) return item
  }
  return list[list.length - 1]
}

export function stepDeg(count) {
  return 360 / count
}

export function ringRadius(count, cardW = CARD_W, scale = ACTIVE_SCALE, gap = RING_SLOT_GAP) {
  const halfAngle = Math.PI / count
  const halfSlot = (cardW * scale) / 2 + gap / 2
  return Math.round(halfSlot / Math.tan(halfAngle))
}

export function shortestDeg(deg) {
  const a = ((deg % 360) + 360) % 360
  return a > 180 ? a - 360 : a
}

export function nearestFacing(current, index, count) {
  const wantMod = ((facingRotation(index, count) % 360) + 360) % 360
  const curMod = ((current % 360) + 360) % 360
  let delta = wantMod - curMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return current + delta
}

export function facingRotation(index, count) {
  return -index * stepDeg(count)
}

export function frontIndexFromRotation(rotation, count) {
  const step = stepDeg(count)
  const idx = Math.round(-rotation / step)
  return ((idx % count) + count) % count
}

export function clockwiseTarget(current, winnerIndex, count, extraTurns = 4) {
  const want = facingRotation(winnerIndex, count)
  const curMod = ((current % 360) + 360) % 360
  const wantMod = ((want % 360) + 360) % 360
  let travel = (curMod - wantMod + 360) % 360
  if (travel < 28) travel += 360
  travel += extraTurns * 360
  return current - travel
}
