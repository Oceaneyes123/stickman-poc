import type { ReactNode } from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  Alex,
  Sam,
  CharacterFace,
  characterColors as K,
} from "./characters/ReferenceCharacterRig";
import {
  referenceExpressions,
  referencePoses,
} from "./characters/referenceModel";
import { font } from "./design/tokens";

const Page = ({ title, children }: { title: string; children: ReactNode }) => (
  <AbsoluteFill
    style={{ background: "#F5F1E8", fontFamily: font, color: K.ink }}
  >
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 50,
        color: "#5B6777",
        fontSize: 23,
        letterSpacing: 2,
      }}
    >
      THE MONEY TRAP / CHARACTER STUDY
    </div>
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 105,
        fontSize: 54,
        fontWeight: 800,
      }}
    >
      {title}
    </div>
    {children}
    <div
      style={{
        position: "absolute",
        left: 80,
        bottom: 28,
        fontSize: 22,
        color: "#5B6777",
      }}
    >
      Reference-led SVG rig · character review only · existing film unchanged
    </div>
  </AbsoluteFill>
);

export const CharacterStudy = () => (
  <>
    <Sequence durationInFrames={120} name="Sam and Alex / new design">
      <Page title="Simple. Expressive. Recognizable.">
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
          role="img"
          aria-label="Sam in a blue hoodie and Alex in a white collared shirt"
        >
          <rect x={80} y={220} width={850} height={735} rx={28} fill="white" />
          <rect x={990} y={220} width={850} height={735} rx={28} fill="white" />
          <Sam
            x={500}
            y={860}
            scale={2.05}
            expression="happy"
            gesture="wave"
            backpack
          />
          <Alex
            x={1390}
            y={860}
            scale={2.05}
            expression="confident"
            pose="explaining"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 250,
            fontSize: 36,
            fontWeight: 800,
            color: K.blue,
          }}
        >
          SAM
        </div>
        <div
          style={{
            position: "absolute",
            left: 1030,
            top: 250,
            fontSize: 36,
            fontWeight: 800,
            color: "#087B5B",
          }}
        >
          ALEX
        </div>
        <div
          style={{ position: "absolute", left: 120, top: 895, fontSize: 26 }}
        >
          Blue hoodie · optional backpack
        </div>
        <div
          style={{ position: "absolute", left: 1030, top: 895, fontSize: 26 }}
        >
          Round glasses · white shirt
        </div>
      </Page>
    </Sequence>
    <Sequence
      from={120}
      durationInFrames={120}
      name="12 expressions / both identities"
    >
      <Page title="One face system. Twelve readable expressions.">
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
          role="img"
          aria-label="Twelve expressions for both characters"
        >
          {referenceExpressions.map((expression, i) => {
            const x = 180 + (i % 6) * 310;
            const y = 340 + Math.floor(i / 6) * 360;
            return (
              <g key={expression}>
                <g transform={`translate(${x - 60},${y}) scale(1.1)`}>
                  <CharacterFace identity="Sam" expression={expression} />
                </g>
                <g transform={`translate(${x + 70},${y}) scale(1.1)`}>
                  <CharacterFace identity="Alex" expression={expression} />
                </g>
                <text
                  x={x + 5}
                  y={y + 118}
                  textAnchor="middle"
                  fill={K.ink}
                  fontFamily={font}
                  fontSize={28}
                  fontWeight={650}
                >
                  {expression}
                </text>
              </g>
            );
          })}
        </svg>
      </Page>
    </Sequence>
    <Sequence from={240} durationInFrames={180} name="Reference poses">
      <Page title="Hands and posture carry the story.">
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
          role="img"
          aria-label="Nine articulated poses"
        >
          {referencePoses
            .filter((pose) => pose !== "walking")
            .map((pose, i) => {
              const x = 220 + (i % 5) * 370;
              const y = 535 + Math.floor(i / 5) * 390;
              const Actor = i % 2 ? Alex : Sam;
              return (
                <g key={pose}>
                  <Actor
                    x={x}
                    y={y}
                    scale={1.05}
                    pose={pose}
                    expression={
                      pose === "celebrating"
                        ? "excited"
                        : pose === "stressed"
                          ? "stressed"
                          : pose === "confused"
                            ? "curious"
                            : pose === "slumped"
                              ? "sad"
                              : "neutral"
                    }
                  />
                  <text
                    x={x}
                    y={y + 42}
                    textAnchor="middle"
                    fill={K.ink}
                    fontFamily={font}
                    fontSize={27}
                    fontWeight={600}
                  >
                    {pose}
                  </text>
                </g>
              );
            })}
        </svg>
      </Page>
    </Sequence>
    <Sequence
      from={420}
      durationInFrames={180}
      name="Gesture and movement checks"
    >
      <Page title="Articulated motion. Fixed proportions.">
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
          role="img"
          aria-label="Celebration, pointing, wallet holding and planted-foot walking"
        >
          <Sam
            x={260}
            y={790}
            scale={1.65}
            pose="celebrating"
            expression="excited"
          />
          <Alex
            x={710}
            y={790}
            scale={1.65}
            gesture="pointAt"
            expression="confident"
          />
          <Sam
            x={1150}
            y={790}
            scale={1.65}
            gesture="holdWallet"
            expression="worried"
          />
          <Alex
            x={1510}
            y={790}
            scale={1.35}
            pose="walking"
            expression="neutral"
          />
          {["celebrate", "point", "hold wallet", "walk"].map((text, i) => (
            <text
              key={text}
              x={260 + i * 445}
              y={885}
              textAnchor="middle"
              fill={K.ink}
              fontFamily={font}
              fontSize={30}
            >
              {text}
            </text>
          ))}
        </svg>
      </Page>
    </Sequence>
  </>
);
