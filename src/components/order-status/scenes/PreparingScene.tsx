import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function PreparingScene() {
  const copy = STAGE_COPY.preparing;

  return (
    <div className={styles.sceneShell}>
      <svg
        className={`${styles.sceneSvg} ${styles.sceneEnter}`}
        viewBox="0 0 320 200"
        role="img"
        aria-label={copy.ariaLabel}
      >
        <title>{copy.ariaLabel}</title>
        <desc>{copy.ariaDescription}</desc>
        <g aria-hidden="true">
          <rect x="0" y="0" width="320" height="200" fill="#f7f2eb" />
          {/* warm light */}
          <ellipse
            className={styles.warmGlow}
            cx="160"
            cy="40"
            rx="90"
            ry="28"
            fill="#ebc37d"
            opacity="0.28"
          />
          {/* hanging ticket */}
          <g className={styles.ticketSway}>
            <path d="M250 8v18" stroke="#1c1018" strokeWidth="1.5" />
            <rect
              x="236"
              y="26"
              width="28"
              height="36"
              rx="2"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.2"
            />
            <path d="M242 36h16M242 44h12" stroke="#1c1018" strokeWidth="1.2" opacity="0.5" />
          </g>
          {/* wall clock */}
          <circle cx="48" cy="36" r="14" fill="#fff" stroke="#1c1018" strokeWidth="1.5" />
          <path
            className={styles.clockHand}
            d="M48 36v-9"
            stroke="#2f0d29"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          {/* counter */}
          <path d="M24 150h272" stroke="#1c1018" strokeWidth="2" />
          <rect x="24" y="150" width="272" height="28" fill="#eae2d6" />
          {/* pot */}
          <ellipse cx="168" cy="138" rx="34" ry="10" fill="#1c1018" opacity="0.12" />
          <path
            d="M140 118c0 18 12 28 28 28s28-10 28-28"
            fill="#2f0d29"
            stroke="#1c1018"
            strokeWidth="1.5"
          />
          <ellipse cx="168" cy="116" rx="28" ry="7" fill="#1a0716" />
          <circle className={styles.bubble} cx="158" cy="124" r="2.2" fill="#ebc37d" />
          <circle
            className={`${styles.bubble} ${styles.bubbleDelay1}`}
            cx="172"
            cy="128"
            r="1.8"
            fill="#eae2d6"
          />
          <circle
            className={`${styles.bubble} ${styles.bubbleDelay2}`}
            cx="164"
            cy="130"
            r="1.5"
            fill="#ebc37d"
          />
          {/* steam */}
          <path
            className={styles.steam}
            d="M156 108c0-10 4-14 4-22"
            stroke="#1c1018"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          <path
            className={`${styles.steam} ${styles.steamDelay1}`}
            d="M168 106c0-12 5-16 5-24"
            stroke="#1c1018"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.35"
          />
          <path
            className={`${styles.steam} ${styles.steamDelay2}`}
            d="M180 108c0-10 4-14 4-22"
            stroke="#1c1018"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
          {/* chef */}
          <g className={styles.chefBreath}>
            <path
              d="M78 150c0-28 16-46 36-46s36 18 36 46"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.8"
            />
            <path d="M84 148h60v14H84z" fill="#2f0d29" />
            <circle cx="114" cy="84" r="18" fill="#fff" stroke="#1c1018" strokeWidth="1.8" />
            <path
              d="M96 72c0-16 10-26 18-26s18 10 18 26"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.8"
            />
            <path d="M94 72h40" stroke="#1c1018" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M104 54v14M114 50v18M124 54v14" stroke="#ebc37d" strokeWidth="2" />
            <g className={styles.chefBlink}>
              <circle cx="108" cy="84" r="1.7" fill="#1c1018" />
              <circle cx="120" cy="84" r="1.7" fill="#1c1018" />
            </g>
            <path
              d="M110 92c2.5 2.4 7 2.4 9.5 0"
              stroke="#1c1018"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* stirring arm */}
            <g className={styles.chefArm}>
              <path
                d="M140 110c18 4 28 10 34 18"
                stroke="#1c1018"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M172 126c6 6 4 12-2 14"
                stroke="#1c1018"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
