import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { progress } from "../animation/motion";
import { C, font } from "../design/tokens";
import { debtTotal, sum, usd } from "./math";
export const MoneyCounter = ({
  value,
  from = 0,
  duration = 35,
  prefix = "",
}: {
  value: number;
  from?: number;
  duration?: number;
  prefix?: string;
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {prefix}
      {usd(Math.round(value * progress(frame, from, duration)))}
    </>
  );
};
export const MoneyStack = ({
  amount,
  maxAmount = 1000,
  color = C.yellow,
  from = 0,
  duration = 35,
  label = "Remaining",
}: {
  amount: number;
  maxAmount?: number;
  color?: string;
  from?: number;
  duration?: number;
  label?: string;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  // Stack height is proportional to amount on a stated shared scale; bills are symbolic.
  const height = Math.min(1, Math.max(0, amount / maxAmount)) * 170 * p;
  return (
    <div style={{ width: 300, textAlign: "center" }}>
      <svg width={300} height={220} viewBox="0 0 300 220">
        <path d="M 30 210 H 270" stroke={C.line} strokeWidth={2} />
        {Array.from({ length: 5 }, (_, i) => (
          <g
            key={i}
            transform={`translate(0,${210 - (height * (i + 1)) / 5})`}
            opacity={p}
          >
            <path
              d="M 50 0 L 200 0 L 250 -23 L 100 -23 Z"
              fill={color}
              stroke={C.navy}
              strokeWidth={4}
            />
            <path
              d="M 50 0 v 9 H 200 l 50 -23 v -9"
              fill={color}
              stroke={C.navy}
              strokeWidth={3}
            />
            <path d="M 118 -11 h 62" stroke={C.navy} strokeWidth={4} />
          </g>
        ))}
      </svg>
      <div style={{ fontSize: 70, fontWeight: 750, color }}>
        <MoneyCounter value={amount} from={from} duration={duration} />
      </div>
      <div style={{ fontSize: 30, color: C.muted }}>{label}</div>
    </div>
  );
};
export const Wallet = ({
  open = false,
  amount = 0,
  direction = "none",
  from = 0,
  duration = 36,
}: {
  open?: boolean;
  amount?: number;
  direction?: "in" | "out" | "none";
  from?: number;
  duration?: number;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  return (
    <svg width={260} height={210} viewBox="0 0 260 210">
      {direction !== "none" && (
        <g
          opacity={Math.sin(p * Math.PI)}
          transform={`translate(90,${direction === "in" ? 5 + p * 60 : 65 - p * 60})`}
        >
          <rect width={90} height={45} rx={5} fill={C.yellow} />
          <text x={45} y={30} textAnchor="middle" fill={C.navy} fontSize={26}>
            $
          </text>
        </g>
      )}
      {open && (
        <path
          d="M 40 75 L 45 27 Q 50 18 62 24 L 220 65 V 105 Z"
          fill={C.panel}
          stroke={C.yellow}
          strokeWidth={5}
        />
      )}
      <rect x={32} y={75} width={200} height={112} rx={18} fill={C.yellow} />
      <path d="M 35 96 H 225" stroke={C.navy} strokeWidth={3} />
      <rect x={162} y={111} width={76} height={45} rx={10} fill={C.panel} />
      <circle cx={184} cy={133} r={6} fill={C.yellow} />
      {open && amount === 0 && (
        <text x={124} y={150} textAnchor="middle" fontSize={24} fill={C.navy}>
          EMPTY
        </text>
      )}
    </svg>
  );
};
export const Expense = ({
  label,
  amount,
  color = C.red,
}: {
  label: string;
  amount: number;
  color?: string;
}) => (
  <div
    style={{
      borderLeft: `7px solid ${color}`,
      padding: "18px 27px",
      background: C.panel,
      borderRadius: 8,
      width: 470,
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 36, color: C.white, marginBottom: 9 }}>{label}</div>
    <div style={{ color, fontSize: 54, fontWeight: 750 }}>
      +{usd(amount)}
      <span style={{ fontSize: 27, fontWeight: 450 }}> / month</span>
    </div>
  </div>
);
export const Bill = ({
  items,
  paid = false,
}: {
  items: { label: string; amount: number }[];
  paid?: boolean;
}) => (
  <div
    style={{
      width: 370,
      background: C.white,
      color: C.navy,
      padding: 26,
      borderRadius: 8,
      boxSizing: "border-box",
    }}
  >
    <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 16 }}>
      MONTHLY BILL
    </div>
    {items.map((item) => (
      <div
        key={item.label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 25,
          marginBottom: 12,
        }}
      >
        <span>{item.label}</span>
        <span>{usd(item.amount)}</span>
      </div>
    ))}
    <div
      style={{
        borderTop: `2px solid ${C.line}`,
        paddingTop: 16,
        fontSize: 36,
        fontWeight: 800,
      }}
    >
      {usd(sum(items.map((item) => item.amount)))}
    </div>
    <div
      style={{
        fontSize: 24,
        marginTop: 12,
        color: paid ? "#147575" : "#B33535",
      }}
    >
      {paid ? "PAID ✓" : "DUE · payment pending"}
    </div>
  </div>
);
export const DebtMeter = ({
  principal,
  annualRate,
  months,
  paid = 0,
  from = 0,
}: {
  principal: number;
  annualRate: number;
  months: number;
  paid?: number;
  from?: number;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, 90);
  const total = debtTotal(principal, annualRate, months * p);
  return (
    <div style={{ width: 470 }}>
      <div style={{ fontSize: 30 }}>Illustrative debt · no payments</div>
      <div style={{ fontSize: 58, color: C.red, fontWeight: 750 }}>
        {usd(total)}
      </div>
      <div
        style={{
          height: 20,
          background: C.line,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(1, paid / total) * 100}%`,
            height: "100%",
            background: C.teal,
          }}
        />
      </div>
      <div style={{ fontSize: 24, color: C.muted, lineHeight: 1.6 }}>
        Principal {usd(principal)} · interest {usd(total - principal)}
        <br />
        {Math.round(annualRate * 100)}% APR · {months} months · paid {usd(paid)}
      </div>
    </div>
  );
};
export const BarChart = ({
  items,
  max,
  from = 0,
  duration = 40,
}: {
  items: { label: string; value: number; color: string }[];
  max: number;
  from?: number;
  duration?: number;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  return (
    <svg
      width={720}
      height={420}
      viewBox="0 0 720 420"
      style={{ overflow: "visible", fontFamily: font }}
    >
      {[0, 0.5, 1].map((tick) => (
        <g key={tick}>
          <path
            d={`M 100 ${330 - tick * 260} H 690`}
            stroke={C.line}
            strokeWidth={2}
          />
          <text
            x={80}
            y={340 - tick * 260}
            fill={C.muted}
            fontSize={25}
            textAnchor="end"
          >
            {usd(max * tick)}
          </text>
        </g>
      ))}
      {items.map((item, index) => {
        const spacing = 560 / items.length;
        const x = 135 + index * spacing;
        const h = (Math.max(0, item.value) / max) * 260 * p;
        return (
          <g key={item.label}>
            <rect
              x={x}
              y={330 - h}
              width={Math.min(150, spacing - 40)}
              height={h}
              rx={8}
              fill={item.color}
            />
            <text
              x={x + Math.min(150, spacing - 40) / 2}
              y={310 - h}
              fill={item.color}
              fontSize={40}
              fontWeight={750}
              textAnchor="middle"
            >
              {usd(Math.round(item.value * p))}
            </text>
            <text
              x={x + Math.min(150, spacing - 40) / 2}
              y={382}
              fill={C.white}
              fontSize={28}
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
export const MoneyFlow = ({
  nodes,
  from = 0,
  duration = 60,
}: {
  nodes: { label: string; amount: number; color?: string }[];
  from?: number;
  duration?: number;
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, from, duration);
  return (
    <svg width={900} height={160} viewBox="0 0 900 160">
      {nodes.map((node, i) => {
        const x = 80 + i * (720 / Math.max(1, nodes.length - 1));
        return (
          <g key={node.label} transform={`translate(${x},0)`}>
            {i < nodes.length - 1 && (
              <>
                <path
                  d={`M 90 65 H ${720 / (nodes.length - 1) - 75}`}
                  stroke={C.line}
                  strokeWidth={5}
                />
                <path
                  d={`M 90 65 H ${720 / (nodes.length - 1) - 75}`}
                  stroke={C.yellow}
                  strokeWidth={5}
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                />
                <circle
                  cx={90 + p * (720 / (nodes.length - 1) - 165)}
                  cy={65}
                  r={7}
                  fill={C.yellow}
                />
              </>
            )}
            <rect
              x={-70}
              y={20}
              width={160}
              height={90}
              rx={12}
              fill={C.panel}
            />
            <text
              x={10}
              y={77}
              fontSize={35}
              fill={node.color ?? C.white}
              fontWeight={750}
              textAnchor="middle"
            >
              {usd(node.amount)}
            </text>
            <text
              x={10}
              y={148}
              fill={C.muted}
              fontSize={27}
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
export const FinanceLabel = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 28, color: C.muted }}>{children}</div>
);
