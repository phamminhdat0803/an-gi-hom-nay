import { AnimatePresence, motion } from 'motion/react'

export function ResultCard({ winner }) {
  return (
    <div className="oracle-result" aria-live="assertive" aria-atomic="true">
      <AnimatePresence>
        {winner ? (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            className="oracle-result-inner"
          >
            <p className="oracle-result-kicker">Hôm nay ăn</p>
            <p className="oracle-result-name">{winner.name}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
