import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function ReadyScene() {
  const copy = STAGE_COPY.ready;

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
        <g aria-hidden="true">
          <rect x="0" y="0" width="480" height="128" fill="#f7f2eb" />

          <text
            x="240"
            y="72"
            textAnchor="middle"
            fill="#2f0d29"
            opacity="0.1"
            style={{
              fontFamily: "var(--font-caveat), 'Segoe Script', cursive",
              fontSize: 72,
              fontWeight: 600,
            }}
          >
            Safran
          </text>

          {/* counter flush */}
          <path d="M0 108h480" stroke="#1c1018" strokeWidth="2" />
          <rect x="0" y="108" width="480" height="20" fill="#eae2d6" />

          {/* bartan fly into bag (same bag size as before, centered) */}
          <g className={`${styles.packItem} ${styles.packItem1}`}>
            <ellipse
              cx="70"
              cy="98"
              rx="18"
              ry="4"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse
              cx="70"
              cy="94"
              rx="18"
              ry="4"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse
              cx="70"
              cy="90"
              rx="18"
              ry="4"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
          </g>

          <g className={`${styles.packItem} ${styles.packItem2}`}>
            <ellipse
              cx="400"
              cy="96"
              rx="22"
              ry="6"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.3"
            />
            <ellipse cx="400" cy="94" rx="15" ry="3.5" fill="#1a0716" />
            <path
              d="M422 94h22"
              stroke="#1c1018"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>

          <g className={`${styles.packItem} ${styles.packItem3}`}>
            <path
              d="M40 78c0 10 7 15 16 15s16-5 16-15"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.3"
            />
            <ellipse cx="56" cy="76" rx="16" ry="4.5" fill="#1a0716" />
            <path
              className={styles.steam}
              d="M56 72c0-6 2-9 2-12"
              stroke="#1c1018"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </g>

          <g className={`${styles.packItem} ${styles.packItem4}`}>
            <path
              d="M420 76c0 9 6 14 14 14s14-5 14-14"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse cx="434" cy="74" rx="14" ry="4" fill="#1a0716" />
          </g>

          {/* paper bag — same proportions as before, centered on 480 canvas */}
          <g className={styles.bagSettle}>
            <path
              d="M198 42h84l10 66H188z"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.7"
            />
            {/* open flap that closes when packed */}
            <g className={styles.bagFlap}>
              <path
                d="M198 42h84v16H198z"
                fill="#fff"
                stroke="#1c1018"
                strokeWidth="1.4"
              />
            </g>
            <path
              d="M210 42c4-12 18-16 28-16s24 4 28 16"
              fill="none"
              stroke="#1c1018"
              strokeWidth="1.7"
            />
            {/* packed box inside (appears as items arrive) */}
            <g className={styles.packedBox}>
              <rect
                x="216"
                y="62"
                width="48"
                height="26"
                rx="3"
                fill="#fff"
                stroke="#1c1018"
                strokeWidth="1.3"
              />
              <path
                d="M224 72h32"
                stroke="#2f0d29"
                strokeWidth="1.4"
                opacity="0.5"
              />
            </g>
            <circle cx="240" cy="98" r="9" fill="#2f0d29" />
            <path
              d="M235 98h10"
              stroke="#ebc37d"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <g className={styles.sealPop}>
              <circle cx="268" cy="68" r="10" fill="#2f0d29" />
              <path
                d="M263 68l3.2 3.2 6.5-7.5"
                fill="none"
                stroke="#ebc37d"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>

          <ellipse
            className={styles.readyAmbient}
            cx="240"
            cy="118"
            rx="46"
            ry="4"
            fill="#1c1018"
            opacity="0.08"
          />
        </g>
      </svg>
    </div>
  );
}
