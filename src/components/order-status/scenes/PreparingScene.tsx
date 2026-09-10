import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function PreparingScene() {
  const copy = STAGE_COPY.preparing;

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

          {/* handwriting brand watermark */}
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

          {/* hanging tickets */}
          <g className={styles.ticketSway}>
            <path d="M452 2v10" stroke="#1c1018" strokeWidth="1.3" />
            <rect
              x="438"
              y="12"
              width="26"
              height="28"
              rx="2"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.1"
            />
            <path
              d="M444 20h14M444 27h9"
              stroke="#1c1018"
              strokeWidth="1"
              opacity="0.45"
            />
          </g>
          <g className={styles.ticketSway}>
            <path d="M424 4v8" stroke="#1c1018" strokeWidth="1.1" />
            <rect
              x="412"
              y="12"
              width="20"
              height="22"
              rx="2"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1"
            />
            <path
              d="M416 19h11M416 25h7"
              stroke="#1c1018"
              strokeWidth="0.9"
              opacity="0.4"
            />
          </g>

          {/* clock — clipped so hands stay inside the dial */}
          <g>
            <defs>
              <clipPath id="ose-clock-clip">
                <circle cx="22" cy="32" r="12.5" />
              </clipPath>
            </defs>
            <circle
              cx="22"
              cy="32"
              r="13.5"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.4"
            />
            <path
              d="M22 21v2M22 41v2M11 32h2M31 32h2"
              stroke="#1c1018"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.45"
            />
            <g clipPath="url(#ose-clock-clip)">
              <g transform="translate(22 32)">
                <g>
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-6"
                    stroke="#1c1018"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="180s"
                    repeatCount="indefinite"
                  />
                </g>
                <g>
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="-8.5"
                    stroke="#2f0d29"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="30s"
                    repeatCount="indefinite"
                  />
                </g>
                <g>
                  <line
                    x1="0"
                    y1="1.5"
                    x2="0"
                    y2="-9.5"
                    stroke="#c45c26"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </g>
              </g>
            </g>
            <circle cx="22" cy="32" r="1.5" fill="#1c1018" />
          </g>

          {/* counter — flush to edges */}
          <path d="M0 108h480" stroke="#1c1018" strokeWidth="2" />
          <rect x="0" y="108" width="480" height="20" fill="#eae2d6" />

          {/* plates — left (former chef spot) */}
          <g>
            <ellipse
              cx="78"
              cy="102"
              rx="20"
              ry="4.5"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse
              cx="78"
              cy="98"
              rx="20"
              ry="4.5"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse
              cx="78"
              cy="94"
              rx="20"
              ry="4.5"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <ellipse
              cx="78"
              cy="94"
              rx="11"
              ry="2.2"
              fill="none"
              stroke="#1c1018"
              strokeWidth="0.9"
              opacity="0.35"
            />
          </g>

          {/* chef — plates spot, next to stove */}
          <g className={styles.chefBreath}>
            <path
              d="M128 108c0-24 13-38 30-38s30 14 30 38"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.6"
            />
            <path d="M132 106h52v12H132z" fill="#2f0d29" />
            <circle
              cx="158"
              cy="64"
              r="13"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.6"
            />

            <g>
              <rect
                x="145"
                y="53"
                width="26"
                height="5"
                rx="1.5"
                fill="#fff"
                stroke="#1c1018"
                strokeWidth="1.35"
              />
              <path
                d="M147 53
                   C145 46 150 40 158 38
                   C166 40 171 46 169 53
                   Z"
                fill="#fff"
                stroke="#1c1018"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M152 52c0-6 2-10 6-12M158 52c0-7 0-11 0-13M164 52c0-6-2-10-6-12"
                stroke="#1c1018"
                strokeWidth="0.95"
                fill="none"
                opacity="0.3"
              />
            </g>

            <g className={styles.chefBlink}>
              <circle cx="153" cy="64" r="1.4" fill="#1c1018" />
              <circle cx="163" cy="64" r="1.4" fill="#1c1018" />
            </g>
            <path
              d="M154 71c1.8 1.8 5.5 1.8 7 0"
              stroke="#1c1018"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* frying pan */}
          <g>
            <ellipse
              cx="320"
              cy="98"
              rx="26"
              ry="7"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.3"
            />
            <ellipse cx="320" cy="96" rx="18" ry="4.5" fill="#1a0716" />
            <path
              d="M346 96h28"
              stroke="#1c1018"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <circle className={styles.bubble} cx="314" cy="96" r="1.8" fill="#ebc37d" />
          </g>

          {/* small pot */}
          <g>
            <path
              d="M418 90c0 10 7 15 16 15s16-5 16-15"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.3"
            />
            <ellipse cx="434" cy="88" rx="16" ry="4.5" fill="#1a0716" />
            <path
              d="M418 90c-4 0-5 3-3 4.5M450 90c4 0 5 3 3 4.5"
              stroke="#1c1018"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              className={styles.steam}
              d="M434 84c0-7 2-10 2-14"
              stroke="#1c1018"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </g>

          {/* stove */}
          <rect
            x="200"
            y="100"
            width="52"
            height="9"
            rx="2"
            fill="#2f0d29"
            stroke="#1c1018"
            strokeWidth="1.1"
          />
          <ellipse
            cx="226"
            cy="100"
            rx="22"
            ry="4.5"
            fill="#1a0716"
            stroke="#1c1018"
            strokeWidth="1"
          />
          <ellipse
            cx="226"
            cy="99"
            rx="14"
            ry="3"
            fill="none"
            stroke="#ebc37d"
            strokeWidth="1.2"
          />

          <ellipse
            className={styles.flameGlow}
            cx="226"
            cy="92"
            rx="28"
            ry="14"
            fill="#e07a3a"
          />
          <g transform="translate(226 102)">
            <g className={styles.flame}>
              <path
                d="M-13 0c2-11 7-16 9-22 5 7 5 15 2 22-2 3-7 3-11 0z"
                fill="#e85d2a"
              />
              <path d="M-9 0c2-7 4-11 5-14 2 4 2 9 0 14z" fill="#ffe08a" />
            </g>
            <g className={`${styles.flame} ${styles.flameMid}`}>
              <path
                d="M-3 0c3-14 8-20 11-25 5 9 5 18 2 25-2 4-9 4-13 0z"
                fill="#d4451f"
              />
              <path d="M1 0c2-9 3-13 5-18 2 5 2 11 0 18z" fill="#fff3c0" />
            </g>
            <g className={`${styles.flame} ${styles.flameDelay}`}>
              <path
                d="M8 0c2-11 6-16 8-20 4 6 4 14 1 20-2 3-6 3-9 0z"
                fill="#e85d2a"
              />
              <path d="M10 0c1-6 3-10 4-13 2 4 1 8 0 13z" fill="#f0c35a" />
            </g>
          </g>
          <g className={styles.flame}>
            <path
              d="M198 98c-3-9 0-14 3-18 3 5 4 12 2 18-1 2-4 2-5 0z"
              fill="#e07a3a"
            />
          </g>
          <g className={`${styles.flame} ${styles.flameDelay}`}>
            <path
              d="M254 98c3-9 0-14-3-18-3 5-4 12-2 18 1 2 4 2 5 0z"
              fill="#e07a3a"
            />
          </g>

          {/* main pot */}
          <path
            d="M200 72c0 14 11 22 26 22s26-8 26-22"
            fill="#2f0d29"
            stroke="#1c1018"
            strokeWidth="1.4"
          />
          <ellipse cx="226" cy="70" rx="26" ry="5.5" fill="#1a0716" />
          <path
            d="M198 74c-5 0-7 3-4 6M254 74c5 0 7 3 4 6"
            stroke="#1c1018"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle className={styles.bubble} cx="216" cy="78" r="2" fill="#ebc37d" />
          <circle
            className={`${styles.bubble} ${styles.bubbleDelay1}`}
            cx="230"
            cy="82"
            r="1.6"
            fill="#eae2d6"
          />

          <path
            className={styles.steam}
            d="M214 64c0-8 3-11 3-16"
            stroke="#1c1018"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          <path
            className={`${styles.steam} ${styles.steamDelay1}`}
            d="M226 62c0-9 4-12 4-18"
            stroke="#1c1018"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          <path
            className={`${styles.steam} ${styles.steamDelay2}`}
            d="M238 64c0-8 3-11 3-16"
            stroke="#1c1018"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />

          <g className={styles.chefArm}>
            <path
              d="M180 78c16 4 28 10 40 18"
              stroke="#1c1018"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M218 94c8 8 6 12 0 14"
              stroke="#1c1018"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
