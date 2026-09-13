import { motion, useReducedMotion } from 'motion/react'

function Leaves({ flip = false }) {
  return (
    <svg
      className={flip ? 'oracle-decor-svg is-flip' : 'oracle-decor-svg'}
      viewBox="0 0 220 420"
      fill="none"
      aria-hidden="true"
    >
      <g opacity="0.42">
        <path
          d="M40 380c20-90 8-170 40-250 18-46 48-80 86-110"
          stroke="#2f4a22"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M78 160c28-40 62-38 86-8-30 18-58 10-86 8z" fill="#3d5c2c" />
        <path d="M62 210c34-36 70-28 88 8-32 12-62 4-88-8z" fill="#2f4a22" />
        <path d="M52 268c30-30 64-22 78 12-28 10-54 2-78-12z" fill="#4a6a34" />
        <path d="M48 318c24-24 54-18 66 10-22 8-46 2-66-10z" fill="#314d24" />
        <ellipse cx="168" cy="58" rx="18" ry="10" fill="#c99a4d" opacity="0.18" />
      </g>
    </svg>
  )
}

function Lantern() {
  return (
    <svg className="oracle-decor-svg oracle-lantern" viewBox="0 0 80 140" fill="none" aria-hidden="true">
      <path d="M40 8v16" stroke="#c99a4d" strokeWidth="1.4" />
      <rect x="22" y="24" width="36" height="8" rx="1" fill="#8a6a32" />
      <path d="M20 32c2 40 6 52 20 52s18-12 20-52" fill="#a92d1d" />
      <path d="M24 40h32" stroke="#efc56f" strokeWidth="0.8" opacity="0.5" />
      <path d="M26 54h28" stroke="#efc56f" strokeWidth="0.8" opacity="0.35" />
      <rect x="28" y="84" width="24" height="6" rx="1" fill="#8a6a32" />
      <path d="M32 90c2 10 6 16 8 22M48 90c-2 10-6 16-8 22" stroke="#c99a4d" strokeWidth="1" />
    </svg>
  )
}

function Chopsticks() {
  return (
    <svg className="oracle-decor-svg oracle-sticks" viewBox="0 0 90 180" fill="none" aria-hidden="true">
      <rect x="28" y="88" width="34" height="54" rx="6" fill="#1a100c" stroke="#c99a4d" strokeWidth="1" opacity="0.55" />
      <path d="M38 88V36M52 88V28" stroke="#c49a52" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function TableEdge() {
  return (
    <svg className="oracle-decor-table" viewBox="0 0 1200 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 90c180-40 420-50 600-50s420 10 600 50v70H0z" fill="#120b07" />
      <path d="M0 90c180-40 420-50 600-50s420 10 600 50" fill="none" stroke="rgba(201,154,77,0.18)" strokeWidth="2" />
    </svg>
  )
}

export function AmbientBackground({ tone = '#6f2f18', glowX = 0, revealed = false }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="oracle-atmosphere" aria-hidden="true">
      <div className="oracle-atmosphere-base" />
      <div className="oracle-atmosphere-olive" />
      <motion.div
        className="oracle-atmosphere-glow"
        animate={
          reduceMotion
            ? { x: 0, opacity: 0.28 }
            : {
                x: glowX,
                opacity: revealed ? 0.4 : 0.26,
              }
        }
        transition={{ duration: 0.45, ease: [0.2, 0, 0, 1] }}
        style={{ backgroundColor: tone }}
      />
      <div className="oracle-atmosphere-side is-left" />
      <div className="oracle-atmosphere-side is-right" />
      <div className="oracle-atmosphere-burgundy" />
      <div className="oracle-atmosphere-vignette" />
      <div className="oracle-atmosphere-haze" />
      <div className="oracle-atmosphere-grain" />

      <div className="oracle-decor oracle-decor-left">
        <Leaves />
        <Lantern />
        <p className="oracle-sign">
          Ăn ngon
          <span>Sống vui</span>
        </p>
      </div>
      <div className="oracle-decor oracle-decor-right">
        <Leaves flip />
        <Chopsticks />
        <p className="oracle-sign oracle-sign-right">
          Vị Việt
          <span>mỗi ngày</span>
        </p>
      </div>
      <div className="oracle-decor-bottom">
        <TableEdge />
        <div className="oracle-cup" />
      </div>
    </div>
  )
}
