import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function DeliveringScene() {
  const copy = STAGE_COPY.delivering;

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
          {/* far hills */}
          <g className={styles.roadFar}>
            <path
              d="M-48 108c40-18 70-10 110-18 42-8 70 4 110-8 36-10 70 0 100 8v40H-48z"
              fill="#eae2d6"
            />
            <path
              d="M-48 108c40-18 70-10 110-18 42-8 70 4 110-8 36-10 70 0 100 8v40H-48z"
              transform="translate(220)"
              fill="#eae2d6"
            />
          </g>
          {/* road */}
          <rect x="0" y="148" width="320" height="40" fill="#1c1018" opacity="0.08" />
          <g className={styles.roadNear}>
            <path
              d="M0 162h28M44 162h28M88 162h28M132 162h28M176 162h28M220 162h28M264 162h28M308 162h28"
              stroke="#1c1018"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.28"
            />
            <path
              d="M0 162h28M44 162h28M88 162h28M132 162h28M176 162h28M220 162h28M264 162h28M308 162h28"
              transform="translate(320)"
              stroke="#1c1018"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.28"
            />
          </g>

          <g className={styles.riderGroup}>
            {/* scooter body */}
            <path
              d="M118 142c18-2 48-4 72 0l8 10H112z"
              fill="#2f0d29"
              stroke="#1c1018"
              strokeWidth="1.4"
            />
            <path d="M176 132h28l6 20h-40z" fill="#1a0716" />
            {/* wheels */}
            <g className={styles.wheel}>
              <circle cx="124" cy="154" r="14" fill="#fff" stroke="#1c1018" strokeWidth="2" />
              <circle cx="124" cy="154" r="3" fill="#1c1018" />
              <path d="M124 140v28M110 154h28" stroke="#1c1018" strokeWidth="1.2" opacity="0.4" />
            </g>
            <g className={styles.wheel}>
              <circle cx="198" cy="154" r="14" fill="#fff" stroke="#1c1018" strokeWidth="2" />
              <circle cx="198" cy="154" r="3" fill="#1c1018" />
              <path d="M198 140v28M184 154h28" stroke="#1c1018" strokeWidth="1.2" opacity="0.4" />
            </g>
            {/* food box */}
            <rect
              x="148"
              y="108"
              width="34"
              height="26"
              rx="3"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
            <path d="M148 118h34" stroke="#2f0d29" strokeWidth="2" />
            <circle cx="165" cy="128" r="4" fill="#2f0d29" />
            {/* rider */}
            <g className={styles.helmetNod}>
              <circle cx="156" cy="92" r="13" fill="#2f0d29" stroke="#1c1018" strokeWidth="1.4" />
              <path d="M148 94h12" stroke="#ebc37d" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <path
              d="M146 106c2 18 18 26 28 10"
              fill="#fff"
              stroke="#1c1018"
              strokeWidth="1.6"
            />
            <path
              className={styles.scarf}
              d="M162 108c10 2 16 8 14 14"
              stroke="#ebc37d"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
