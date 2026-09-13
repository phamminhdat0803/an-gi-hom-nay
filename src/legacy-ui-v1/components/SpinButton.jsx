import { motion } from 'motion/react'

export function SpinButton({ spinning, onSpin }) {
  const label = spinning ? 'Đang chọn…' : 'Chọn lại'

  return (
    <motion.button
      type="button"
      onClick={onSpin}
      disabled={spinning}
      aria-busy={spinning}
      whileHover={spinning ? undefined : { y: -2 }}
      whileTap={spinning ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      className="oracle-cta"
    >
      <span className="oracle-cta-mark" aria-hidden="true">
        ✦
      </span>
      <span>{label}</span>
    </motion.button>
  )
}
