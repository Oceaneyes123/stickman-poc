import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { C, font } from "../../design/tokens";
import { Bill, MoneyStack } from "../../finance/components";
import { buildInstallmentSchedule, usd } from "../../finance/math";
import { FlipCard, PopIn } from "../../objects/motion";
import {
  Headphones,
  Jacket,
  PaymentCard,
  PriceBand,
  Shoes,
  Ticket,
  Watch,
} from "../../storyboard/BuyNowArt";
import { ramp } from "../core/keyframes";

export type ProductArtKind =
  | "jacket"
  | "headphones"
  | "shoes"
  | "watch"
  | "ticket";

export function ProductIllustration({
  kind,
  size = 180,
}: {
  kind: ProductArtKind;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="-120 -130 240 240">
      {kind === "jacket" && <Jacket x={0} y={-20} scale={0.95} />}
      {kind === "headphones" && <Headphones x={0} y={10} scale={1.1} />}
      {kind === "shoes" && <Shoes x={0} y={0} scale={1.05} />}
      {kind === "watch" && <Watch x={0} y={0} scale={0.95} />}
      {kind === "ticket" && <Ticket x={0} y={0} scale={0.95} />}
    </svg>
  );
}

/**
 * Reusable product prop keeping visual identity consistent while financing options change.
 */
export function ProductCardObject({
  kind,
  title,
  subtitle,
  fullPrice,
  highlightPrice = true,
  from = 0,
  width = 460,
  frame: frameOverride,
}: {
  kind: ProductArtKind;
  title: string;
  subtitle?: string;
  fullPrice: number;
  highlightPrice?: boolean;
  from?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 16, "out");

  return (
    <div
      style={{
        width,
        background: C.white,
        color: C.navy,
        borderRadius: 18,
        border: `3px solid ${C.navy}`,
        boxShadow: "0 20px 44px rgba(8, 16, 28, 0.28)",
        padding: "22px 26px",
        fontFamily: font,
        opacity: p,
        transform: `translateY(${14 * (1 - p)}px) scale(${0.96 + 0.04 * p})`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: 220,
          borderRadius: 14,
          background: "#EFF3F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          position: "relative",
        }}
      >
        <ProductIllustration kind={kind} size={200} />
        {highlightPrice && (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              background: C.yellow,
              color: C.navy,
              border: `2.5px solid ${C.navy}`,
              borderRadius: 10,
              padding: "6px 14px",
              fontSize: 30,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {usd(fullPrice)}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800 }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: 18, color: "#475569", marginTop: 4 }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

/**
 * Animates one purchase splitting into 4 dated installment cards (reusing BuyNowArt's
 * `PriceBand` + `PaymentCard` plus `PopIn` from `src/objects/motion.tsx`).
 */
export function InstallmentCardStack({
  itemTitle,
  icon = "jacket",
  total,
  dates = ["Today", "Day 14", "Day 28", "Day 42"],
  splitAt = 16,
  from = 0,
  width = 820,
  frame: frameOverride,
}: {
  itemTitle: string;
  icon?: "jacket" | "headphones" | "shoes" | "ticket" | "watch";
  total: number;
  dates?: readonly string[];
  splitAt?: number;
  from?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const schedule = buildInstallmentSchedule({
    title: itemTitle,
    total,
    dates,
    paidCount: 1,
  });
  const split = ramp(frame, splitAt, 22, "out");

  return (
    <div style={{ width, fontFamily: font }}>
      <svg width={width} height={360} viewBox="0 0 820 360" style={{ overflow: "visible" }}>
        <PriceBand
          x={50}
          y={12}
          width={720}
          height={82}
          split={split}
          lit={split > 0.25}
          total={usd(schedule.total)}
          installment={usd(schedule.installment)}
          coralEdge={split > 0.5}
        />
        {schedule.items.map((item, idx) => {
          const cardP = ramp(frame, splitAt + idx * 6, 14, "out");
          return (
            <g
              key={item.index}
              transform={`translate(${66 + idx * 180},${128 + (1 - cardP) * 24})`}
              opacity={cardP}
            >
              <PaymentCard
                x={0}
                y={0}
                lit={idx === 0}
                icon={icon}
                date={`${item.date} · ${usd(item.amount)}`}
                width={156}
                height={200}
              />
            </g>
          );
        })}
        <PopIn
          x={40}
          y={53}
          size={24}
          from={from}
          until={from + 600}
          frame={frame}
          color={C.yellow}
        />
      </svg>
    </div>
  );
}

export type CalendarEventChip = {
  id: string;
  dayOfMonth: number;
  label: string;
  amount: number;
  category: "bnpl" | "bill" | "subscription" | "repair" | "loan";
  revealedAt?: number;
};

const CHIP_STYLE: Record<
  CalendarEventChip["category"],
  { bg: string; border: string; text: string }
> = {
  bnpl: { bg: "#FEF3C7", border: C.yellow, text: C.navy },
  bill: { bg: "#E2E8F0", border: C.line, text: C.navy },
  subscription: { bg: "#F1F5F9", border: "#94A3B8", text: C.navy },
  repair: { bg: "#FEE2E2", border: C.red, text: "#991B1B" },
  loan: { bg: "#FFF1F2", border: C.red, text: "#991B1B" },
};

/**
 * Documentary monthly calendar choreography where dated BNPL payments and ordinary
 * bills land on explicit dates, highlighting days where obligations compete.
 */
export function DocumentaryCalendar({
  monthLabel,
  daysCount = 28,
  startWeekdayOffset = 1,
  events,
  highlightCollisions = true,
  width = 1040,
  frame: frameOverride,
}: {
  monthLabel: string;
  daysCount?: number;
  startWeekdayOffset?: number;
  events: readonly CalendarEventChip[];
  highlightCollisions?: boolean;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const cells = Array.from(
    { length: Math.ceil((daysCount + startWeekdayOffset) / 7) * 7 },
    (_, i) => {
      const day = i - startWeekdayOffset + 1;
      return day >= 1 && day <= daysCount ? day : null;
    },
  );

  return (
    <div
      style={{
        width,
        background: C.white,
        color: C.navy,
        borderRadius: 18,
        border: `3px solid ${C.navy}`,
        boxShadow: "0 20px 44px rgba(8, 16, 28, 0.25)",
        padding: "20px 24px",
        fontFamily: font,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800 }}>{monthLabel}</div>
        <div style={{ display: "flex", gap: 14, fontSize: 15, fontWeight: 700 }}>
          <span style={{ color: "#92400E" }}>● Scheduled installment</span>
          <span style={{ color: "#475569" }}>● Monthly bill</span>
          <span style={{ color: "#991B1B" }}>● Competing / unexpected</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {weekdays.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 15,
              fontWeight: 800,
              color: "#475569",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
        }}
      >
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                style={{
                  minHeight: 110,
                  borderRadius: 10,
                  background: "#F1F5F9",
                }}
              />
            );
          }
          const dayEvents = events.filter(
            (e) => e.dayOfMonth === day && frame >= (e.revealedAt ?? 0),
          );
          const hasCollision = highlightCollisions && dayEvents.length > 1;
          return (
            <div
              key={day}
              style={{
                minHeight: 110,
                borderRadius: 10,
                padding: 8,
                background: hasCollision ? "#FFF1F2" : "#F8FAFC",
                border: hasCollision
                  ? `2.5px solid ${C.red}`
                  : "1px solid #CBD5E1",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: hasCollision ? "#991B1B" : "#475569",
                }}
              >
                {day}
              </div>
              {dayEvents.map((ev) => {
                const p = ramp(frame, ev.revealedAt ?? 0, 10, "out");
                const chip = CHIP_STYLE[ev.category];
                return (
                  <div
                    key={ev.id}
                    style={{
                      opacity: p,
                      background: chip.bg,
                      borderLeft: `4px solid ${chip.border}`,
                      borderRadius: 5,
                      padding: "3px 6px",
                      fontSize: 13,
                      fontWeight: 750,
                      color: chip.text,
                      lineHeight: 1.2,
                    }}
                  >
                    {ev.label} · {usd(ev.amount)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BillAndReceiptObject({
  items,
  paid = false,
  from = 0,
  flip = false,
  frame: frameOverride,
}: {
  items: { label: string; amount: number }[];
  paid?: boolean;
  from?: number;
  flip?: boolean;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 16, "out");

  return (
    <div style={{ position: "relative", opacity: p }}>
      <Bill items={items} paid={paid} />
      {flip && (
        <svg
          width={80}
          height={80}
          viewBox="-40 -40 80 80"
          style={{ position: "absolute", top: -24, right: -24 }}
        >
          <FlipCard x={0} y={0} size={46} from={from} until={from + 240} frame={frame} />
        </svg>
      )}
    </div>
  );
}

export function CurrencyTokenGroup({
  leftAmount,
  leftLabel,
  rightAmount,
  rightLabel,
  maxAmount = 500,
  from = 0,
}: {
  leftAmount: number;
  leftLabel: string;
  rightAmount: number;
  rightLabel: string;
  maxAmount?: number;
  from?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 48,
        alignItems: "flex-end",
        fontFamily: font,
      }}
    >
      <MoneyStack
        amount={leftAmount}
        maxAmount={maxAmount}
        color={C.yellow}
        from={from}
        label={leftLabel}
      />
      <MoneyStack
        amount={rightAmount}
        maxAmount={maxAmount}
        color={C.red}
        from={from + 10}
        label={rightLabel}
      />
    </div>
  );
}

export function BankCardObject({
  brand = "Cedar Bank",
  label = "Checking Debit",
  lastFour = "4108",
  tone = "navy",
  from = 0,
  width = 360,
  frame: frameOverride,
}: {
  brand?: string;
  label?: string;
  lastFour?: string;
  tone?: "navy" | "teal" | "yellow";
  from?: number;
  width?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 16, "out");
  const bg = tone === "teal" ? C.teal : tone === "yellow" ? C.yellow : C.navy;
  const fg = tone === "navy" ? C.white : C.navy;

  return (
    <div
      style={{
        width,
        height: Math.round(width * 0.62),
        borderRadius: 18,
        background: bg,
        color: fg,
        border: `3px solid ${tone === "navy" ? C.yellow : C.navy}`,
        padding: "20px 24px",
        boxSizing: "border-box",
        fontFamily: font,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity: p,
        transform: `translateY(${12 * (1 - p)}px)`,
        boxShadow: "0 18px 36px rgba(8, 16, 28, 0.25)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 800 }}>{brand}</span>
        <div style={{ width: 42, height: 30, borderRadius: 6, background: C.yellow, border: `2px solid ${C.navy}` }} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
        •••• •••• •••• {lastFour}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, opacity: 0.85 }}>{label}</div>
    </div>
  );
}

export function PhoneDeviceObject({
  children,
  from = 0,
  frame: frameOverride,
}: {
  children: ReactNode;
  from?: number;
  frame?: number;
}) {
  const current = useCurrentFrame();
  const frame = frameOverride ?? current;
  const p = ramp(frame, from, 16, "out");

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${16 * (1 - p)}px)`,
      }}
    >
      {children}
    </div>
  );
}
