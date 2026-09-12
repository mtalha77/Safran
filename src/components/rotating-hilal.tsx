import { amiri } from "@/lib/fonts";

const GREEN = "#1A6B33";

function Star({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon
        fill={GREEN}
        points="0,-5.4 1.5,-1.5 5.4,0 1.5,1.5 0,5.4 -1.5,1.5 -5.4,0 -1.5,-1.5"
      />
      <polygon
        fill={GREEN}
        transform="rotate(45)"
        points="0,-5.4 1.5,-1.5 5.4,0 1.5,1.5 0,5.4 -1.5,1.5 -5.4,0 -1.5,-1.5"
      />
    </g>
  );
}

export function RotatingHilal() {
  return (
    <div
      className="absolute right-3 bottom-3 z-20 h-20 w-20 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] sm:right-4 sm:bottom-6 sm:h-24 sm:w-24 md:right-8 md:bottom-8 md:h-28 md:w-28"
      aria-label="Halal und ohne Alkohol — Halal and without Alcohol"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <circle cx="100" cy="100" r="100" fill="white" />
        <circle
          cx="100"
          cy="100"
          r="97"
          fill="none"
          stroke={GREEN}
          strokeWidth="3"
        />
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke={GREEN}
          strokeWidth="3"
        />
      </svg>

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]"
        aria-hidden
      >
        <defs>
          <path
            id="hilal-arc-top"
            fill="none"
            d="M 19.25 85.76 A 82 82 0 0 1 180.75 85.76"
          />
          <path
            id="hilal-arc-bottom"
            fill="none"
            d="M 15.3 114.93 A 86 86 0 0 0 184.7 114.93"
          />
        </defs>

        <text
          fill={GREEN}
          fontSize="13"
          fontWeight="700"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          <textPath href="#hilal-arc-top" startOffset="50%" textAnchor="middle">
            Halal und ohne Alkohol
          </textPath>
        </text>

        <text
          fill={GREEN}
          fontSize="13"
          fontWeight="700"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          <textPath
            href="#hilal-arc-bottom"
            startOffset="50%"
            textAnchor="middle"
          >
            Halal and without Alcohol
          </textPath>
        </text>

        <Star x={16} y={100} />
        <Star x={184} y={100} />
      </svg>

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill={GREEN}
          fontSize="52"
          fontWeight="700"
          style={{
            fontFamily: `${amiri.style.fontFamily}, 'Noto Naskh Arabic', serif`,
          }}
        >
          حلال
        </text>

        <g fill={GREEN} transform="translate(100 152)">
          <path
            transform="rotate(-40) scale(0.72)"
            d="M0 0 C -5 -6 -5 -14 0 -20 C 5 -14 5 -6 0 0Z"
          />
          <path
            transform="rotate(-8) scale(0.8)"
            d="M0 0 C -5 -6 -5 -14 0 -20 C 5 -14 5 -6 0 0Z"
          />
          <path
            transform="rotate(38) scale(1)"
            d="M0 0 C -5 -6 -5 -14 0 -20 C 5 -14 5 -6 0 0Z"
          />
          <path
            d="M-17 3 C-6 8 6 8 17 3"
            fill="none"
            stroke={GREEN}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
