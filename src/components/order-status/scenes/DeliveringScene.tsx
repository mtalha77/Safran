import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function DeliveringScene() {
  const copy = STAGE_COPY.delivering;

  return (
    <div className={`${styles.sceneShell} ${styles.sceneShellWide}`}>
      <svg
        className={`${styles.sceneSvg} ${styles.sceneEnter}`}
        viewBox="0 0 480 128"
        preserveAspectRatio="none"
        role="img"
        aria-label={copy.ariaLabel}
      >
        <title>{copy.ariaLabel}</title>
        <desc>{copy.ariaDescription}</desc>
        <defs>
          <linearGradient id="ose-asphalt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3438" />
            <stop offset="55%" stopColor="#2a2428" />
            <stop offset="100%" stopColor="#1c1018" />
          </linearGradient>
          <linearGradient id="ose-scooter-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a2040" />
            <stop offset="45%" stopColor="#2f0d29" />
            <stop offset="100%" stopColor="#1a0716" />
          </linearGradient>
          <linearGradient id="ose-scooter-side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ebc37d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ebc37d" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ose-tire" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#4a4246" />
            <stop offset="65%" stopColor="#1c1018" />
            <stop offset="100%" stopColor="#0a0608" />
          </radialGradient>
          <clipPath id="ose-parcel-clip">
            <rect x="146" y="44" width="52" height="36" rx="4" />
          </clipPath>
        </defs>
        <g aria-hidden="true">
          <rect x="0" y="0" width="480" height="128" fill="#f7f2eb" />

          <text
            x="240"
            y="52"
            textAnchor="middle"
            fill="#2f0d29"
            opacity="0.1"
            style={{
              fontFamily: "var(--font-caveat), 'Segoe Script', cursive",
              fontSize: 64,
              fontWeight: 600,
            }}
          >
            Safran
          </text>

          {/* seamless city skyline — tile width exactly 480 */}
          <g className={styles.roadFar}>
            <g>
              {/* block A */}
              <rect x="8" y="38" width="36" height="46" fill="#ddd4c8" />
              <rect x="14" y="44" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="24" y="44" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="14" y="56" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="24" y="56" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="18" y="72" width="10" height="12" fill="#2f0d29" opacity="0.25" />

              <rect x="50" y="28" width="28" height="56" fill="#d4cbc0" />
              <path d="M50 28h28l-14-10z" fill="#c4b8aa" />
              <rect x="56" y="36" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="36" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="56" y="48" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="48" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="56" y="60" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="60" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="86" y="44" width="42" height="40" fill="#e0d6c8" />
              <rect x="92" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="106" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="120" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="100" y="68" width="14" height="16" fill="#2f0d29" opacity="0.2" />

              <rect x="136" y="22" width="32" height="62" fill="#cfc5b8" />
              <rect x="142" y="30" width="6" height="7" fill="#ebc37d" opacity="0.45" />
              <rect x="154" y="30" width="6" height="7" fill="#ebc37d" opacity="0.45" />
              <rect x="142" y="42" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="154" y="42" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="142" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="154" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="146" y="70" width="12" height="14" fill="#1c1018" opacity="0.2" />

              <rect x="176" y="40" width="48" height="44" fill="#ddd4c8" />
              <path d="M176 40h48v6H176z" fill="#b8aea2" />
              <rect x="184" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="198" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="212" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="184" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="198" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="212" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />

              <rect x="232" y="32" width="24" height="52" fill="#d8cec0" />
              <rect x="238" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="238" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="238" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="264" y="46" width="52" height="38" fill="#e4dbcf" />
              <rect x="272" y="52" width="10" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="290" y="52" width="10" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="282" y="68" width="16" height="16" fill="#2f0d29" opacity="0.18" />
              {/* shop awning */}
              <path d="M264 46h52l-4 6H268z" fill="#2f0d29" opacity="0.55" />
              <path d="M268 52h44" stroke="#ebc37d" strokeWidth="1.2" opacity="0.5" />

              <rect x="324" y="26" width="30" height="58" fill="#cfc5b8" />
              <path d="M324 26h30v5H324z" fill="#2f0d29" opacity="0.35" />
              <rect x="330" y="36" width="6" height="7" fill="#ebc37d" opacity="0.4" />
              <rect x="342" y="36" width="6" height="7" fill="#ebc37d" opacity="0.4" />
              <rect x="330" y="48" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="342" y="48" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="330" y="60" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="342" y="60" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="332" y="72" width="14" height="12" fill="#1c1018" opacity="0.22" />

              <rect x="362" y="42" width="40" height="42" fill="#ddd4c8" />
              <rect x="370" y="50" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="386" y="50" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="370" y="64" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="386" y="64" width="8" height="9" fill="#f7f2eb" opacity="0.7" />

              <rect x="410" y="30" width="26" height="54" fill="#d4cbc0" />
              <path d="M410 30h26l-13-8z" fill="#b8aea2" />
              <rect x="416" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="416" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="416" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="444" y="48" width="28" height="36" fill="#e0d6c8" />
              <rect x="450" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="460" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="452" y="68" width="12" height="16" fill="#2f0d29" opacity="0.2" />

              {/* ground fill so no gap under buildings */}
              <rect x="0" y="84" width="480" height="2" fill="#d4cbc0" />
            </g>
            {/* exact duplicate for seamless loop */}
            <g transform="translate(480)">
              <rect x="8" y="38" width="36" height="46" fill="#ddd4c8" />
              <rect x="14" y="44" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="24" y="44" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="14" y="56" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="24" y="56" width="6" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="18" y="72" width="10" height="12" fill="#2f0d29" opacity="0.25" />

              <rect x="50" y="28" width="28" height="56" fill="#d4cbc0" />
              <path d="M50 28h28l-14-10z" fill="#c4b8aa" />
              <rect x="56" y="36" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="36" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="56" y="48" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="48" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="56" y="60" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="66" y="60" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="86" y="44" width="42" height="40" fill="#e0d6c8" />
              <rect x="92" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="106" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="120" y="50" width="8" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="100" y="68" width="14" height="16" fill="#2f0d29" opacity="0.2" />

              <rect x="136" y="22" width="32" height="62" fill="#cfc5b8" />
              <rect x="142" y="30" width="6" height="7" fill="#ebc37d" opacity="0.45" />
              <rect x="154" y="30" width="6" height="7" fill="#ebc37d" opacity="0.45" />
              <rect x="142" y="42" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="154" y="42" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="142" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="154" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="146" y="70" width="12" height="14" fill="#1c1018" opacity="0.2" />

              <rect x="176" y="40" width="48" height="44" fill="#ddd4c8" />
              <path d="M176 40h48v6H176z" fill="#b8aea2" />
              <rect x="184" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="198" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="212" y="52" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="184" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="198" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />
              <rect x="212" y="66" width="7" height="8" fill="#f7f2eb" opacity="0.7" />

              <rect x="232" y="32" width="24" height="52" fill="#d8cec0" />
              <rect x="238" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="238" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="238" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="248" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="264" y="46" width="52" height="38" fill="#e4dbcf" />
              <rect x="272" y="52" width="10" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="290" y="52" width="10" height="10" fill="#f7f2eb" opacity="0.65" />
              <rect x="282" y="68" width="16" height="16" fill="#2f0d29" opacity="0.18" />
              <path d="M264 46h52l-4 6H268z" fill="#2f0d29" opacity="0.55" />
              <path d="M268 52h44" stroke="#ebc37d" strokeWidth="1.2" opacity="0.5" />

              <rect x="324" y="26" width="30" height="58" fill="#cfc5b8" />
              <path d="M324 26h30v5H324z" fill="#2f0d29" opacity="0.35" />
              <rect x="330" y="36" width="6" height="7" fill="#ebc37d" opacity="0.4" />
              <rect x="342" y="36" width="6" height="7" fill="#ebc37d" opacity="0.4" />
              <rect x="330" y="48" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="342" y="48" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="330" y="60" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="342" y="60" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="332" y="72" width="14" height="12" fill="#1c1018" opacity="0.22" />

              <rect x="362" y="42" width="40" height="42" fill="#ddd4c8" />
              <rect x="370" y="50" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="386" y="50" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="370" y="64" width="8" height="9" fill="#f7f2eb" opacity="0.7" />
              <rect x="386" y="64" width="8" height="9" fill="#f7f2eb" opacity="0.7" />

              <rect x="410" y="30" width="26" height="54" fill="#d4cbc0" />
              <path d="M410 30h26l-13-8z" fill="#b8aea2" />
              <rect x="416" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="38" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="416" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="50" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="416" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />
              <rect x="426" y="62" width="5" height="6" fill="#f7f2eb" opacity="0.75" />

              <rect x="444" y="48" width="28" height="36" fill="#e0d6c8" />
              <rect x="450" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="460" y="54" width="6" height="7" fill="#f7f2eb" opacity="0.7" />
              <rect x="452" y="68" width="12" height="16" fill="#2f0d29" opacity="0.2" />
              <rect x="0" y="84" width="480" height="2" fill="#d4cbc0" />
            </g>
          </g>

          <rect x="0" y="84" width="480" height="10" fill="#d4cbc0" />
          <path d="M0 93h480" stroke="#b8aea2" strokeWidth="1.2" />
          <rect x="0" y="94" width="480" height="34" fill="url(#ose-asphalt)" />
          <path d="M0 95h480" stroke="#ebc37d" strokeWidth="1.3" opacity="0.55" />
          <path d="M0 126h480" stroke="#5a5256" strokeWidth="2" opacity="0.45" />
          <g className={styles.roadNear}>
            <path
              d="M8 110h22M46 110h22M84 110h22M122 110h22M160 110h22M198 110h22M236 110h22M274 110h22M312 110h22M350 110h22M388 110h22M426 110h22M464 110h22"
              stroke="#ebc37d"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M8 110h22M46 110h22M84 110h22M122 110h22M160 110h22M198 110h22M236 110h22M274 110h22M312 110h22M350 110h22M388 110h22M426 110h22M464 110h22"
              transform="translate(480)"
              stroke="#ebc37d"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>

          {/* delivery scooter — wheelie on rear axle */}
          <g className={styles.bikeWheelie}>
            <g className={styles.riderGroup}>
              {/* rear wheel */}
              <g className={styles.wheel}>
                <circle cx="176" cy="102" r="18" fill="url(#ose-tire)" />
                <circle
                  cx="176"
                  cy="102"
                  r="11"
                  fill="#cfc6ba"
                  stroke="#2f0d29"
                  strokeWidth="1.6"
                />
                <circle cx="176" cy="102" r="4" fill="#1c1018" />
                <path
                  d="M176 91v22M165 102h22M168 93l16 18M168 111l16-18"
                  stroke="#2f0d29"
                  strokeWidth="1.15"
                  opacity="0.5"
                />
              </g>

              {/* front wheel */}
              <g className={styles.wheel}>
                <circle cx="292" cy="102" r="17" fill="url(#ose-tire)" />
                <circle
                  cx="292"
                  cy="102"
                  r="10.5"
                  fill="#cfc6ba"
                  stroke="#2f0d29"
                  strokeWidth="1.6"
                />
                <circle cx="292" cy="102" r="3.8" fill="#1c1018" />
                <path
                  d="M292 91.5v21M281.5 102h21M284 93.5l16 17M284 110.5l16-17"
                  stroke="#2f0d29"
                  strokeWidth="1.15"
                  opacity="0.5"
                />
              </g>

              {/* rear mudguard */}
              <path
                d="M158 98c2-16 12-24 24-24 4 0 8 1 10 3"
                fill="none"
                stroke="#1c1018"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* delivery box / parcel — tight behind rider */}
              <g>
                <rect
                  x="144"
                  y="42"
                  width="56"
                  height="40"
                  rx="5"
                  fill="#eae2d6"
                  stroke="#1c1018"
                  strokeWidth="1.6"
                />
                <image
                  href="/brand/safran-parcel.jpg"
                  x="146"
                  y="44"
                  width="52"
                  height="36"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#ose-parcel-clip)"
                />
                <rect
                  x="144"
                  y="42"
                  width="56"
                  height="40"
                  rx="5"
                  fill="none"
                  stroke="#1c1018"
                  strokeWidth="1.6"
                />
                <path
                  d="M156 82v6M188 82v6M152 88h40"
                  stroke="#1c1018"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>

              {/* scooter floorboard + body */}
              <path
                d="M188 96
                   C200 88 220 86 248 88
                   L268 90
                   C274 90 280 94 284 100
                   L278 104
                   C250 100 220 102 190 104
                   Z"
                fill="url(#ose-scooter-body)"
                stroke="#1c1018"
                strokeWidth="1.5"
              />
              <path
                d="M198 94h60"
                stroke="url(#ose-scooter-side)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* front leg shield / apron */}
              <path
                d="M248 88
                   C252 70 260 58 274 52
                   L286 54
                   C278 66 276 82 280 98
                   L268 100
                   Z"
                fill="url(#ose-scooter-body)"
                stroke="#1c1018"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M258 60c6 8 8 20 8 32"
                stroke="#ebc37d"
                strokeWidth="1.2"
                opacity="0.4"
                fill="none"
              />

              {/* seat */}
              <path
                d="M198 78
                   C206 70 230 68 248 74
                   C246 82 220 84 204 84
                   Z"
                fill="#1c1018"
                stroke="#0a0608"
                strokeWidth="1.2"
              />
              <path
                d="M208 76h28"
                stroke="#ebc37d"
                strokeWidth="1"
                opacity="0.35"
              />

              {/* headlight */}
              <ellipse
                cx="286"
                cy="62"
                rx="6"
                ry="5"
                fill="#f7f2eb"
                stroke="#1c1018"
                strokeWidth="1.3"
              />
              <ellipse cx="286" cy="62" rx="3" ry="2.5" fill="#ebc37d" opacity="0.7" />

              {/* handlebar stem + bars */}
              <path
                d="M278 56 L278 44"
                stroke="#1c1018"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M266 44h28"
                stroke="#1c1018"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <path
                d="M266 44c-3 2-5 6-5 10"
                stroke="#1c1018"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M294 44c3 2 5 6 5 10"
                stroke="#1c1018"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M261 52h5M297 52h5"
                stroke="#2f0d29"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* mirrors */}
              <ellipse
                cx="262"
                cy="40"
                rx="4"
                ry="3"
                fill="#eae2d6"
                stroke="#1c1018"
                strokeWidth="1.1"
              />
              <ellipse
                cx="298"
                cy="40"
                rx="4"
                ry="3"
                fill="#eae2d6"
                stroke="#1c1018"
                strokeWidth="1.1"
              />

              {/* exhaust tip */}
              <path
                d="M190 100h14"
                stroke="#6a6064"
                strokeWidth="2.6"
                strokeLinecap="round"
              />

              {/* rider — light skin, dark only on gear/clothes */}
              <g>
                {/* legs / pants (fabric, not skin) */}
                <path
                  d="M218 78
                     C216 90 214 98 212 104
                     L224 104
                     C226 96 228 88 230 78
                     Z"
                  fill="#5c4a58"
                  stroke="#1c1018"
                  strokeWidth="1.2"
                />
                <path
                  d="M230 78
                     C234 90 238 98 242 104
                     L254 102
                     C248 94 242 86 236 78
                     Z"
                  fill="#5c4a58"
                  stroke="#1c1018"
                  strokeWidth="1.2"
                />
                {/* boots */}
                <path
                  d="M208 102h18c2 0 4 2 3 4h-20c-1-2 0-4 -1-4z"
                  fill="#3d3539"
                  stroke="#1c1018"
                  strokeWidth="1.1"
                />
                <path
                  d="M238 100h16c2 0 4 2 3 4h-18c-1-2 0-4 -1-4z"
                  fill="#3d3539"
                  stroke="#1c1018"
                  strokeWidth="1.1"
                />

                {/* jacket torso */}
                <path
                  d="M214 58
                     C216 54 222 52 228 52
                     C236 52 244 56 248 64
                     C250 72 248 82 244 86
                     C236 90 224 90 216 84
                     C212 78 212 68 214 58
                     Z"
                  fill="#fff"
                  stroke="#1c1018"
                  strokeWidth="1.5"
                />
                <path
                  d="M228 56v28"
                  stroke="#5c4a58"
                  strokeWidth="1.3"
                  opacity="0.45"
                />
                <path
                  d="M220 56c4-4 12-4 16 0"
                  fill="none"
                  stroke="#1c1018"
                  strokeWidth="1.4"
                />

                {/* arms / sleeves */}
                <path
                  d="M244 62
                     C252 60 262 56 274 50
                     L278 56
                     C266 62 254 68 246 72
                     Z"
                  fill="#fff"
                  stroke="#1c1018"
                  strokeWidth="1.4"
                />
                <path
                  d="M218 64
                     C212 68 208 74 206 80
                     L214 84
                     C216 76 220 70 224 66
                     Z"
                  fill="#fff"
                  stroke="#1c1018"
                  strokeWidth="1.3"
                  opacity="0.9"
                />
                {/* hands — light skin */}
                <ellipse
                  cx="278"
                  cy="52"
                  rx="5"
                  ry="4"
                  fill="#f3e0cc"
                  stroke="#1c1018"
                  strokeWidth="1.1"
                />

                <path
                  className={styles.scarf}
                  d="M238 60c10 1 14 6 12 11"
                  stroke="#ebc37d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M220 70h16"
                  stroke="#ebc37d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* helmet over light skin face */}
                <g className={styles.helmetNod}>
                  {/* neck / face skin */}
                  <ellipse
                    cx="228"
                    cy="50"
                    rx="11"
                    ry="10"
                    fill="#f3e0cc"
                    stroke="#1c1018"
                    strokeWidth="1"
                  />
                  {/* helmet shell */}
                  <path
                    d="M212 48
                       C212 34 222 30 228 30
                       C234 30 244 34 244 48
                       C244 52 240 54 236 54
                       L220 54
                       C216 54 212 52 212 48
                       Z"
                    fill="#4a3a48"
                    stroke="#1c1018"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M216 38c6-6 18-6 24 0"
                    stroke="#ebc37d"
                    strokeWidth="1.3"
                    fill="none"
                    opacity="0.5"
                  />
                  {/* glass visor — not dark skin */}
                  <path
                    d="M216 46
                       C220 42 236 42 240 47
                       C238 52 220 53 216 49
                       Z"
                    fill="#9db4c4"
                    opacity="0.55"
                    stroke="#1c1018"
                    strokeWidth="1"
                  />
                  <path
                    d="M218 47c6-2 14-2 20 0"
                    stroke="#fff"
                    strokeWidth="1"
                    opacity="0.45"
                    fill="none"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
