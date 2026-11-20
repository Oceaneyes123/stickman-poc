import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KineticCutaway } from "../cutaways/KineticCutaway";
import { C, font } from "../design/tokens";
import { calculateFreeShippingOrder, freeShippingExample, usd } from "../finance/math";
import {
  AnticipationFollow,
  ChainReaction,
  DrawOn,
  DropBounce,
  GrowBuild,
  PopIn,
  SplitAssemble,
  SpringWobble,
} from "../objects/motion";
import {
  CursorActor,
  DrawConnector,
  PresenterStage,
  ThresholdMeter,
  type CursorWaypoint,
} from "./actors";
import { DocumentaryScene, MotionBox, SceneTimeline, type TimelineEntry } from "./composer";
import { region } from "./core/geometry";
import { getLook, type LookId } from "./core/looks";
import { MOTION_PROFILE_IDS, MOTION_PROFILES } from "./core/motionProfiles";
import { ProductIllustration } from "./objects";
import { createPolicyMatrixStage } from "./stages";
import { DocumentarySectionHeading } from "./typography";

export const DYNAMIC_MOTION_GALLERY_PANELS = [
  "01 · Object Wrappers (Real Art)",
  "02 · Transform & Cascade Wrappers",
  "03 · Five Motion Profiles",
  "04 · Interactive Actors",
  "05 · Presenter Framing Modes",
  "06 · Act Look Surfaces (Light & Split)",
  "07 · Act Look Surfaces (Dark & Evidence)",
  "08 · Asymmetric & Borderless Layouts",
  "09 · Depth-Parallax Camera Rig",
  "10 · Match-Move Continuity Bridge",
  "11 · Composable Stage Archetypes",
  "12 · Parameterized Cutaway Sampler",
] as const;

export const DYNAMIC_MOTION_GALLERY_SLOT = 90;
export const DYNAMIC_MOTION_GALLERY_DURATION =
  DYNAMIC_MOTION_GALLERY_PANELS.length * DYNAMIC_MOTION_GALLERY_SLOT;

function GalleryHeader({
  title,
  index,
  onDark = true,
}: {
  title: string;
  index: number;
  onDark?: boolean;
}) {
  const fg = onDark ? C.white : C.navy;
  const muted = onDark ? C.muted : "#475569";
  const border = onDark ? C.line : "#CBD5E1";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 14,
        borderBottom: `2px solid ${border}`,
        marginBottom: 22,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: fg }}>
        <span style={{ color: onDark ? C.yellow : C.teal }}>Dynamic Motion</span> · {title}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: muted }}>
        Panel {index + 1} / {DYNAMIC_MOTION_GALLERY_PANELS.length}
      </div>
    </div>
  );
}

function SurfaceFrame({
  lookId,
  index,
  children,
}: {
  lookId: LookId;
  index: number;
  children: React.ReactNode;
}) {
  const look = getLook(lookId);
  const onDark = look.polarity !== "light";
  const bg =
    lookId === "split-contrast"
      ? `linear-gradient(90deg, ${look.bg} 0%, ${look.bg} 45%, ${look.bgSecondary} 45%, ${look.bgSecondary} 100%)`
      : `radial-gradient(circle at 24% 18%, ${look.bgSecondary} 0%, ${look.bg} 74%)`;

  return (
    <AbsoluteFill
      style={{
        background: bg,
        padding: "48px 96px",
        fontFamily: font,
        boxSizing: "border-box",
      }}
    >
      <GalleryHeader
        title={DYNAMIC_MOTION_GALLERY_PANELS[index]}
        index={index}
        onDark={onDark}
      />
      <div style={{ position: "relative", flex: 1, height: "100%" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
}

const MiniReceiptCard: React.FC<{ label: string; amount: string; accent: string }> = ({
  label,
  amount,
  accent,
}) => (
  <g>
    <rect
      x={-96}
      y={-64}
      width={192}
      height={128}
      rx={16}
      fill={C.white}
      stroke={C.navy}
      strokeWidth={4}
    />
    <rect x={-96} y={-64} width={192} height={24} rx={8} fill={accent} />
    <text
      x={0}
      y={6}
      textAnchor="middle"
      fontFamily={font}
      fontSize={22}
      fontWeight={750}
      fill={C.navy}
    >
      {label}
    </text>
    <text
      x={0}
      y={42}
      textAnchor="middle"
      fontFamily={font}
      fontSize={30}
      fontWeight={800}
      fill={C.navy}
    >
      {amount}
    </text>
  </g>
);

export function DynamicMotionGallery() {
  const frame = useCurrentFrame();
  const panelIndex = Math.min(
    DYNAMIC_MOTION_GALLERY_PANELS.length - 1,
    Math.floor(frame / DYNAMIC_MOTION_GALLERY_SLOT),
  );
  const local = frame % DYNAMIC_MOTION_GALLERY_SLOT;
  const order = calculateFreeShippingOrder();

  const cursorWaypoints: CursorWaypoint[] = [
    { at: 6, x: 180, y: 260, action: "move" },
    { at: 32, x: 540, y: 220, action: "click" },
    { at: 62, x: 760, y: 310, action: "recoil" },
  ];

  const bridgeDemoScenes: TimelineEntry[] = [
    {
      id: "bridge-a",
      from: 0,
      durationInFrames: 48,
      bridges: [
        {
          id: "shared-pill",
          rect: { x: 180, y: 280, width: 320, height: 150 },
          render: () => <BridgeCard title="Full Price" amount="$240" tone={C.yellow} />,
        },
      ],
      render: (_f, opts) => (
        <AbsoluteFill style={{ background: "#F4F2EB", padding: "64px 96px", fontFamily: font }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.navy, opacity: opts?.isBridgeJoin ? 0 : 1 }}>
            Scene A · Warm Paper Surface
          </div>
          {!opts?.isBridgeJoin && (
            <div style={{ position: "absolute", left: 180, top: 280, width: 320, height: 150 }}>
              <BridgeCard title="Full Price" amount="$240" tone={C.yellow} />
            </div>
          )}
        </AbsoluteFill>
      ),
    },
    {
      id: "bridge-b",
      from: 48,
      durationInFrames: 42,
      join: "match-position",
      joinFrames: 18,
      liveOverlap: true,
      bridges: [
        {
          id: "shared-pill",
          rect: { x: 1120, y: 420, width: 380, height: 170 },
          render: () => <BridgeCard title="Same Obligation" amount="$240" tone={C.teal} />,
        },
      ],
      render: (_f, opts) => (
        <AbsoluteFill style={{ background: C.navy, padding: "64px 96px", fontFamily: font }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: C.white }}>
            Scene B · Midnight Blueprint (Match-Move Handoff)
          </div>
          {!opts?.isBridgeJoin && (
            <div style={{ position: "absolute", left: 1120, top: 420, width: 380, height: 170 }}>
              <BridgeCard title="Same Obligation" amount="$240" tone={C.teal} />
            </div>
          )}
        </AbsoluteFill>
      ),
    },
  ];

  return (
    <AbsoluteFill>
      {panelIndex === 0 && (
        <SurfaceFrame lookId="editorial-paper" index={0}>
          <svg width={1728} height={840} viewBox="0 0 1728 840">
            <PopIn x={210} y={320} size={180} from={4} until={90} frame={local}>
              <MiniReceiptCard label="PopIn" amount="$240" accent={C.yellow} />
            </PopIn>
            <DropBounce x={620} y={560} size={180} from={8} until={90} frame={local}>
              <MiniReceiptCard label="DropBounce" amount="$60" accent={C.red} />
            </DropBounce>
            <AnticipationFollow
              x={840}
              y={320}
              size={180}
              distance={260}
              from={12}
              until={90}
              frame={local}
            >
              <MiniReceiptCard label="Anticipation" amount="$48" accent={C.teal} />
            </AnticipationFollow>
            <SpringWobble x={1480} y={320} size={180} from={16} until={90} frame={local}>
              <MiniReceiptCard label="Wobble" amount="$54" accent={C.yellow} />
            </SpringWobble>
          </svg>
        </SurfaceFrame>
      )}

      {panelIndex === 1 && (
        <SurfaceFrame lookId="midnight-blueprint" index={1}>
          <svg width={1728} height={840} viewBox="0 0 1728 840">
            <SplitAssemble x={260} y={360} size={190} from={0} until={90} frame={local}>
              <MiniReceiptCard label="SplitAssemble" amount="4 slices" accent={C.yellow} />
            </SplitAssemble>
            <GrowBuild
              x={680}
              y={660}
              size={84}
              stepSize={110}
              from={4}
              until={90}
              frame={local}
              items={[
                <rect key="1" x={-110} y={-34} width={220} height={68} rx={12} fill={C.teal} />,
                <rect key="2" x={-110} y={-34} width={220} height={68} rx={12} fill={C.yellow} />,
                <rect key="3" x={-110} y={-34} width={220} height={68} rx={12} fill={C.red} />,
              ]}
            />
            <ChainReaction
              x={1040}
              y={380}
              size={110}
              spacing={130}
              from={6}
              until={90}
              frame={local}
              items={[
                <rect key="a" x={-42} y={-76} width={84} height={152} rx={12} fill={C.red} />,
                <rect key="b" x={-42} y={-76} width={84} height={152} rx={12} fill={C.yellow} />,
                <rect key="c" x={-42} y={-76} width={84} height={152} rx={12} fill={C.teal} />,
              ]}
            />
            <DrawOn
              x={1490}
              y={540}
              size={140}
              pathD="M -80 40 L -20 -40 L 30 10 L 90 -70"
              from={6}
              until={90}
              frame={local}
            />
          </svg>
        </SurfaceFrame>
      )}

      {panelIndex === 2 && (
        <SurfaceFrame lookId="warm-studio" index={2}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, paddingTop: 90 }}>
            {MOTION_PROFILE_IDS.map((pid, idx) => {
              const spec = MOTION_PROFILES[pid];
              return (
                <MotionBox
                  key={pid}
                  profile={pid}
                  direction="up"
                  from={idx * 6}
                  until={90}
                  frame={local}
                  style={{
                    background: C.white,
                    border: `2.5px solid ${C.navy}`,
                    borderTop: `8px solid ${idx % 2 === 0 ? C.yellow : C.teal}`,
                    borderRadius: 16,
                    padding: "24px 20px",
                    minHeight: 320,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>
                      {spec.label}
                    </div>
                    <div style={{ fontSize: 16, color: "#475569", marginTop: 8 }}>
                      stagger {spec.staggerFrames}f · shift {spec.shiftPx}px
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 10, borderRadius: 5, background: "#E2E8F0", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.min(100, Math.round((spec.shiftPx / 68) * 100))}%`,
                          background: idx % 2 === 0 ? C.yellow : C.teal,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.4 }}>
                      enter {spec.enterFrames}f · {spec.useSpring ? `k=${spec.stiffness}` : spec.easing}
                    </div>
                  </div>
                </MotionBox>
              );
            })}
          </div>
        </SurfaceFrame>
      )}

      {panelIndex === 3 && (
        <SurfaceFrame lookId="midnight-blueprint" index={3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 40, paddingTop: 28 }}>
            <ThresholdMeter
              baseAmount={order.beforeSubtotal}
              threshold={freeShippingExample.threshold}
              addedAmount={freeShippingExample.addOn}
              baseLabel="Charger"
              addedLabel="Organizer"
              from={4}
              addAt={26}
              width={1100}
              frame={local}
            />
            <svg width={1600} height={380} viewBox="0 0 1600 380" style={{ overflow: "visible" }}>
              <rect x={80} y={80} width={300} height={110} rx={16} fill={C.panel} stroke={C.teal} strokeWidth={3} />
              <text x={230} y={144} textAnchor="middle" fill={C.white} fontSize={26} fontWeight={750}>
                Base Cart {usd(order.beforeSubtotal)}
              </text>
              <rect x={920} y={180} width={360} height={120} rx={16} fill={C.panel} stroke={C.yellow} strokeWidth={3} />
              <text x={1100} y={248} textAnchor="middle" fill={C.white} fontSize={26} fontWeight={750}>
                Threshold Cart {usd(order.subtotal)}
              </text>
              <DrawConnector
                from={{ x: 380, y: 135 }}
                to={{ x: 920, y: 240 }}
                kind="curved"
                label="+ Added item"
                startFrame={14}
                frame={local}
              />
            </svg>
          </div>
          <CursorActor waypoints={cursorWaypoints} frame={local} />
        </SurfaceFrame>
      )}

      {panelIndex === 4 && (
        <SurfaceFrame lookId="editorial-paper" index={4}>
          <svg width={1728} height={840} viewBox="0 0 1728 840">
            <PresenterStage
              identity="Sam"
              framing="side-left"
              x={360}
              y={780}
              scale={1.85}
              localFrame={local}
              absoluteFrame={local}
              pose="explaining"
              expression="confident"
              onDark={false}
            />
            <PresenterStage
              identity="Alex"
              framing="side-right"
              x={1360}
              y={780}
              scale={1.85}
              localFrame={local}
              absoluteFrame={local}
              pose="thinking"
              expression="curious"
              onDark={false}
            />
          </svg>
        </SurfaceFrame>
      )}

      {panelIndex === 5 && (
        <SurfaceFrame lookId="editorial-paper" index={5}>
          <LookSwatchGrid lookIds={["editorial-paper", "warm-studio", "split-contrast"]} />
        </SurfaceFrame>
      )}

      {panelIndex === 6 && (
        <SurfaceFrame lookId="high-contrast-ink" index={6}>
          <LookSwatchGrid lookIds={["midnight-blueprint", "evidence-desk", "high-contrast-ink", "mixed-media-scrim"]} />
        </SurfaceFrame>
      )}

      {panelIndex === 7 && (
        <SurfaceFrame lookId="midnight-blueprint" index={7}>
          <LayoutMiniGrid />
        </SurfaceFrame>
      )}

      {panelIndex === 8 && (
        <DocumentaryScene
          scene={{
            id: "gallery-parallax",
            title: "Depth Parallax Camera",
            durationInFrames: 90,
            layout: "hero-annotations",
            look: "midnight-blueprint",
            camera: {
              keyframes: [
                { at: 0, x: -24, y: 8, zoom: 1 },
                { at: 75, x: 34, y: -12, zoom: 1.09, easing: "outCubic" },
              ],
            },
            layers: [
              {
                id: "bg-ring",
                kind: "svg",
                depth: "background",
                essential: false,
                render: () => (
                  <g opacity={0.35}>
                    <circle cx={960} cy={540} r={420} fill="none" stroke={C.teal} strokeWidth={4} strokeDasharray="16 14" />
                    <circle cx={960} cy={540} r={290} fill="none" stroke={C.yellow} strokeWidth={2.5} />
                  </g>
                ),
              },
              {
                id: "mid-hero",
                kind: "object",
                depth: "midground",
                region: region("hero-annotations", "hero"),
                render: () => (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <ProductIllustration kind="jacket" size={280} />
                  </div>
                ),
              },
              {
                id: "fg-title",
                kind: "text",
                depth: "foreground",
                region: region("hero-annotations", "bottomNote"),
                render: ({ layerFrame, layerDuration }) => (
                  <DocumentarySectionHeading
                    eyebrow="DEPTH PARALLAX (0.22x / 1.0x / 1.15x)"
                    title="Background, subject, and callouts drift at separate speeds"
                    from={0}
                    until={layerDuration}
                    width={1100}
                    frame={layerFrame}
                  />
                ),
              },
            ],
          }}
          frame={local}
        />
      )}

      {panelIndex === 9 && <SceneTimeline scenes={bridgeDemoScenes} frame={local} />}

      {panelIndex === 10 && (
        <DocumentaryScene
          scene={createPolicyMatrixStage({
            id: "gallery-matrix",
            title: "Policy Matrix Archetype",
            durationInFrames: 90,
            look: "editorial-paper",
            eyebrow: "COMPOSABLE STAGE ARCHETYPE",
            heading: "Structured comparisons live directly on the paper surface",
            rows: ["Always Free", "Threshold Offer"],
            columns: ["Immediate Order", "Basket Size Incentive"],
            cells: [
              { id: "c1", row: 0, col: 0, headline: "Neutral choice", detail: "Customer buys only the item originally sought.", tone: "alternative" },
              { id: "c2", row: 0, col: 1, headline: "No cutoff pull", detail: "Zero condition pressure on add-on goods.", tone: "neutral" },
              { id: "c3", row: 1, col: 0, headline: "Fee friction", detail: "Visible shipping charge pushes comparison.", tone: "cost" },
              { id: "c4", row: 1, col: 1, headline: "Bunching past cutoff", detail: "Extra items fill the gap and often overshoot.", tone: "money" },
            ],
          })}
          frame={local}
        />
      )}

      {panelIndex === 11 && <CutawaySamplePanel frame={local} />}
    </AbsoluteFill>
  );
}

function BridgeCard({ title, amount, tone }: { title: string; amount: string; tone: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 18,
        background: C.white,
        border: `4px solid ${tone}`,
        boxShadow: "0 18px 40px rgba(8, 16, 28, 0.25)",
        padding: "22px 28px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        fontFamily: font,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 750, color: "#475569" }}>{title}</div>
      <div style={{ fontSize: 48, fontWeight: 850, color: C.navy }}>{amount}</div>
    </div>
  );
}

function LookSwatchGrid({ lookIds }: { lookIds: readonly LookId[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(4, lookIds.length)}, minmax(0, 1fr))`,
        gap: 24,
        paddingTop: 64,
      }}
    >
      {lookIds.map((id) => {
        const lk = getLook(id);
        const isSplit = id === "split-contrast";
        return (
          <div
            key={id}
            style={{
              background: isSplit
                ? `linear-gradient(90deg, ${lk.bg} 0%, ${lk.bg} 45%, ${lk.bgSecondary} 45%, ${lk.bgSecondary} 100%)`
                : lk.bg,
              borderRadius: 18,
              border: `2.5px solid ${lk.hairline}`,
              padding: "24px 22px",
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: lk.shadow,
            }}
          >
            <div
              style={{
                background: isSplit ? "rgba(14, 26, 43, 0.88)" : "transparent",
                padding: isSplit ? "10px 14px" : 0,
                borderRadius: isSplit ? 10 : 0,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, color: lk.ink }}>
                {lk.label}
              </div>
              <div style={{ fontSize: 16, color: lk.inkMuted, marginTop: 6 }}>
                polarity: {lk.polarity} · default: {lk.containerDefault}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ flex: 1, height: 18, borderRadius: 6, background: lk.money }} />
              <span style={{ flex: 1, height: 18, borderRadius: 6, background: lk.cost }} />
              <span style={{ flex: 1, height: 18, borderRadius: 6, background: lk.alternative }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LayoutMiniGrid() {
  const layoutList = [
    "asymmetric-65-35",
    "diagonal-flow",
    "hero-annotations",
    "editorial-top-stage",
    "rail-timeline",
    "presenter-split",
  ] as const;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, paddingTop: 28 }}>
      {layoutList.map((name) => {
        const rects = Object.entries(regionMap(name)).filter(([k]) => k !== "full");
        return (
          <div key={name} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <svg
              width={520}
              height={292}
              viewBox="0 0 1920 1080"
              style={{
                background: "#1B304C",
                borderRadius: 12,
                border: `2px solid ${C.line}`,
              }}
            >
              {rects.map(([key, r], idx) => (
                <g key={key}>
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.width}
                    height={r.height}
                    rx={12}
                    fill={idx === 0 ? "rgba(243,190,88,0.22)" : "rgba(57,184,182,0.22)"}
                    stroke={idx === 0 ? C.yellow : C.teal}
                    strokeWidth={6}
                  />
                  <text
                    x={r.x + 24}
                    y={r.y + 56}
                    fontSize={38}
                    fontWeight={800}
                    fill={C.white}
                  >
                    {key}
                  </text>
                </g>
              ))}
            </svg>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{name}</div>
          </div>
        );
      })}
    </div>
  );
}

function regionMap(layoutName: Parameters<typeof region>[0]) {
  const keys =
    layoutName === "asymmetric-65-35"
      ? ["primary", "rail"]
      : layoutName === "diagonal-flow"
        ? ["origin", "bridge", "outcome"]
        : layoutName === "hero-annotations"
          ? ["hero", "leftNote", "rightNote", "bottomNote"]
          : layoutName === "editorial-top-stage"
            ? ["header", "stage"]
            : layoutName === "rail-timeline"
              ? ["headline", "track", "detail"]
              : ["presenter", "graphic"];
  return Object.fromEntries(keys.map((k) => [k, region(layoutName, k)]));
}

export const CUTAWAY_PREVIEW_SPEC = {
  variant: "type-collage" as const,
  text: "Worth the real difference?",
  kicker: "PARAMETERIZED CUTAWAY",
  collageWords: [
    { text: "WORTH", x: 420, y: 465, rotate: -4, size: 84, color: C.navy },
    { text: "THE", x: 810, y: 450, rotate: 2, size: 64, color: "#64748B" },
    { text: "FULL", x: 1020, y: 485, rotate: -5, size: 112, color: C.teal },
    { text: "OUTLAY?", x: 560, y: 650, rotate: 2, size: 96, color: C.navy },
  ],
};

export function CutawaySamplePanel({ frame }: { frame: number }) {
  return (
    <KineticCutaway
      spec={CUTAWAY_PREVIEW_SPEC}
      duration={DYNAMIC_MOTION_GALLERY_SLOT}
      frame={frame}
    />
  );
}
