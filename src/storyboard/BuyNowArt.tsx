/**
 * Original vector props and financial devices for The Buy Now, Pay Later Trap.
 * All art is drawn in canvas coordinates; stages apply their own camera group.
 */
import type { ReactNode } from "react";
import { C } from "../design/tokens";

const ink = C.navy;
// Scene-wide tints come from the act look; the shipped palette is the fallback.
const paper = "var(--bn-card, #F8FAFC)";
const line = "var(--bn-line, #38506B)";
const quiet = "var(--bn-quiet, #E3E8EE)";

export const Jacket = ({
  x,
  y,
  scale = 1,
  hanger = true,
}: {
  x: number;
  y: number;
  scale?: number;
  hanger?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    {hanger && (
      <g fill="none" strokeWidth={3.5}>
        <path d="M0 -118 Q0 -134 14 -134 Q27 -134 27 -121" />
        <path d="M0 -118 L-92 -50 Q-104 -42 -88 -38 H88 Q104 -42 92 -50 Z" fill="var(--bn-wood, #C8BAA2)" />
      </g>
    )}
    <path
      d="M-78 -40 L-96 30 L-64 44 L-52 4 L-48 170 H48 L52 4 L64 44 L96 30 L78 -40 Q40 -22 0 -22 Q-40 -22 -78 -40 Z"
      fill="#B9AE9C"
    />
    <path d="M-78 -40 L-44 -8 L0 18 L44 -8 L78 -40" fill="none" strokeWidth={3} />
    <path d="M-10 -18 L0 18 L10 -18" fill="none" strokeWidth={3} />
    {[52, 86, 120].map((dy) => (
      <circle key={dy} cx={0} cy={dy} r={4} fill={ink} stroke="none" />
    ))}
    <path d="M-48 150 H-30 M30 150 H48" strokeWidth={3} />
  </g>
);

export const Headphones = ({
  x,
  y,
  scale = 1,
  kinked = false,
}: {
  x: number;
  y: number;
  scale?: number;
  kinked?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round">
    <path d="M-64 0 Q-64 -76 0 -76 Q64 -76 64 0" strokeWidth={11} stroke="#5C6B7A" />
    <rect x={-82} y={-8} width={36} height={58} rx={14} fill="#6B7A89" />
    <rect x={46} y={-8} width={36} height={58} rx={14} fill="#6B7A89" />
    <path d="M64 48 Q64 92 26 98 Q-8 104 -18 132" strokeWidth={4} />
    {kinked && <path d="M-18 132 L6 142 L-14 158 L10 170" stroke={C.red} strokeWidth={5} />}
  </g>
);

export const Shoes = ({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    <path
      d="M-92 24 Q-96 -18 -58 -22 L-14 -18 L22 6 L78 18 Q98 22 96 38 L-88 40 Q-94 34 -92 24 Z"
      fill="#E9E4DA"
    />
    <path d="M-88 34 H94" strokeWidth={3} stroke="#9AA7B4" />
    <path d="M-58 -18 Q-46 -2 -34 12 M-26 -18 Q-14 -2 -2 12 M6 -14 Q18 2 30 14" strokeWidth={3} />
    <path d="M-92 20 Q-60 8 -30 20 T36 20" strokeWidth={2.5} stroke={C.teal} />
  </g>
);

export const Ticket = ({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) => (
  <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    <path d="M-110 -56 H64 V56 H-110 Z" fill={paper} />
    <path d="M64 -56 H110 V56 H64 Z" fill={C.red} />
    <path d="M64 -56 V56" strokeDasharray="7 7" />
    <path d="M-86 -24 H34 M-86 0 H14 M-86 24 H44" strokeWidth={3} stroke="#7C8B9C" />
    <circle cx={88} cy={0} r={9} fill={paper} stroke={C.red} strokeWidth={3} />
  </g>
);

export const Watch = ({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4}>
    <path d="M-24 -118 H24 L20 -52 H-20 Z M-20 52 H20 L24 118 H-24 Z" fill={C.navy} />
    <circle r={58} fill="#DDE4EA" />
    <circle r={46} fill={paper} />
    <path d="M0 0 V-30 M0 0 L22 16" strokeWidth={5} strokeLinecap="round" />
    <circle r={4} fill={ink} stroke="none" />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
      <path
        key={deg}
        d="M0 -40 V-34"
        transform={`rotate(${deg})`}
        strokeWidth={2}
        stroke="#7C8B9C"
      />
    ))}
  </g>
);

export const Laptop = ({
  x,
  y,
  scale = 1,
  open = true,
}: {
  x: number;
  y: number;
  scale?: number;
  open?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    {open && <path d="M-120 -92 H120 V30 H-120 Z" fill={paper} />}
    <path d="M-150 30 H150 L132 62 H-132 Z" fill="#C4CFD9" />
    {open && <path d="M-96 -64 H96 M-96 -38 H54 M-96 -12 H76" stroke="#8A99A8" strokeWidth={4} />}
  </g>
);

export const Battery = ({
  x,
  y,
  scale = 1,
  dead = false,
}: {
  x: number;
  y: number;
  scale?: number;
  dead?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4}>
    <rect x={-54} y={-26} width={108} height={52} rx={6} fill={paper} />
    <path d="M54 -10 H68 V10 H54" fill={ink} />
    <path d="M-8 -18 L-22 4 H-2 L-12 20 L14 -6 H-6 Z" fill={dead ? C.red : C.yellow} strokeWidth={2} />
  </g>
);

export const Shoebox = ({
  x,
  y,
  scale = 1,
  lid = true,
}: {
  x: number;
  y: number;
  scale?: number;
  lid?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    <path d="M-92 0 H92 L74 74 H-74 Z" fill="#E4DED2" />
    <path d="M-92 0 L-74 74 M92 0 L74 74" strokeWidth={3} stroke="#9AA7B4" />
    {lid && <path d="M-100 -20 H100 L92 0 H-92 Z" fill="#D6CEBE" />}
    <path d="M-30 30 H30" strokeWidth={3} stroke="#8A99A8" />
  </g>
);

export const Parcel = ({
  x,
  y,
  scale = 1,
  open = false,
}: {
  x: number;
  y: number;
  scale?: number;
  open?: boolean;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} strokeLinejoin="round">
    <path d="M-90 -60 H90 V60 H-90 Z" fill="#D8C7A8" />
    <path d="M-90 -60 L-108 -84 H72 L90 -60 M0 -60 V60" fill="#C8B58F" />
    <path d="M-90 -60 L-108 -84 L-18 -84 L0 -60" fill="#E2D3B6" />
    {open && <path d="M-18 -84 L0 -60 L90 -60" fill={paper} />}
  </g>
);

export const Cup = ({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={4} fill={paper}>
    <path d="M-22 -48 H22 V-2 Q0 10 -22 -2 Z" />
    <path d="M22 -38 Q56 -46 52 -12 Q48 2 22 -6" fill="none" />
    <ellipse cy={-48} rx={22} ry={6} />
  </g>
);

export const Mirror = ({
  x,
  y,
  scale = 1,
  children,
}: {
  x: number;
  y: number;
  scale?: number;
  children?: ReactNode;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`} stroke={ink} strokeWidth={6}>
    <path d="M-150 170 V-120 Q-150 -210 0 -210 Q150 -210 150 -120 V170 Z" fill="#DDE7EC" />
    <path d="M-118 150 V-110 Q-118 -180 0 -180 Q118 -180 118 -110 V150 Z" fill="#EAF1F3" strokeWidth={3} />
    <path d="M-130 170 H130" strokeWidth={8} />
    <path d="M-96 -120 L96 -170" stroke={C.white} strokeWidth={12} opacity={0.7} />
    {children}
  </g>
);

export const PegRail = ({
  x,
  y,
  width = 620,
}: {
  x: number;
  y: number;
  width?: number;
}) => (
  <g transform={`translate(${x},${y})`} stroke={ink} strokeWidth={6}>
    <path d={`M0 0 H${width}`} strokeWidth={10} strokeLinecap="round" />
    {[0.2, 0.5, 0.8].map((at) => (
      <path key={at} d={`M${width * at} 0 V26`} strokeWidth={5} />
    ))}
  </g>
);

export const Shelf = ({
  x,
  y,
  width = 420,
}: {
  x: number;
  y: number;
  width?: number;
}) => (
  <g transform={`translate(${x},${y})`} stroke={ink} strokeWidth={5}>
    <path d={`M0 0 H${width} V18 H0 Z`} fill="var(--bn-wood, #C8BAA2)" />
    <path d={`M22 18 V110 M${width - 22} 18 V110`} />
  </g>
);

/** One horizontal obligation. Length never changes; only the pressure does. */
export const PriceBand = ({
  x,
  y,
  width = 720,
  height = 88,
  split = 0,
  lit = false,
  total,
  installment,
  coralEdge = false,
  opacity = 1,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  /** 0 = one band; 1 = fully divided into four cards. */
  split?: number;
  lit?: boolean;
  total?: string;
  installment?: string;
  coralEdge?: boolean;
  opacity?: number;
}) => {
  const gap = 10 * split;
  const segment = (width - gap * 3) / 4;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {coralEdge && <path d={`M0 -8 H${width}`} stroke={C.red} strokeWidth={7} strokeLinecap="round" />}
      {split <= 0 ? (
        <g>
          <rect width={width} height={height} rx={10} fill={C.yellow} stroke={ink} strokeWidth={4} />
          {total && (
            <text
              x={width / 2}
              y={height / 2 + 19}
              textAnchor="middle"
              fontSize={54}
              fontWeight={750}
              fill={ink}
              fontFamily="Inter, sans-serif"
            >
              {total}
            </text>
          )}
        </g>
      ) : (
        <g>
          {[0, 1, 2, 3].map((i) => {
            const span = segment * split;
            const sx = Math.min(width - span, i * (segment + gap) * split);
            const isLit = lit && i === 0;
            return (
              <g key={i} transform={`translate(${sx},0)`}>
                <rect
                  width={segment * split + (1 - split) * 0}
                  height={height}
                  rx={8}
                  fill={isLit ? C.yellow : quiet}
                  stroke={isLit ? ink : "var(--bn-line, #9AA7B4)"}
                  strokeWidth={isLit ? 4 : 2.5}
                />
                {i === 0 && installment && (
                  <text
                    x={(segment * split) / 2}
                    y={height / 2 + 17}
                    textAnchor="middle"
                    fontSize={42}
                    fontWeight={750}
                    fill={ink}
                    fontFamily="Inter, sans-serif"
                  >
                    {installment}
                  </text>
                )}
                {i > 0 && (
                  <g opacity={0.55} stroke="#5C6B7A" strokeWidth={3} strokeLinecap="round">
                    <path d={`M${segment * split * 0.25} ${height * 0.62} H${segment * split * 0.75}`} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

export const PaymentCard = ({
  x,
  y,
  scale = 1,
  lit = false,
  icon = "jacket",
  date,
  width = 150,
  height = 190,
}: {
  x: number;
  y: number;
  scale?: number;
  lit?: boolean;
  icon?: "jacket" | "headphones" | "shoes" | "ticket" | "watch" | "laptop";
  date?: string;
  width?: number;
  height?: number;
}) => {
  const Icon =
    icon === "jacket"
      ? Jacket
      : icon === "headphones"
        ? Headphones
        : icon === "shoes"
          ? Shoes
          : icon === "ticket"
            ? Ticket
            : icon === "watch"
              ? Watch
              : Laptop;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <rect
        width={width}
        height={height}
        rx={10}
        fill={paper}
        stroke={lit ? ink : "var(--bn-line, #A9B5C1)"}
        strokeWidth={lit ? 5 : 2.5}
        opacity={lit ? 1 : 0.82}
      />
      {lit && <rect width={width} height={12} rx={6} fill={C.yellow} stroke="none" />}
      {(() => {
        // Fit the illustration into the space above the date band (height - 48),
        // whatever card height the stage asks for, and centre it there.
        const top = 16;
        const bottom = height - 56;
        const iconScale = Math.min(0.42, ((bottom - top) / 210) * 0.92);
        const iconY = (top + bottom) / 2 - 65 * iconScale;
        return (
          <g opacity={lit ? 1 : 0.55}>
            {icon === "jacket" ? (
              <Jacket x={width / 2} y={iconY} scale={iconScale} hanger={false} />
            ) : (
              <Icon x={width / 2} y={iconY} scale={iconScale} />
            )}
          </g>
        );
      })()}
      <path d={`M12 ${height - 48} H${width - 12}`} stroke="var(--bn-line, #D3DBE3)" strokeWidth={2} />
      <text
        x={width / 2}
        y={height - 18}
        textAnchor="middle"
        fontSize={20}
        fontWeight={700}
        fill={ink}
        fillOpacity={lit ? 1 : 0.72}
        fontFamily="Inter, sans-serif"
      >
        {date ?? ""}
      </text>
    </g>
  );
};

export const CardColumn = ({
  x,
  y,
  count = 4,
  lit = true,
  icon = "jacket",
  dates = [],
  gap = 16,
  scale = 1,
  reveal = 1,
}: {
  x: number;
  y: number;
  count?: number;
  lit?: boolean;
  icon?: "jacket" | "headphones" | "shoes" | "ticket" | "watch" | "laptop";
  dates?: string[];
  gap?: number;
  scale?: number;
  reveal?: number;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    {Array.from({ length: count }, (_, i) => {
      const at = Math.max(0, Math.min(1, reveal * count - i));
      return (
        <g key={i} opacity={at} transform={`translate(0,${i * (190 + gap)})`}>
          <PaymentCard x={0} y={0} lit={lit && i === 0} icon={icon} date={dates[i]} />
        </g>
      );
    })}
  </g>
);

export const AccountBar = ({
  x,
  y,
  width = 900,
  reserved = 0.45,
  labels = false,
  savings = 0,
  repair = false,
  repairAt = 0,
}: {
  x: number;
  y: number;
  width?: number;
  reserved?: number;
  labels?: boolean;
  savings?: number;
  repair?: boolean;
  repairAt?: number;
}) => {
  const reservedWidth = Math.max(0, Math.min(0.82, reserved)) * width;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={width} height={92} rx={12} fill={paper} stroke={ink} strokeWidth={4} />
      <rect x={6} y={6} width={reservedWidth} height={80} rx={8} fill={C.red} opacity={0.82} />
      {Array.from({ length: Math.max(1, Math.round(reserved * 7)) }, (_, i) => (
        <path
          key={i}
          d={`M${6 + (reservedWidth / Math.max(1, Math.round(reserved * 7))) * (i + 1)} 8 V84`}
          stroke={paper}
          strokeWidth={3}
          opacity={0.55}
        />
      ))}
      <rect
        x={6 + reservedWidth + 6}
        y={6}
        width={Math.max(0, width - reservedWidth - 18)}
        height={80}
        rx={8}
        fill={quiet}
      />
      {repair && (
        <g transform={`translate(${width - 160},${-10})`} opacity={repairAt}>
          <rect width={130} height={112} rx={8} fill={C.red} stroke={ink} strokeWidth={4} />
          <Battery x={65} y={56} scale={0.7} dead />
        </g>
      )}
      {labels && (
        <g fontSize={22} fontWeight={700} fill={ink} fontFamily="Inter, sans-serif">
          <text x={10} y={124}>Committed</text>
          <text x={width - 10} y={124} textAnchor="end">Still free</text>
        </g>
      )}
      {savings > 0 && (
        <g transform={`translate(${width + 90},0)`}>
          {Array.from({ length: savings }, (_, i) => (
            <rect key={i} x={0} y={78 - i * 18} width={150} height={14} rx={5} fill={quiet} stroke={ink} strokeWidth={2} />
          ))}
          <text x={75} y={112} textAnchor="middle" fontSize={22} fontWeight={700} fill={ink} fontFamily="Inter, sans-serif">
            Savings
          </text>
        </g>
      )}
    </g>
  );
};

export const CalendarGrid = ({
  x,
  y,
  width = 1280,
  height = 620,
  dots = 0,
  extra = 0,
  cards = [],
  week = 0,
  opacity = 1,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  dots?: number;
  extra?: number;
  cards?: string[];
  week?: number;
  opacity?: number;
}) => {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const cellW = width / 5;
  const cellH = height / 4;
  const dotCells = [
    [1, 0],
    [3, 0],
    [0, 1],
    [3, 1],
    [1, 2],
    [2, 3],
  ];
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      {days.map((day, i) => (
        <text
          key={day}
          x={cellW * (i + 0.5)}
          y={-22}
          textAnchor="middle"
          fontSize={24}
          fontWeight={750}
          letterSpacing={2}
          fill={ink}
          fontFamily="Inter, sans-serif"
        >
          {day}
        </text>
      ))}
      {Array.from({ length: 4 }, (_, row) =>
        days.map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * cellW}
            y={row * cellH}
            width={cellW - 10}
            height={cellH - 10}
            rx={8}
            fill={row === week ? quiet : "none"}
            stroke={line}
            strokeWidth={row === week ? 4 : 2.5}
            opacity={0.8}
          />
        )),
      )}
      {dotCells.slice(0, dots).map(([col, row], i) => (
        <circle
          key={`dot-${i}`}
          cx={col * cellW + cellW / 2}
          cy={row * cellH + cellH / 2}
          r={17}
          fill={C.red}
        />
      ))}
      {dotCells.slice(dots, dots + extra).map(([col, row], i) => (
        <circle
          key={`extra-${i}`}
          cx={col * cellW + cellW / 2}
          cy={row * cellH + cellH / 2}
          r={13}
          fill="none"
          stroke={C.red}
          strokeWidth={4}
          opacity={0.45}
        />
      ))}
      {cards.slice(0, 4).map((date, i) => {
        const [col, row] = dotCells[i] ?? [i, 0];
        return (
          <g key={`card-${i}`} transform={`translate(${col * cellW + cellW / 2 - 54},${row * cellH + 12})`}>
            <rect width={108} height={96} rx={8} fill={paper} stroke={ink} strokeWidth={3} />
            <text x={54} y={40} textAnchor="middle" fontSize={22} fontWeight={750} fill={ink} fontFamily="Inter, sans-serif">
              {date}
            </text>
            <path d="M16 60 H92" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

export const NotificationCard = ({
  x,
  y,
  icon = "jacket",
  text = "Payment coming up",
  date = "TUE",
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  icon?: "jacket" | "headphones" | "shoes" | "ticket";
  text?: string;
  date?: string;
  scale?: number;
  opacity?: number;
}) => {
  const Icon = icon === "jacket" ? Jacket : icon === "headphones" ? Headphones : icon === "shoes" ? Shoes : Ticket;
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <rect width={560} height={132} rx={20} fill={paper} stroke={ink} strokeWidth={3} />
      <g transform="translate(64,66)">
        <Icon x={0} y={0} scale={0.34} />
      </g>
      <text x={130} y={54} fontSize={27} fontWeight={750} fill={ink} fontFamily="Inter, sans-serif">
        {text}
      </text>
      <text x={130} y={92} fontSize={23} fill={ink} fillOpacity={0.75} fontFamily="Inter, sans-serif">
        {date}
      </text>
    </g>
  );
};

export const Phone = ({
  x,
  y,
  scale = 1,
  rotate = 0,
  children,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  children?: ReactNode;
}) => (
  <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-130} y={-260} width={260} height={520} rx={38} fill={ink} />
    <rect x={-116} y={-240} width={232} height={474} rx={26} fill={paper} />
    <path d="M-26 -252 H26" stroke="#3A4D63" strokeWidth={8} strokeLinecap="round" />
    {children}
  </g>
);

export const Check = ({
  x,
  y,
  scale = 1,
  color = C.teal,
  progress = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  progress?: number;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <circle r={26} fill="none" stroke={color} strokeWidth={5} opacity={0.35} />
    <path
      d="M-12 0 L-3 10 L14 -12"
      fill="none"
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    />
  </g>
);

export const PlannedCard = ({
  x,
  y,
  scale = 1,
  checks = 0,
  label = "planned",
}: {
  x: number;
  y: number;
  scale?: number;
  checks?: number;
  label?: string;
}) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <rect width={430} height={250} rx={14} fill={paper} stroke={C.teal} strokeWidth={6} />
    <text x={24} y={44} fontSize={26} fontWeight={750} fill={C.teal} fontFamily="Inter, sans-serif">
      {label}
    </text>
    <g transform="translate(26,84)">
      <PriceBand x={0} y={0} width={378} height={64} split={1} lit installment="" />
    </g>
    {[0, 1, 2].map((i) => (
      <Check key={i} x={56 + i * 130} y={206} scale={0.72} progress={checks > i ? 1 : 0} />
    ))}
  </g>
);

export const WaitingRail = ({
  x,
  y,
  width = 760,
  retract = 0,
}: {
  x: number;
  y: number;
  width?: number;
  retract?: number;
}) => (
  <g transform={`translate(${x},${y})`} opacity={1 - retract * 0.9}>
    <path d={`M0 0 H${width}`} stroke={C.teal} strokeWidth={9} strokeLinecap="round" />
    <path d={`M0 0 V120 M${width} 0 V120`} stroke={C.teal} strokeWidth={4} opacity={0.5} />
  </g>
);
