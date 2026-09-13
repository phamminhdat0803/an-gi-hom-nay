import royalFrame from '../../../assets/card/royal-frame.png'
import royalPattern from '../../../assets/card/royal-pattern.png'

export function RoyalCardShell({ children }) {
  return (
    <div className="fo2-royal-shell">
      <div className="fo2-royal-surface">
        <div
          className="fo2-royal-pattern"
          aria-hidden="true"
          style={{ backgroundImage: `url(${royalPattern})` }}
        />
        {children}
      </div>
      <span className="fo2-royal-inner-light" aria-hidden="true" />
      <img
        className="fo2-royal-frame"
        src={royalFrame}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </div>
  )
}
