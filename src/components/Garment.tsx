import { useId } from "react";
import type { LineId } from "@/config/business";
import type { GarmentArt } from "@/lib/types";

/**
 * Parametric garment illustration. Used as art direction while real product
 * photography is missing — always labelled as an illustration, never as a photo.
 */

const SHAPES = {
  shirtFront:
    "M150 30 Q200 72 250 30 L330 56 L394 138 L344 180 L318 152 L318 418 Q200 432 82 418 L82 152 L56 180 L6 138 L70 56 Z",
  shirtBack:
    "M150 30 Q200 48 250 30 L330 56 L394 138 L344 180 L318 152 L318 418 Q200 432 82 418 L82 152 L56 180 L6 138 L70 56 Z",
  longFront:
    "M150 30 Q200 72 250 30 L330 56 Q372 120 398 362 L356 374 L318 176 L318 418 Q200 432 82 418 L82 176 L44 374 L2 362 Q28 120 70 56 Z",
  longBack:
    "M150 30 Q200 48 250 30 L330 56 Q372 120 398 362 L356 374 L318 176 L318 418 Q200 432 82 418 L82 176 L44 374 L2 362 Q28 120 70 56 Z",
  shorts: "M66 70 L334 70 L372 372 Q300 392 226 384 L200 214 L174 384 Q100 392 28 372 Z",
};

function Pattern({ art, w = 400, h = 440 }: { art: GarmentArt; w?: number; h?: number }) {
  const [, accent] = art.colors;
  switch (art.pattern) {
    case "stripes":
      return (
        <>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={i * 88 - 22} y={0} width={44} height={h} fill={accent} />
          ))}
        </>
      );
    case "pinstripe":
      return (
        <>
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={i * 24} y={0} width={3} height={h} fill={accent} opacity={0.8} />
          ))}
        </>
      );
    case "hoops":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={0} y={70 + i * 100} width={w} height={50} fill={accent} />
          ))}
        </>
      );
    case "sash":
      return <polygon points={`40,0 120,0 ${w},${h - 70} ${w},${h + 20} ${w - 40},${h}`} fill={accent} />;
    case "halves":
      return <rect x={200} y={0} width={200} height={h} fill={accent} />;
    default:
      return null;
  }
}

export interface GarmentProps {
  art: GarmentArt;
  line: LineId;
  view?: "front" | "back";
  number?: string;
  className?: string;
  title?: string;
}

export function Garment({ art, line, view = "front", number, className, title }: GarmentProps) {
  const uid = useId().replace(/:/g, "");
  const isShorts = line === "short";
  const isLong = line === "manga-larga";
  const d = isShorts
    ? SHAPES.shorts
    : isLong
      ? view === "back"
        ? SHAPES.longBack
        : SHAPES.longFront
      : view === "back"
        ? SHAPES.shirtBack
        : SHAPES.shirtFront;
  const trim = art.trim ?? art.colors[1];
  const showNumber = !!number && (view === "back" || isShorts);
  const numberColor = art.numberColor ?? "#fff";

  return (
    <svg
      viewBox="0 0 400 440"
      className={className}
      role="img"
      aria-label={title ?? "Ilustración de la prenda"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={`c${uid}`}>
          <path d={d} />
        </clipPath>
        <linearGradient id={`s${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <stop offset="0.28" stopColor="#000" stopOpacity="0" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.8" stopColor="#000" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={`v${uid}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#c${uid})`}>
        <rect width="400" height="440" fill={art.colors[0]} />
        <Pattern art={art} />
        {/* Fabric light */}
        <rect width="400" height="440" fill={`url(#s${uid})`} />
        <rect width="400" height="440" fill={`url(#v${uid})`} />
        {/* Soft folds */}
        {!isShorts && (
          <g stroke="#000" strokeOpacity="0.12" strokeWidth="2" fill="none">
            <path d="M120 230 Q140 320 118 410" />
            <path d="M282 220 Q262 320 284 410" />
          </g>
        )}
        {isShorts && <rect x="0" y="70" width="400" height="26" fill={trim} opacity="0.95" />}
        {showNumber && !isShorts && (
          <text
            x="200"
            y="318"
            textAnchor="middle"
            fontFamily="'Big Shoulders Display', Impact, sans-serif"
            fontWeight={900}
            fontSize={number!.length > 1 ? 196 : 210}
            fill={numberColor}
            stroke={trim}
            strokeOpacity={0.35}
            strokeWidth={3}
            letterSpacing="-4"
          >
            {number}
          </text>
        )}
        {showNumber && isShorts && (
          <text
            x="112"
            y="340"
            textAnchor="middle"
            fontFamily="'Big Shoulders Display', Impact, sans-serif"
            fontWeight={900}
            fontSize={64}
            fill={numberColor}
          >
            {number}
          </text>
        )}
      </g>

      {/* Collar & cuffs */}
      {!isShorts && (
        <path
          d={view === "back" ? "M150 30 Q200 48 250 30" : "M150 30 Q200 72 250 30"}
          fill="none"
          stroke={trim}
          strokeWidth="9"
          strokeLinecap="round"
        />
      )}
      {!isShorts && !isLong && (
        <g stroke={trim} strokeWidth="7" strokeLinecap="round">
          <line x1="9" y1="141" x2="57" y2="177" />
          <line x1="391" y1="141" x2="343" y2="177" />
        </g>
      )}
      {isLong && (
        <g stroke={trim} strokeWidth="8" strokeLinecap="round">
          <line x1="5" y1="360" x2="43" y2="371" />
          <line x1="395" y1="360" x2="357" y2="371" />
        </g>
      )}
      <path d={d} fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.5" />
    </svg>
  );
}
