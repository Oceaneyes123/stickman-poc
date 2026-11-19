import { C } from "../../design/tokens";
import { region } from "../core/geometry";
import { MotionBox } from "../core/MotionWrapper";
import type { DocumentarySceneDefinition } from "../composer/types";
import { SourceCitation } from "../evidence";
import { DocumentarySectionHeading } from "../typography";
import type { CommonStageParams } from "./shared";

export type PolicyMatrixCell = {
  id: string;
  row: number;
  col: number;
  headline: string;
  detail: string;
  tone?: "money" | "cost" | "alternative" | "neutral";
  activeInStageId?: string;
};

const TONE_ACCENT = {
  money: C.yellow,
  cost: C.red,
  alternative: C.teal,
  neutral: "#64748B",
} as const;

export type PolicyMatrixStageParams = CommonStageParams & {
  eyebrow?: string;
  heading: string;
  rows: readonly string[];
  columns: readonly string[];
  cells: readonly PolicyMatrixCell[];
  sourceCredit?: string;
};

export function createPolicyMatrixStage(
  params: PolicyMatrixStageParams,
): DocumentarySceneDefinition {
  const layout = params.layout ?? "editorial-top-stage";
  const look = params.look ?? "editorial-paper";
  const motionProfile = params.motionProfile ?? "mechanical-snap";
  const headerRect =
    layout === "editorial-top-stage"
      ? region("editorial-top-stage", "header")
      : { x: 96, y: 64, width: 1728, height: 170 };
  const stageRect =
    layout === "editorial-top-stage"
      ? region("editorial-top-stage", "stage")
      : { x: 96, y: 260, width: 1728, height: 730 };

  return {
    id: params.id,
    title: params.title,
    durationInFrames: params.durationInFrames,
    layout,
    look,
    motionProfile,
    camera: params.camera,
    focusTargets: params.focusTargets,
    stages: params.stages,
    beats: params.beats,
    join: params.join,
    joinFrames: params.joinFrames,
    assetRegistry: params.assetRegistry,
    layers: [
      {
        id: `${params.id}-heading`,
        kind: "text",
        depth: "foreground",
        region: headerRect,
        render: ({ layerFrame, layerDuration, look: tokens }) => (
          <DocumentarySectionHeading
            eyebrow={params.eyebrow}
            title={params.heading}
            onDark={tokens.polarity !== "light"}
            from={0}
            until={layerDuration}
            width={Math.min(1280, headerRect.width)}
            frame={layerFrame}
          />
        ),
      },
      {
        id: `${params.id}-matrix`,
        kind: "diagram",
        depth: "midground",
        region: stageRect,
        from: 6,
        render: ({ layerFrame, layerDuration, look: tokens, activeStageId }) => {
          const isLight = tokens.polarity === "light";
          const colCount = params.columns.length;
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `240px repeat(${colCount}, minmax(0, 1fr))`,
                  gap: 16,
                  alignItems: "stretch",
                }}
              >
                <div />
                {params.columns.map((col, ci) => (
                  <div
                    key={ci}
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: tokens.ink,
                      borderBottom: `2.5px solid ${tokens.hairline}`,
                      paddingBottom: 10,
                    }}
                  >
                    {col}
                  </div>
                ))}

                {params.rows.flatMap((rowLabel, ri) => [
                  <div
                    key={`row-${ri}`}
                    style={{
                      fontSize: 21,
                      fontWeight: 800,
                      color: tokens.inkMuted,
                      display: "flex",
                      alignItems: "center",
                      paddingRight: 12,
                      borderRight: `2px solid ${tokens.hairline}`,
                    }}
                  >
                    {rowLabel}
                  </div>,
                  ...params.columns.map((_, ci) => {
                    const cell = params.cells.find(
                      (c) => c.row === ri && c.col === ci,
                    );
                    if (!cell) return <div key={`empty-${ri}-${ci}`} />;
                    const idx = ri * colCount + ci;
                    const accent = TONE_ACCENT[cell.tone ?? "neutral"];
                    const isActive =
                      Boolean(activeStageId) &&
                      cell.activeInStageId === activeStageId;
                    const isBoxed = params.container === "card" || params.container === "sheet" || !isLight;
                    const cellBg = isBoxed ? tokens.surface : "transparent";
                    const cellInk = isBoxed ? tokens.surfaceInk : tokens.ink;
                    const cellMuted = isBoxed ? tokens.surfaceInkMuted : tokens.inkMuted;

                    return (
                      <MotionBox
                        key={cell.id}
                        profile={motionProfile}
                        direction="up"
                        from={idx * 6}
                        until={layerDuration}
                        frame={layerFrame}
                        style={{
                          background: cellBg,
                          borderRadius: 14,
                          border: `2.5px solid ${isActive ? accent : tokens.hairline}`,
                          borderTop: `6px solid ${accent}`,
                          padding: "18px 20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          boxSizing: "border-box",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 23,
                            fontWeight: 800,
                            color: cellInk,
                          }}
                        >
                          {cell.headline}
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            lineHeight: 1.38,
                            color: cellMuted,
                          }}
                        >
                          {cell.detail}
                        </div>
                      </MotionBox>
                    );
                  }),
                ])}
              </div>
              {params.sourceCredit && (
                <div>
                  <SourceCitation
                    source={params.sourceCredit}
                    from={20}
                    frame={layerFrame}
                  />
                </div>
              )}
            </div>
          );
        },
      },
      ...(params.extraLayers ?? []),
    ],
  };
}
