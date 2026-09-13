import decorLeft from '../../../assets/decor/decor-left.png'
import decorRight from '../../../assets/decor/decor-right.png'
import foregroundTable from '../../../assets/decor/foreground-table.png'

export function CinematicScene() {
  return (
    <>
      <div className="fo2-scene" aria-hidden="true">
        <div className="fo2-bg" />
        <div className="fo2-glow" />
        <img
          src={decorLeft}
          alt=""
          draggable="false"
          className="fo2-decor fo2-decor-left"
        />
        <img
          src={decorRight}
          alt=""
          draggable="false"
          className="fo2-decor fo2-decor-right"
        />
        <div className="fo2-vignette" />
        <div className="fo2-grain" />
      </div>
      <img
        src={foregroundTable}
        alt=""
        draggable="false"
        className="fo2-table"
      />
    </>
  )
}
