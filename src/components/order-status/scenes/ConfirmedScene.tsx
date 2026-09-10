import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function ConfirmedScene() {
  const copy = STAGE_COPY.confirmed;

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
          <path d="M0 158h320" stroke="#1c1018" strokeOpacity="0.08" />
          {/* printer */}
          <rect
            x="118"
            y="18"
            width="84"
            height="36"
            rx="6"
            fill="#2f0d29"
          />
          <rect x="128" y="46" width="64" height="8" fill="#1a0716" />
          <circle className={styles.statusPulse} cx="190" cy="30" r="3" fill="#ebc37d" />

          {/* ticket */}
          <g className={styles.ticketSlide}>
            <rect
              x="130"
              y="54"
              width="60"
              height="88"
              rx="3"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
            <path
              className={styles.ticketLine}
              d="M140 72h40"
              stroke="#1c1018"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              className={styles.ticketLine}
              d="M140 86h34"
              stroke="#1c1018"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              className={styles.ticketLine}
              d="M140 100h28"
              stroke="#1c1018"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
            <g className={styles.stamp}>
              <circle
                cx="160"
                cy="122"
                r="12"
                fill="none"
                stroke="#2f0d29"
                strokeWidth="2"
              />
              <path
                d="M154 122l4 4 8-9"
                fill="none"
                stroke="#2f0d29"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
