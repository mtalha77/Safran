import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function CompletedScene() {
  const copy = STAGE_COPY.completed;

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
          {/* doorway */}
          <rect
            x="196"
            y="48"
            width="72"
            height="112"
            rx="4"
            fill="#eae2d6"
            stroke="#1c1018"
            strokeWidth="1.6"
          />
          <rect x="208" y="60" width="48" height="88" fill="#fff" stroke="#1c1018" strokeWidth="1.2" />
          <circle cx="248" cy="108" r="2.5" fill="#2f0d29" />
          <path d="M40 160h240" stroke="#1c1018" strokeOpacity="0.12" strokeWidth="2" />

          <g className={styles.parcelArrive}>
            {/* hands + bag */}
            <path
              d="M96 128c8 10 28 14 48 8"
              stroke="#1c1018"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M128 78h52l8 56H120z"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.6"
            />
            <path d="M128 78h52v14H128z" fill="#fff" stroke="#1c1018" strokeWidth="1.3" />
            <circle cx="154" cy="118" r="8" fill="#2f0d29" />
            <path d="M150 118h8" stroke="#ebc37d" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          <g className={styles.celebrate}>
            <circle
              cx="160"
              cy="56"
              r="22"
              fill="none"
              stroke="#2f0d29"
              strokeWidth="2.2"
            />
            <path
              className={styles.checkDraw}
              d="M149 56l7 7 14-15"
              fill="none"
              stroke="#2f0d29"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="132" cy="42" r="2.5" fill="#ebc37d" />
            <circle cx="188" cy="48" r="2" fill="#ebc37d" />
            <circle cx="176" cy="34" r="1.6" fill="#2f0d29" opacity="0.45" />
          </g>
        </g>
      </svg>
    </div>
  );
}
