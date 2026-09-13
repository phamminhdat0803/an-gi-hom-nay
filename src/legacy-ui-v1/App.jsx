import { motion } from 'motion/react'
import { AmbientBackground } from './components/AmbientBackground'
import { DishReel } from './components/DishReel'
import { ResultCard } from './components/ResultCard'
import { SpinButton } from './components/SpinButton'
import { useDishSpin } from './hooks/useDishSpin'

function padIndex(n) {
  return String(n).padStart(2, '0')
}

function App() {
  const {
    dishes,
    rotation,
    status,
    winner,
    frontIndex,
    spinning,
    dragging,
    settled,
    spin,
    nudge,
    selectCard,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheelDelta,
  } = useDishSpin()
  const facing = dishes[frontIndex]
  const revealed = status === 'done' && Boolean(winner)

  return (
    <main className="oracle">
      <AmbientBackground
        tone={facing?.tone ?? '#6f2f18'}
        glowX={(frontIndex - (dishes.length - 1) / 2) * 10}
        revealed={revealed}
      />

      <header className="oracle-header">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="oracle-eyebrow"
        >
          <span className="oracle-eyebrow-rule" aria-hidden="true" />
          Hôm nay ăn gì
          <span className="oracle-eyebrow-rule" aria-hidden="true" />
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0, 0, 1] }}
          className="oracle-title"
        >
          Chưa biết ăn gì?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: [0.2, 0, 0, 1] }}
          className="oracle-lede"
        >
          Rút một lá. Ăn cho xong chuyện.
        </motion.p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.2, 0, 0, 1] }}
        className="oracle-hero"
        aria-label="Bói món hôm nay"
      >
        <p className="sr-only" aria-live="polite">
          {spinning
            ? 'Đang chọn món'
            : facing
              ? `Món đang ở mặt trước: ${facing.name}`
              : ''}
        </p>

        <DishReel
          dishes={dishes}
          rotation={rotation}
          spinning={spinning}
          frontIndex={frontIndex}
          winner={winner}
          dragging={dragging}
          settled={settled}
          selectCard={selectCard}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onWheelDelta={onWheelDelta}
          onNudge={nudge}
        />

        <div className="oracle-status">
          <div className="oracle-status-idle">
            <p className="oracle-hint">
              <span className="oracle-hint-full">
                ← Kéo để khám phá →
              </span>
              <span className="oracle-hint-short">Kéo để chọn món</span>
            </p>
            <p className="oracle-index" aria-hidden="true">
              {padIndex(frontIndex + 1)}
              <span> / </span>
              {padIndex(dishes.length)}
            </p>
          </div>
          <div className="sr-only">
            <ResultCard winner={revealed ? winner : null} />
          </div>
        </div>

        <SpinButton spinning={spinning} onSpin={spin} />
      </motion.section>
    </main>
  )
}

export default App
