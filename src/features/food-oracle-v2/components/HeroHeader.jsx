import { motion, useReducedMotion } from 'motion/react'

export function HeroHeader() {
  const reduceMotion = useReducedMotion()

  return (
    <header className="fo2-header">
      <motion.p
        className="fo2-eyebrow"
        initial={reduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.45, delay: 0, ease: [0.22, 0.8, 0.22, 1] }}
      >
        Hôm nay ăn gì
      </motion.p>
      <motion.h1
        className="fo2-title"
        initial={reduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 0.8, 0.22, 1] }}
      >
        Chưa biết ăn gì?
      </motion.h1>
    </header>
  )
}
