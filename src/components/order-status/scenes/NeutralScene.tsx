import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

/** Neutral fallback for unknown / loading / stale states. */
export default function NeutralScene() {
  const copy = STAGE_COPY.unknown;

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
          <circle
            className={styles.statusPulse}
            cx="160"
            cy="96"
            r="28"
            fill="none"
            stroke="#2f0d29"
            strokeWidth="2"
            opacity="0.35"
          />
          <circle cx="160" cy="96" r="8" fill="#ebc37d" opacity="0.7" />
          <path d="M100 148h120" stroke="#1c1018" strokeOpacity="0.12" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
