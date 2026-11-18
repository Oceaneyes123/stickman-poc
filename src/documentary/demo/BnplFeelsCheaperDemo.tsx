import { AbsoluteFill, useCurrentFrame } from "remotion";
import demoAssetsRaw from "../../../videos/demo-bnpl-feels-cheaper/asset-manifest.json";
import demoCuesRaw from "../../../videos/demo-bnpl-feels-cheaper/cues.json";
import demoStoryboardRaw from "../../../videos/demo-bnpl-feels-cheaper/storyboard.json";
import { C } from "../../design/tokens";
import {
  buildInstallmentSchedule,
  summarizeObligations,
  type ObligationEntry,
} from "../../finance/math";
import type { CueFile } from "../../timeline/types";
import { createAssetRegistry, type AssetManifest } from "../assets";
import {
  DocumentaryScene,
  SceneTimeline,
  type DocumentarySceneDefinition,
  type TimelineEntry,
} from "../composer";
import { region } from "../core/geometry";
import {
  CauseEffectSequence,
  FinancialRelationship,
  ProcessDiagram,
} from "../diagrams";
import { DocumentComparison, ReceiptViewer } from "../evidence";
import {
  DocumentaryCalendar,
  InstallmentCardStack,
  ProductCardObject,
  ProductIllustration,
} from "../objects";
import {
  compileDocumentaryTimeline,
  type DocumentaryStoryboard,
} from "../timeline";
import {
  ContextualAnnotation,
  DocumentarySectionHeading,
  ExplanatoryCallout,
  FinancialLabelCard,
} from "../typography";
import {
  BankingAppScreen,
  CheckoutInterface,
  MobileNotificationStack,
} from "../ui";

const demoCues = demoCuesRaw as CueFile;
const demoStoryboard = demoStoryboardRaw as unknown as DocumentaryStoryboard;
const demoManifest = demoAssetsRaw as AssetManifest;
const demoRegistry = createAssetRegistry(demoManifest);

export const compiledBnplDemo = compileDocumentaryTimeline(
  demoCues,
  demoStoryboard,
);
export const BNPL_DEMO_DURATION = compiledBnplDemo.durationInFrames;

const jacketSchedule = buildInstallmentSchedule({
  title: "Canvas Field Jacket",
  total: 240,
  dates: ["Oct 1", "Oct 15", "Oct 29", "Nov 12"],
  daysOfMonth: [1, 15, 29, 12],
  paidCount: 1,
});

const headphonesSchedule = buildInstallmentSchedule({
  title: "Studio Headphones",
  total: 160,
  dates: ["Oct 4", "Oct 18", "Nov 1", "Nov 15"],
  daysOfMonth: [4, 18, 1, 15],
  paidCount: 1,
});

const monthObligations: ObligationEntry[] = [
  { id: "rent", label: "Rent & Utilities", category: "bill", amount: 1350, date: "Oct 1", dayOfMonth: 1 },
  { id: "j1", label: "Jacket 1/4", category: "bnpl", amount: jacketSchedule.installment, date: "Oct 1", dayOfMonth: 1 },
  { id: "h1", label: "Headphones 1/4", category: "bnpl", amount: headphonesSchedule.installment, date: "Oct 4", dayOfMonth: 4 },
  { id: "subs", label: "Subscriptions", category: "subscription", amount: 70, date: "Oct 10", dayOfMonth: 10 },
  { id: "j2", label: "Jacket 2/4", category: "bnpl", amount: jacketSchedule.installment, date: "Oct 15", dayOfMonth: 15 },
  { id: "repair", label: "Auto Service", category: "repair", amount: 380, date: "Oct 15", dayOfMonth: 15 },
  { id: "h2", label: "Headphones 2/4", category: "bnpl", amount: headphonesSchedule.installment, date: "Oct 18", dayOfMonth: 18 },
  { id: "j3", label: "Jacket 3/4", category: "bnpl", amount: jacketSchedule.installment, date: "Oct 29", dayOfMonth: 29 },
];

const obligationSummary = summarizeObligations(3000, monthObligations);

function buildDemoScenes(): TimelineEntry[] {
  const byId = new Map(compiledBnplDemo.scenes.map((s) => [s.id, s]));

  const s01 = byId.get("S01")!;
  const s02 = byId.get("S02")!;
  const s03 = byId.get("S03")!;
  const s04 = byId.get("S04")!;
  const s05 = byId.get("S05")!;
  const s06 = byId.get("S06")!;

  const defs: DocumentarySceneDefinition[] = [
    {
      id: s01.id,
      title: s01.title,
      durationInFrames: s01.durationInFrames,
      layout: "feature-left",
      backdrop: { preset: "editorial-navy", accentColor: C.yellow, gridLines: true },
      assetRegistry: demoRegistry,
      beats: s01.beats,
      layers: [
        {
          id: "S01-footage-context",
          kind: "video",
          depth: "background",
          assetId: "DM01",
          loop: true,
          tintOpacity: 0.62,
          essential: false,
          transform: { opacity: 0.55 },
        },
        {
          id: "S01-heading",
          kind: "text",
          depth: "foreground",
          region: region("feature-left", "main"),
          from: 4,
          render: ({ layerFrame, layerDuration }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 52 }}>
              <DocumentarySectionHeading
                eyebrow="THE FULL PRICE"
                title="One clear price before checkout"
                subtitle="Either spend the full amount today, or walk away."
                from={0}
                until={layerDuration}
                width={940}
                frame={layerFrame}
              />
              <FinancialLabelCard
                label="Sticker Price"
                amount={jacketSchedule.total}
                unitOrPeriod="one-time decision"
                tone="money"
                from={18}
                until={layerDuration}
                width={460}
                frame={layerFrame}
              />
              <ContextualAnnotation
                text="Full-price framing puts the entire cost in one moment."
                from={42}
                frame={layerFrame}
              />
            </div>
          ),
        },
        {
          id: "S01-product",
          kind: "object",
          depth: "midground",
          region: region("feature-left", "side"),
          from: 10,
          render: ({ layerFrame }) => (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 140 }}>
              <ProductCardObject
                kind="jacket"
                title="Canvas Field Jacket"
                subtitle="Standard retail tag · In stock"
                fullPrice={jacketSchedule.total}
                from={0}
                width={500}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: s02.id,
      title: s02.title,
      durationInFrames: s02.durationInFrames,
      layout: "feature-right",
      backdrop: { preset: "slate-board", accentColor: C.yellow, gridLines: true },
      focusTargets: [
        {
          id: "checkout-split-zoom",
          rect: { x: 966, y: 412, width: 788, height: 90 },
          from: 96,
          until: 220,
          zoom: 1,
          dimOpacity: 0.28,
          color: C.yellow,
        },
      ],
      layers: [
        {
          id: "S02-copy",
          kind: "text",
          depth: "foreground",
          region: region("feature-right", "side"),
          render: ({ layerFrame, layerDuration }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 26, paddingTop: 72 }}>
              <DocumentarySectionHeading
                eyebrow="CHECKOUT FRAMING"
                title="The button shrinks the first impression"
                from={0}
                until={layerDuration}
                width={650}
                frame={layerFrame}
              />
              <ExplanatoryCallout
                title="Same jacket. Same $240 price."
                detail="Only $60 leaves today, shifting the remaining $180 behind the click."
                from={46}
                width={580}
                frame={layerFrame}
              />
              <ContextualAnnotation
                text="4 equal biweekly drafts · Total obligation stays $240"
                from={84}
                frame={layerFrame}
              />
            </div>
          ),
        },
        {
          id: "S02-checkout-ui",
          kind: "ui",
          depth: "midground",
          region: region("feature-right", "main"),
          render: ({ layerFrame }) => (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 58 }}>
              <CheckoutInterface
                productName="Canvas Field Jacket"
                productArt={<ProductIllustration kind="jacket" size={92} />}
                fullPrice={jacketSchedule.total}
                dates={["Oct 1", "Oct 15", "Oct 29", "Nov 12"]}
                selectBnplAt={36}
                revealObligationsAt={130}
                highlightId={layerFrame >= 36 ? "pay-bnpl" : "pay-full"}
                zoomHighlight
                width={820}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: s03.id,
      title: s03.title,
      durationInFrames: s03.durationInFrames,
      layout: "stack",
      backdrop: { preset: "editorial-navy", accentColor: C.yellow, gridLines: true },
      layers: [
        {
          id: "S03-process",
          kind: "diagram",
          depth: "midground",
          region: { x: 96, y: 74, width: 1728, height: 350 },
          render: ({ layerFrame }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <ProcessDiagram
                title="One purchase creates four scheduled drafts"
                stages={jacketSchedule.items.map((item, i) => ({
                  id: `stage-${item.index}`,
                  stepNumber: item.index,
                  title: item.label,
                  subtitle: item.date,
                  amount: item.amount,
                  statusLabel: i === 0 ? "Paid at checkout" : "Future draft",
                  tone: i === 0 ? "money" : "cost",
                  revealedAt: i * 16,
                }))}
                activeStageId={layerFrame > 48 ? "stage-2" : "stage-1"}
                width={1728}
                frame={layerFrame}
              />
            </div>
          ),
        },
        {
          id: "S03-cards-and-receipt",
          kind: "object",
          depth: "foreground",
          region: { x: 96, y: 440, width: 1728, height: 560 },
          from: 18,
          render: ({ layerFrame }) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 40,
                paddingTop: 28,
              }}
            >
              <InstallmentCardStack
                itemTitle="Canvas Field Jacket"
                icon="jacket"
                total={jacketSchedule.total}
                dates={["Oct 1", "Oct 15", "Oct 29", "Nov 12"]}
                splitAt={16}
                width={920}
                frame={layerFrame}
              />
              <ReceiptViewer
                merchant="Mercer & Loom"
                receiptDate="Oct 1 · SplitPay · 4"
                items={[
                  {
                    id: "jacket",
                    label: "Canvas Field Jacket",
                    note: "4 installments of $60",
                    amount: jacketSchedule.total,
                  },
                ]}
                dueToday={jacketSchedule.dueToday}
                deferredAmount={jacketSchedule.futureCommitment}
                deferredLabel="Future drafts (Oct 15 – Nov 12)"
                width={560}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: s04.id,
      title: s04.title,
      durationInFrames: s04.durationInFrames,
      layout: "single",
      backdrop: { preset: "editorial-navy", accentColor: C.red, gridLines: true },
      layers: [
        {
          id: "S04-heading",
          kind: "text",
          depth: "foreground",
          region: { x: 96, y: 54, width: 1728, height: 112 },
          render: ({ layerFrame, layerDuration }) => (
            <DocumentarySectionHeading
              eyebrow="FUTURE WEEKS"
              title="Separate split plans meet on the same calendar"
              from={0}
              until={layerDuration}
              width={1360}
              frame={layerFrame}
            />
          ),
        },
        {
          id: "S04-calendar",
          kind: "object",
          depth: "midground",
          region: { x: 180, y: 182, width: 1560, height: 820 },
          render: ({ layerFrame }) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DocumentaryCalendar
                monthLabel="October — Scheduled Drafts"
                daysCount={31}
                startWeekdayOffset={1}
                events={[
                  { id: "j1", dayOfMonth: 1, label: "Jacket 1/4", amount: 60, category: "bnpl", revealedAt: 8 },
                  { id: "h1", dayOfMonth: 4, label: "Headphones 1/4", amount: 40, category: "bnpl", revealedAt: 28 },
                  { id: "j2", dayOfMonth: 15, label: "Jacket 2/4", amount: 60, category: "bnpl", revealedAt: 48 },
                  { id: "h2", dayOfMonth: 18, label: "Headphones 2/4", amount: 40, category: "bnpl", revealedAt: 68 },
                  { id: "j3", dayOfMonth: 29, label: "Jacket 3/4", amount: 60, category: "bnpl", revealedAt: 88 },
                  { id: "rent", dayOfMonth: 1, label: "Rent & Bills", amount: 1350, category: "bill", revealedAt: 112 },
                  { id: "subs", dayOfMonth: 10, label: "Subscriptions", amount: 70, category: "subscription", revealedAt: 126 },
                  { id: "repair", dayOfMonth: 15, label: "Auto Service", amount: 380, category: "repair", revealedAt: 145 },
                ]}
                width={1380}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: s05.id,
      title: s05.title,
      durationInFrames: s05.durationInFrames,
      layout: "split",
      backdrop: { preset: "slate-board", accentColor: C.red, gridLines: true },
      layers: [
        {
          id: "S05-left",
          kind: "diagram",
          depth: "midground",
          region: region("split", "left"),
          render: ({ layerFrame, layerDuration }) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 28 }}>
              <DocumentarySectionHeading
                eyebrow="COMPETING OBLIGATIONS"
                title="Ordinary bills share the same paycheck"
                from={0}
                until={layerDuration}
                width={820}
                frame={layerFrame}
              />
              <FinancialRelationship
                title="October Committed Claims vs Take-Home"
                sources={[
                  { id: "rent", label: "Rent & Utilities", sublabel: "Oct 1", amount: 1350, revealedAt: 8 },
                  { id: "repair", label: "Routine Auto Service", sublabel: "Oct 15 collision", amount: 380, revealedAt: 26 },
                  { id: "subs", label: "Subscriptions", sublabel: "Oct 10", amount: 70, revealedAt: 42 },
                  { id: "bnpl", label: "Stacked BNPL Drafts (Oct)", sublabel: "Jacket + Headphones", amount: obligationSummary.bnplTotal, revealedAt: 58 },
                ]}
                targetLabel="Monthly Take-Home Example"
                targetAmount={obligationSummary.income}
                targetNote={`Remaining uncommitted buffer: $${obligationSummary.uncommitted}`}
                width={840}
                frame={layerFrame}
              />
              <ContextualAnnotation
                text="Fictional monthly example; totals derived via summarizeObligations()."
                from={70}
                frame={layerFrame}
              />
            </div>
          ),
        },
        {
          id: "S05-right",
          kind: "ui",
          depth: "foreground",
          region: region("split", "right"),
          render: ({ layerFrame }) => (
            <div
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                paddingTop: 54,
              }}
            >
              <BankingAppScreen
                variant="mobile"
                brandName="Harbor Checking"
                initialBalance={1420}
                settledBalance={940}
                reservedUpcoming={200}
                settledReserved={580}
                transitionAt={80}
                activities={[
                  { id: "a1", title: "Jacket Draft 2/4", date: "Oct 15", amount: 60, status: "scheduled", nextStatus: "completed" },
                  { id: "a2", title: "Auto Service", date: "Oct 15", amount: 380, status: "pending", nextStatus: "completed" },
                  { id: "a3", title: "Headphones Draft 2/4", date: "Oct 18", amount: 40, status: "scheduled" },
                ]}
                highlightId="a1"
                width={410}
                frame={layerFrame}
              />
              <MobileNotificationStack
                brandName="Upcoming Alerts"
                timeOfDay="Tuesday, Oct 15"
                notifications={[
                  { id: "n1", app: "SplitPay", title: "Draft due today", detail: "Canvas Field Jacket · 2 of 4", amount: 60, timeLabel: "8:00 AM", tone: "warning", revealAt: 18 },
                  { id: "n2", app: "Garage", title: "Service invoice ready", detail: "Brake pads & inspection", amount: 380, timeLabel: "9:15 AM", tone: "urgent", revealAt: 52 },
                  { id: "n3", app: "SplitPay", title: "Upcoming in 3 days", detail: "Headphones · 2 of 4", amount: 40, timeLabel: "9:41 AM", tone: "info", revealAt: 86 },
                ]}
                highlightId="n2"
                width={410}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
    {
      id: s06.id,
      title: s06.title,
      durationInFrames: s06.durationInFrames,
      layout: "document-focus",
      backdrop: { preset: "dark-evidence", accentColor: C.teal, vignette: true },
      layers: [
        {
          id: "S06-summary",
          kind: "document",
          depth: "midground",
          region: { x: 160, y: 66, width: 1600, height: 950 },
          render: ({ layerFrame }) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
              }}
            >
              <DocumentComparison
                left={{
                  title: "What Checkout Emphasizes",
                  subtitle: "At the moment you click",
                  headlineLabel: "Due on purchase day",
                  headlineValue: "$60",
                  tone: "emphasis",
                  lines: [
                    "Small upfront impact today",
                    "Presented as 4 manageable steps",
                    "Future calendar overlap stays out of view",
                  ],
                }}
                right={{
                  title: "Full Commitment Created",
                  subtitle: "Across the next six weeks",
                  headlineLabel: "Full jacket price (or $400 stacked)",
                  headlineValue: "$240",
                  tone: "obligation",
                  lines: [
                    "Three $60 drafts locked onto future weeks",
                    "Competes with rent, subscriptions & repairs",
                    "Reduces uncommitted room when surprises arrive",
                  ],
                }}
                differenceSummary="A smaller first payment changes how the price feels—not the obligation you carry."
                revealDifferenceAt={34}
                width={1280}
                frame={layerFrame}
              />
              <CauseEffectSequence
                chain={[
                  {
                    id: "ce1",
                    role: "Trigger",
                    headline: "Split Checkout ($60)",
                    detail: "Lowers immediate friction at purchase.",
                    revealedAt: 54,
                  },
                  {
                    id: "ce2",
                    role: "Mechanism",
                    headline: "Future Drafts ($180 left)",
                    detail: "Reserve room across Oct 15 – Nov 12.",
                    revealedAt: 74,
                  },
                  {
                    id: "ce3",
                    role: "Consequence",
                    headline: "Tighter Cash Buffer",
                    detail: "Less room when routine costs arrive.",
                    revealedAt: 94,
                  },
                  {
                    id: "ce4",
                    role: "Alternative",
                    headline: "Check Full Month First",
                    detail: "Weigh $240 against already-booked dates.",
                    revealedAt: 114,
                  },
                ]}
                width={1280}
                frame={layerFrame}
              />
            </div>
          ),
        },
      ],
    },
  ];

  return defs.map((def, i) => {
    const compiled = compiledBnplDemo.scenes[i];
    return {
      id: def.id,
      from: compiled.from,
      durationInFrames: compiled.durationInFrames,
      join: compiled.transition,
      joinFrames: compiled.transitionFrames,
      render: (sceneFrame) => <DocumentaryScene scene={def} frame={sceneFrame} />,
    };
  });
}

const DEMO_TIMELINE_ENTRIES = buildDemoScenes();

export function BnplFeelsCheaperDemo() {
  return <SceneTimeline scenes={DEMO_TIMELINE_ENTRIES} />;
}

/**
 * P0-1 acceptance composition: combines local sample video footage, an SVG object,
 * animated typography labels, and a financial checkout interface with independently
 * controlled layer timing inside one documentary scene.
 */
export function DocumentaryMixedMediaShowcase() {
  const frame = useCurrentFrame();
  const scene: DocumentarySceneDefinition = {
    id: "MIXED-01",
    title: "Mixed-Media Layer Acceptance Scene",
    durationInFrames: 180,
    layout: "feature-right",
    backdrop: { preset: "editorial-navy", accentColor: C.teal },
    assetRegistry: demoRegistry,
    layers: [
      {
        id: "bg-video",
        kind: "video",
        depth: "background",
        assetId: "DM01",
        loop: true,
        tintOpacity: 0.55,
        essential: false,
      },
      {
        id: "svg-product",
        kind: "svg",
        depth: "midground",
        region: { x: 110, y: 120, width: 320, height: 320 },
        from: 10,
        until: 180,
        enterFrames: 14,
        render: () => (
          <g transform="translate(20,10)">
            <ProductIllustration kind="jacket" size={260} />
          </g>
        ),
      },
      {
        id: "anim-labels",
        kind: "text",
        depth: "foreground",
        region: { x: 96, y: 500, width: 650, height: 480 },
        from: 24,
        until: 180,
        render: ({ layerFrame, layerDuration }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <DocumentarySectionHeading
              eyebrow="MIXED-MEDIA COMPOSER"
              title="Footage + SVG + Labels + UI"
              from={0}
              until={layerDuration}
              width={640}
              frame={layerFrame}
            />
            <FinancialLabelCard
              label="Full Tag"
              amount={240}
              unitOrPeriod="vs $60 today"
              tone="money"
              from={14}
              until={layerDuration}
              width={420}
              frame={layerFrame}
            />
          </div>
        ),
      },
      {
        id: "checkout-panel",
        kind: "ui",
        depth: "midground",
        region: region("feature-right", "main"),
        from: 18,
        until: 180,
        enterFrames: 16,
        render: ({ layerFrame }) => (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}>
            <CheckoutInterface
              productName="Canvas Field Jacket"
              productArt={<ProductIllustration kind="jacket" size={92} />}
              fullPrice={240}
              selectBnplAt={48}
              revealObligationsAt={96}
              highlightId={layerFrame >= 48 ? "pay-bnpl" : "pay-full"}
              width={820}
              frame={layerFrame}
            />
          </div>
        ),
      },
    ],
  };

  return (
    <AbsoluteFill>
      <DocumentaryScene scene={scene} frame={frame} />
    </AbsoluteFill>
  );
}
