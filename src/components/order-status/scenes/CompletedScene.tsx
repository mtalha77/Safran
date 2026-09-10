import styles from "../order-status.module.css";
import { STAGE_COPY } from "../order-status.config";

export default function CompletedScene() {
  const copy = STAGE_COPY.completed;

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
          <clipPath id="ose-done-parcel-clip">
            <path d="M78 44h60l6 56H72z" />
          </clipPath>
        </defs>
        <g aria-hidden="true">
          <rect x="0" y="0" width="480" height="128" fill="#f7f2eb" />

          <text
            x="100"
            y="58"
            textAnchor="middle"
            fill="#2f0d29"
            opacity="0.14"
            style={{
              fontFamily: "var(--font-caveat), 'Segoe Script', cursive",
              fontSize: 64,
              fontWeight: 600,
            }}
          >
            Safran
          </text>

          {/* house wall — seamless, no cut stroke */}
          <rect x="280" y="12" width="200" height="96" fill="#f7f2eb" />
          <rect
            x="400"
            y="28"
            width="32"
            height="28"
            rx="2"
            fill="#fff"
            stroke="#1c1018"
            strokeWidth="1.3"
          />
          <path
            d="M416 28v28M400 42h32"
            stroke="#1c1018"
            strokeWidth="1.1"
            opacity="0.45"
          />

          {/* doorway */}
          <rect
            x="296"
            y="16"
            width="80"
            height="92"
            rx="3"
            fill="#eae2d6"
            stroke="#1c1018"
            strokeWidth="1.6"
          />
          <rect x="304" y="24" width="64" height="84" fill="#ebe4da" />

          {/* floor — one colour, full width */}
          <path d="M0 108h480" stroke="#1c1018" strokeWidth="2" />
          <rect x="0" y="108" width="480" height="20" fill="#eae2d6" />

          {/* parcel with full-bleed brand image */}
          <g className={styles.parcelDeliver}>
            <path
              d="M78 44h60l6 56H72z"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
            <image
              href="/brand/safran-parcel.jpg"
              x="72"
              y="44"
              width="72"
              height="56"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#ose-done-parcel-clip)"
            />
            <path
              d="M78 44h60l6 56H72z"
              fill="none"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
            <path
              d="M90 44c3-10 14-14 22-14s19 4 22 14"
              fill="none"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
          </g>

          {/* door — SMIL rotate around hinge (no CSS skew under stretch) */}
          <g>
            <rect
              x="304"
              y="24"
              width="64"
              height="84"
              rx="2"
              fill="#eae2d6"
              stroke="#1c1018"
              strokeWidth="1.5"
            />
            <rect
              x="312"
              y="32"
              width="48"
              height="68"
              rx="1"
              fill="#f7f2eb"
              stroke="#1c1018"
              strokeWidth="1.1"
            />
            <circle cx="350" cy="68" r="3" fill="#2f0d29" />
            <circle cx="350" cy="68" r="1.2" fill="#ebc37d" />
            <path
              d="M304 36h4M304 68h4M304 96h4"
              stroke="#1c1018"
              strokeWidth="1.4"
              opacity="0.5"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 304 66; 0 304 66; -78 304 66; -78 304 66; 0 304 66; 0 304 66"
              keyTimes="0; 0.08; 0.22; 0.58; 0.78; 1"
              dur="2.8s"
              fill="freeze"
              calcMode="spline"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
            />
          </g>

          <g className={styles.celebrate}>
            <circle
              cx="248"
              cy="36"
              r="16"
              fill="#fff"
              stroke="#2f0d29"
              strokeWidth="2"
            />
            <path
              className={styles.checkDraw}
              d="M240 36l4.5 4.5 9-10"
              fill="none"
              stroke="#2f0d29"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="230" cy="26" r="2" fill="#ebc37d" />
            <circle cx="266" cy="28" r="1.6" fill="#ebc37d" />
            <circle cx="258" cy="20" r="1.3" fill="#2f0d29" opacity="0.35" />
          </g>
        </g>
      </svg>
    </div>
  );
}
