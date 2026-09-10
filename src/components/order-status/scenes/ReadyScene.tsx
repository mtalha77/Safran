import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function ReadyScene() {
  const copy = STAGE_COPY.ready;

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
          <path d="M40 158h240" stroke="#1c1018" strokeOpacity="0.1" strokeWidth="2" />
          <g className={styles.bagSettle}>
            {/* paper bag */}
            <path
              d="M118 70h84l10 88H108z"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.8"
            />
            <path d="M118 70h84v18H118z" fill="#fff" stroke="#1c1018" strokeWidth="1.5" />
            <path
              d="M130 70c4-14 20-18 30-18s26 4 30 18"
              fill="none"
              stroke="#1c1018"
              strokeWidth="1.8"
            />
            {/* food box inside */}
            <rect
              x="136"
              y="98"
              width="48"
              height="28"
              rx="3"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.4"
            />
            <path d="M144 108h32" stroke="#2f0d29" strokeWidth="1.5" opacity="0.5" />
            {/* brand mark */}
            <circle cx="160" cy="132" r="10" fill="#2f0d29" />
            <path
              d="M155 132h10"
              stroke="#ebc37d"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* seal */}
            <g className={styles.sealPop}>
              <circle cx="188" cy="96" r="11" fill="#2f0d29" />
              <path
                d="M183 96l3.5 3.5 7-8"
                fill="none"
                stroke="#ebc37d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
          <ellipse
            className={styles.readyAmbient}
            cx="160"
            cy="168"
            rx="48"
            ry="5"
            fill="#1c1018"
            opacity="0.08"
          />
        </g>
      </svg>
    </div>
  );
}
