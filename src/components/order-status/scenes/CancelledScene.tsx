import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function CancelledScene() {
  const copy = STAGE_COPY.cancelled;

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
          <ellipse
            cx="160"
            cy="108"
            rx="52"
            ry="14"
            fill="#eae2d6"
            stroke="#1c1018"
            strokeWidth="1.6"
          />
          <ellipse
            cx="160"
            cy="102"
            rx="36"
            ry="9"
            fill="#fff"
            stroke="#1c1018"
            strokeWidth="1.3"
          />
          <path
            d="M138 86 182 118M182 86 138 118"
            stroke="#1c1018"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>
      </svg>
    </div>
  );
}
