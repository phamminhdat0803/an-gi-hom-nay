function Steam({ x = 80, y = 36 }) {
  return (
    <g fill="none" stroke="rgba(243,230,208,0.42)" strokeWidth="1.4" strokeLinecap="round">
      <path d={`M${x - 10} ${y + 18}c0-8 4-10 4-18`} />
      <path d={`M${x} ${y + 14}c0-9 5-11 3-20`} />
      <path d={`M${x + 10} ${y + 18}c0-8 3-10 5-17`} />
    </g>
  )
}

function Bowl({ fill = '#2a1810', rim = '#c49a52', broth = '#8a4a1c' }) {
  return (
    <g>
      <ellipse cx="80" cy="124" rx="54" ry="10" fill="rgba(0,0,0,0.38)" />
      <path d="M24 86c3 34 26 50 56 50s53-16 56-50" fill={fill} />
      <path d="M26 86c2 8 24 14 54 14s52-6 54-14c-2-10-22-18-54-18s-52 8-54 18z" fill={broth} />
      <ellipse cx="80" cy="84" rx="54" ry="16" fill="none" stroke={rim} strokeWidth="1.35" opacity="0.55" />
      <ellipse cx="80" cy="80" rx="22" ry="6" fill="rgba(243,230,208,0.16)" />
    </g>
  )
}

function Plate() {
  return (
    <g>
      <ellipse cx="80" cy="122" rx="58" ry="12" fill="rgba(0,0,0,0.32)" />
      <ellipse cx="80" cy="108" rx="60" ry="18" fill="#d9c4a0" />
      <ellipse cx="80" cy="106" rx="48" ry="13" fill="#efe3cc" />
    </g>
  )
}

function Herb({ x, y, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 8c4-8 8-8 12 0" fill="#3f6a32" />
      <path d="M2 7c3-7 7-7 10 1" fill="#5c8a3e" />
    </g>
  )
}

function PhoBo() {
  return (
    <g>
      <Bowl broth="#b56a28" />
      <Steam />
      <path d="M40 84c18 6 28-8 50-2 14 4 22 2 30-4" fill="none" stroke="#e8d2a8" strokeWidth="2.2" />
      <path d="M38 90c20 4 32-6 48 1 16 5 28 0 36-5" fill="none" stroke="#d9c08e" strokeWidth="2" />
      <path d="M48 78c8 2 14-6 24-2" fill="none" stroke="#6b2a16" strokeWidth="5" strokeLinecap="round" />
      <path d="M86 76c8 1 12-5 22-1" fill="none" stroke="#5a2212" strokeWidth="5" strokeLinecap="round" />
      <Herb x={44} y={70} rot={-20} />
      <Herb x={108} y={68} rot={18} />
    </g>
  )
}

function BunCha() {
  return (
    <g>
      <Plate />
      <rect x="48" y="78" width="18" height="22" rx="6" fill="#5a2a14" />
      <rect x="70" y="74" width="18" height="24" rx="6" fill="#6b3216" />
      <rect x="92" y="78" width="18" height="22" rx="6" fill="#4e2410" />
      <path d="M42 96c10 10 28 12 38 2" fill="none" stroke="#d8c48c" strokeWidth="2" />
      <ellipse cx="118" cy="96" rx="16" ry="10" fill="#7a2e14" />
      <Herb x={36} y={70} />
    </g>
  )
}

function ComTam() {
  return (
    <g>
      <Plate />
      <ellipse cx="80" cy="96" rx="40" ry="16" fill="#f0e0b8" />
      <ellipse cx="80" cy="92" rx="34" ry="12" fill="#fff6d6" />
      <path d="M52 88c8-10 18-8 20 2 6-12 16-10 20 1 4-9 14-8 18 3" fill="#6a3214" />
      <ellipse cx="108" cy="90" rx="10" ry="8" fill="#e8c04a" />
      <ellipse cx="50" cy="98" rx="8" ry="5" fill="#3f6a32" />
    </g>
  )
}

function BanhMi() {
  return (
    <g>
      <ellipse cx="80" cy="122" rx="50" ry="10" fill="rgba(0,0,0,0.3)" />
      <path d="M28 96c8-22 96-22 104 0-6 16-18 22-52 22s-46-6-52-22z" fill="#d4a04a" />
      <path d="M36 94c8-14 80-14 88 0-4 4-20 6-44 6s-40-2-44-6z" fill="#f0d090" />
      <path d="M48 90c4-6 12-6 16 0M76 88c4-6 12-6 16 1M104 90c3-5 10-5 14 0" fill="none" stroke="#b47a28" strokeWidth="1.3" />
      <path d="M50 100c10 2 20-6 30 0 8 4 18 2 28-2" fill="#6b2a14" />
      <path d="M58 98c8 0 14-6 22-2" fill="#3f6a32" />
    </g>
  )
}

function BunBoHue() {
  return (
    <g>
      <Bowl fill="#3a1410" broth="#c43a22" rim="#e0b25a" />
      <Steam x={82} y={32} />
      <path d="M42 86c16 4 24-6 40 0 14 4 26-2 34-6" fill="none" stroke="#ead7a8" strokeWidth="2.1" />
      <path d="M50 78c6 1 10-4 16-1" fill="none" stroke="#7a1f14" strokeWidth="6" strokeLinecap="round" />
      <circle cx="108" cy="84" r="5" fill="#e44527" />
      <Herb x={40} y={68} rot={-30} />
    </g>
  )
}

function BanhXeo() {
  return (
    <g>
      <Plate />
      <path d="M36 104c4-32 84-32 88 0-2 8-18 14-44 14s-42-6-44-14z" fill="#e8b23a" />
      <path d="M40 102c6-22 74-22 80 0-20 6-58 6-80 0z" fill="#f5d06a" />
      <path d="M70 92c8 8 18 8 28 0" fill="none" stroke="#6b3210" strokeWidth="1.4" />
      <path d="M58 96c6 4 12 2 18-2" fill="#3f6a32" />
      <circle cx="96" cy="94" r="4" fill="#d74427" />
    </g>
  )
}

function HuTieu() {
  return (
    <g>
      <Bowl fill="#2a1c14" broth="#c4a06a" />
      <Steam />
      <path d="M40 86c18 8 30-6 52 2 12 4 22 0 30-6" fill="none" stroke="#efe4c4" strokeWidth="2.4" />
      <path d="M46 92c14 4 28-4 40 2" fill="none" stroke="#e4d3a4" strokeWidth="2" />
      <circle cx="70" cy="80" r="4" fill="#7a3e12" />
      <circle cx="96" cy="78" r="3.5" fill="#3f6a32" />
    </g>
  )
}

function BanhCuon() {
  return (
    <g>
      <Plate />
      <rect x="40" y="82" width="80" height="16" rx="8" fill="#efe6d4" />
      <rect x="44" y="90" width="80" height="16" rx="8" fill="#e4d8c0" />
      <rect x="38" y="98" width="80" height="16" rx="8" fill="#efe6d4" />
      <path d="M50 90h48M48 98h52M54 106h40" stroke="#6b3214" strokeWidth="1.1" opacity="0.45" />
      <Herb x={112} y={70} rot={20} />
    </g>
  )
}

function GoiCuon() {
  return (
    <g>
      <Plate />
      <rect x="44" y="78" width="22" height="44" rx="10" fill="#6f9a4a" />
      <rect x="70" y="74" width="22" height="48" rx="10" fill="#5c8a3e" />
      <rect x="96" y="78" width="22" height="44" rx="10" fill="#7aaa52" />
      <path d="M50 90c4 8 8 8 12 0M76 88c4 10 8 10 12 0M102 90c4 8 8 8 12 0" fill="none" stroke="#f3e6cf" strokeWidth="1.3" />
      <path d="M54 100c6 0 8-6 12-2" fill="#d74427" />
    </g>
  )
}

function BunThitNuong() {
  return (
    <g>
      <Bowl broth="#c9b48a" fill="#2c1a12" />
      <path d="M38 88c20 6 30-8 52 0 14 4 24 0 34-6" fill="none" stroke="#efe3c4" strokeWidth="2.2" />
      <path d="M54 76c8 2 12-6 20-1" fill="none" stroke="#5a2410" strokeWidth="6" strokeLinecap="round" />
      <path d="M86 74c8 2 12-6 20-1" fill="none" stroke="#6b2e12" strokeWidth="6" strokeLinecap="round" />
      <circle cx="72" cy="92" r="3" fill="#e8c04a" />
      <circle cx="98" cy="90" r="3" fill="#e8c04a" />
      <Herb x={40} y={66} rot={-16} />
    </g>
  )
}

function MiQuang() {
  return (
    <g>
      <Bowl broth="#d4892a" fill="#32180e" />
      <path d="M36 86c22 8 34-8 56 2 16 6 28-2 36-8" fill="none" stroke="#f0c45a" strokeWidth="2.6" />
      <path d="M42 92c18 4 28-6 46 2" fill="none" stroke="#e8b23a" strokeWidth="2.2" />
      <ellipse cx="70" cy="78" rx="10" ry="5" fill="#e8dcc8" />
      <path d="M96 76c6 1 10-4 16 0" fill="none" stroke="#c45a28" strokeWidth="5" strokeLinecap="round" />
      <Herb x={44} y={64} />
    </g>
  )
}

function ComGa() {
  return (
    <g>
      <Plate />
      <ellipse cx="80" cy="96" rx="38" ry="16" fill="#f0d56a" />
      <path d="M58 88c8-14 20-10 22 2 8-16 24-12 26 4 2-8 12-8 16 2" fill="#c47a32" />
      <path d="M54 96c10 8 28 8 40-2" fill="#3f6a32" />
      <ellipse cx="108" cy="100" rx="8" ry="5" fill="#d74427" />
    </g>
  )
}

function Lau() {
  return (
    <g>
      <ellipse cx="80" cy="126" rx="56" ry="11" fill="rgba(0,0,0,0.38)" />
      <path d="M28 90c4 36 24 52 52 52s48-16 52-52" fill="#4a1c14" />
      <path d="M32 90c3 10 22 16 48 16s45-6 48-16c-3-14-22-22-48-22s-45 8-48 22z" fill="#a92d1d" />
      <ellipse cx="80" cy="86" rx="48" ry="14" fill="none" stroke="#c99a4d" strokeWidth="2" />
      <Steam x={80} y={28} />
      <circle cx="62" cy="86" r="5" fill="#3f6a32" />
      <circle cx="92" cy="82" r="4" fill="#e8dcc8" />
      <circle cx="108" cy="88" r="4" fill="#d4892a" />
    </g>
  )
}

function BunRieu() {
  return (
    <g>
      <Bowl broth="#c45a3a" fill="#3a1412" />
      <Steam />
      <path d="M40 88c18 6 28-6 46 2 14 5 26 0 34-6" fill="none" stroke="#ead2a8" strokeWidth="2" />
      <circle cx="70" cy="80" r="7" fill="#e8dcc8" />
      <circle cx="70" cy="80" r="3" fill="#c43a22" />
      <circle cx="102" cy="84" r="5" fill="#7a2e24" />
      <Herb x={46} y={66} rot={-12} />
    </g>
  )
}

const ARTS = {
  'pho-bo': PhoBo,
  'bun-cha': BunCha,
  'com-tam': ComTam,
  'banh-mi': BanhMi,
  'bun-bo-hue': BunBoHue,
  'banh-xeo': BanhXeo,
  'hu-tieu': HuTieu,
  'banh-cuon': BanhCuon,
  'goi-cuon': GoiCuon,
  'bun-thit-nuong': BunThitNuong,
  'mi-quang': MiQuang,
  'com-ga': ComGa,
  lau: Lau,
  'bun-rieu': BunRieu,
}

export function DishArt({ id }) {
  const Art = ARTS[id] ?? PhoBo
  return (
    <svg
      className="food-visual-art"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <Art />
    </svg>
  )
}
