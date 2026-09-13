import { motion } from 'motion/react'

export function RandomizeButton({ spinning, hasSpun, onSpin }) {
  return (
    <div className="fo2-cta-wrap">
      <motion.button
        type="button"
        className="fo2-cta"
        onClick={onSpin}
        disabled={spinning}
        aria-busy={spinning}
        aria-label={hasSpun ? 'Chọn lại món' : 'Chọn món cho tôi'}
        whileHover={spinning ? undefined : { y: -2 }}
        whileTap={spinning ? undefined : { scale: 0.985 }}
        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      >
        <span className="fo2-cta-mark" aria-hidden="true">
          ✦
        </span>
        <span>{spinning ? 'Đang chọn…' : hasSpun ? 'CHỌN LẠI' : 'CHỌN MÓN CHO TÔI'}</span>
      </motion.button>
    </div>
  )
}
