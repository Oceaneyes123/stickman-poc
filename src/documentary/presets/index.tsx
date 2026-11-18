import { C } from "../../design/tokens";
import type { DocumentarySceneDefinition, LayerSpec } from "../composer/types";
import { region } from "../core/geometry";
import {
  CauseEffectSequence,
  type CauseEffectNode,
} from "../diagrams";
import { DocumentComparison, type DocumentComparisonProps } from "../evidence";
import {
  DocumentaryCalendar,
  ProductCardObject,
  type CalendarEventChip,
  type ProductArtKind,
} from "../objects";
import {
  ContextualAnnotation,
  DocumentarySectionHeading,
  FinancialLabelCard,
} from "../typography";
import { CheckoutInterface } from "../ui";

export function createProductFramingScene(params: {
  id: string;
  title: string;
  durationInFrames: number;
  eyebrow: string;
  heading: string;
  productKind: ProductArtKind;
  productTitle: string;
  productSubtitle?: string;
  fullPrice: number;
  annotation: string;
  extraLayers?: LayerSpec[];
}): DocumentarySceneDefinition {
  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout: "feature-left",
    backdrop: { preset: "editorial-navy", accentColor: C.yellow, gridLines: true },
    layers: [
      {
        id: `${params.id}-heading`,
        kind: "text",
        depth: "foreground",
        region: region("feature-left", "main"),
        from: 0,
        render: ({ layerFrame, layerDuration }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 40 }}>
            <DocumentarySectionHeading
              eyebrow={params.eyebrow}
              title={params.heading}
              from={0}
              until={layerDuration}
              width={860}
              frame={layerFrame}
            />
            <FinancialLabelCard
              label="Full sticker price"
              amount={params.fullPrice}
              unitOrPeriod="one-time purchase"
              tone="money"
              from={18}
              until={layerDuration}
              width={440}
              frame={layerFrame}
            />
            <ContextualAnnotation text={params.annotation} from={32} frame={layerFrame} />
          </div>
        ),
      },
      {
        id: `${params.id}-product`,
        kind: "object",
        depth: "midground",
        region: region("feature-left", "side"),
        from: 6,
        render: ({ layerFrame }) => (
          <div style={{ paddingTop: 120, display: "flex", justifyContent: "center" }}>
            <ProductCardObject
              kind={params.productKind}
              title={params.productTitle}
              subtitle={params.productSubtitle}
              fullPrice={params.fullPrice}
              from={0}
              frame={layerFrame}
            />
          </div>
        ),
      },
      ...(params.extraLayers ?? []),
    ],
  };
}

export function createCheckoutSplitScene(params: {
  id: string;
  title: string;
  durationInFrames: number;
  productName: string;
  fullPrice: number;
  selectBnplAt: number;
  revealObligationsAt: number;
  heading: string;
  annotation: string;
}): DocumentarySceneDefinition {
  const splitBox = region("feature-right", "main");
  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout: "feature-right",
    backdrop: { preset: "slate-board", accentColor: C.yellow },
    layers: [
      {
        id: `${params.id}-text`,
        kind: "text",
        depth: "foreground",
        region: region("feature-right", "side"),
        render: ({ layerFrame, layerDuration }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingTop: 80 }}>
            <DocumentarySectionHeading
              eyebrow="Checkout Framing"
              title={params.heading}
              from={0}
              until={layerDuration}
              width={620}
              frame={layerFrame}
            />
            <ContextualAnnotation text={params.annotation} from={20} frame={layerFrame} />
          </div>
        ),
      },
      {
        id: `${params.id}-checkout`,
        kind: "ui",
        depth: "midground",
        region: splitBox,
        render: ({ layerFrame }) => (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 48 }}>
            <CheckoutInterface
              productName={params.productName}
              fullPrice={params.fullPrice}
              selectBnplAt={params.selectBnplAt}
              revealObligationsAt={params.revealObligationsAt}
              highlightId={layerFrame >= params.selectBnplAt ? "pay-bnpl" : "pay-full"}
              width={780}
              frame={layerFrame}
            />
          </div>
        ),
      },
    ],
  };
}

export function createCalendarConvergenceScene(params: {
  id: string;
  title: string;
  durationInFrames: number;
  monthLabel: string;
  events: readonly CalendarEventChip[];
  heading: string;
}): DocumentarySceneDefinition {
  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout: "single",
    backdrop: { preset: "editorial-navy", gridLines: true },
    layers: [
      {
        id: `${params.id}-heading`,
        kind: "text",
        depth: "foreground",
        region: { x: 96, y: 54, width: 1728, height: 110 },
        render: ({ layerFrame, layerDuration }) => (
          <DocumentarySectionHeading
            title={params.heading}
            from={0}
            until={layerDuration}
            width={1200}
            frame={layerFrame}
          />
        ),
      },
      {
        id: `${params.id}-calendar`,
        kind: "object",
        depth: "midground",
        region: { x: 180, y: 170, width: 1560, height: 840 },
        render: ({ layerFrame }) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DocumentaryCalendar
              monthLabel={params.monthLabel}
              events={params.events}
              width={1320}
              frame={layerFrame}
            />
          </div>
        ),
      },
    ],
  };
}

export function createCommitmentComparisonScene(params: {
  id: string;
  title: string;
  durationInFrames: number;
  comparison: Omit<DocumentComparisonProps, "frame" | "width">;
  chain: readonly CauseEffectNode[];
}): DocumentarySceneDefinition {
  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout: "stack",
    backdrop: { preset: "dark-evidence", accentColor: C.teal },
    layers: [
      {
        id: `${params.id}-comp`,
        kind: "document",
        depth: "midground",
        region: { x: 160, y: 74, width: 1600, height: 500 },
        render: ({ layerFrame }) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <DocumentComparison {...params.comparison} width={1240} frame={layerFrame} />
          </div>
        ),
      },
      {
        id: `${params.id}-cause`,
        kind: "diagram",
        depth: "foreground",
        region: { x: 160, y: 650, width: 1600, height: 340 },
        from: 18,
        render: ({ layerFrame }) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CauseEffectSequence chain={params.chain} width={1240} frame={layerFrame} />
          </div>
        ),
      },
    ],
  };
}
