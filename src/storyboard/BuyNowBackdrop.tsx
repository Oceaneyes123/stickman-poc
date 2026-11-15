/**
 * Full-frame set for video 002. One wall, one motif, one floor: the colour
 * comes from the scene's act look, the art on top stays light and readable.
 * Draws behind the stage and never moves with the camera, like a real backdrop.
 */
import type { Look } from "./buyNowLook";

const INK = "#0B1220";
const HORIZON = 930;

const Motif = ({ look }: { look: Look }) => {
  switch (look.motif) {
    case "sun":
      return (
        <g>
          <circle cx={1250} cy={470} r={310} fill={look.field} opacity={0.42} />
          <circle cx={1250} cy={470} r={150} fill={look.field} opacity={0.35} />
        </g>
      );
    case "arch":
      return <path d="M400 930 V620 Q960 170 1520 620 V930 Z" fill={look.field} opacity={0.3} />;
    case "window":
      return (
        <g>
          <rect x={1120} y={150} width={600} height={730} fill={look.field} opacity={0.24} />
          <rect x={1120} y={560} width={600} height={320} fill={look.glow} opacity={0.5} />
          <path
            d="M1120 150 H1720 M1120 560 H1720 M1420 150 V880"
            stroke={INK}
            strokeOpacity={0.16}
            strokeWidth={5}
          />
        </g>
      );
    case "pendant":
      return (
        <g>
          {[720, 1200].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={300} rx={230} ry={130} fill={look.glow} opacity={0.7} />
              <path d={`M${x} 0 V220`} stroke={INK} strokeOpacity={0.5} strokeWidth={5} />
              <path d={`M${x - 58} 300 H${x + 58} L${x + 40} 232 H${x - 40} Z`} fill={look.field} />
              <circle cx={x} cy={312} r={14} fill={look.card} />
            </g>
          ))}
        </g>
      );
    case "dawn":
      return (
        <g>
          <circle cx={960} cy={880} r={430} fill={look.field} opacity={0.5} />
          <rect x={0} y={700} width={1920} height={120} fill={look.card} opacity={0.10} />
          <rect x={0} y={820} width={1920} height={110} fill={look.card} opacity={0.08} />
        </g>
      );
  }
};

export const BuyNowBackdrop = ({ look }: { look: Look }) => {
  const g = `bn-${look.id}`;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${g}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={look.wall[0]} />
          <stop offset="1" stopColor={look.wall[1]} />
        </linearGradient>
        <radialGradient id={`${g}-glow`}>
          <stop offset="0" stopColor={look.glow} />
          <stop offset="1" stopColor={look.glow.replace(/[\d.]+\)$/, "0)")} />
        </radialGradient>
        <radialGradient id={`${g}-vignette`}>
          <stop offset="0.55" stopColor={INK} stopOpacity={0} />
          <stop offset="1" stopColor={INK} stopOpacity={0.32} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${g}-wall)`} />
      {/* Wall bays give the flat colour a lit room to stand in. */}
      {[0, 1, 2, 3].map((bay) => (
        <rect
          key={bay}
          x={bay * 480}
          y={0}
          width={480}
          height={HORIZON}
          fill={look.panel}
          opacity={bay % 2 ? 1 : 0}
        />
      ))}
      {[1, 2, 3].map((bay) => (
        <path
          key={bay}
          d={`M${bay * 480} 0 V${HORIZON}`}
          stroke={INK}
          strokeOpacity={0.08}
          strokeWidth={3}
        />
      ))}
      <Motif look={look} />
      <ellipse cx={960} cy={820} rx={860} ry={470} fill={`url(#${g}-glow)`} />
      <rect y={HORIZON - 30} width={1920} height={30} fill={look.plinth} />
      <rect y={HORIZON} width={1920} height={1080 - HORIZON} fill={look.floor} />
      <path d={`M0 ${HORIZON} H1920`} stroke={INK} strokeOpacity={0.3} strokeWidth={4} />
      <ellipse cx={960} cy={1000} rx={720} ry={110} fill={look.card} opacity={0.06} />
      <rect width={1920} height={1080} fill={`url(#${g}-vignette)`} />
    </svg>
  );
};
