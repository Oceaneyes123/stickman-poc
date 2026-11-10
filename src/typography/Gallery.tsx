import { useCurrentFrame } from "remotion";
import { NarrativeScene } from "../scenes/narrative";
import { C } from "../design/tokens";
import { example, calculateBudget } from "../finance/math";
import {
  AnimatedList,
  AnimatedNumber,
  AnimatedUnderline,
  ComparisonReveal,
  KineticHeadline,
  ObjectAttachedLabel,
  SectionHeading,
  TextMorph,
} from "./index";
import { clamp01 } from "./timing";
const budget = calculateBudget(example);
export function TypographyGallery() {
  const frame = useCurrentFrame();
  const objectX = 220 + 180 * clamp01((frame - 30) / 35);
  return (
    <NarrativeScene>
      {frame < 120 && (
        <>
          <KineticHeadline
            x={150}
            y={120}
            text="A raise creates room"
            from={10}
            until={120}
            unit="word"
            size={72}
            width={1500}
          />
          <rect
            x={objectX}
            y={440}
            width={260}
            height={240}
            fill={C.yellow}
            stroke={C.navy}
            strokeWidth={4}
          />
          <AnimatedNumber
            x={objectX + 30}
            y={580}
            value={example.raise}
            from={25}
            until={120}
            mode="odometer"
            size={80}
          />
          <ObjectAttachedLabel
            x={objectX + 350}
            y={460}
            object={{ x: objectX + 260, y: 500 }}
            text="Monthly increase"
            from={30}
            until={120}
          />
          <AnimatedUnderline
            x={objectX}
            y={715}
            width={260}
            from={40}
            until={120}
          />
        </>
      )}
      {frame >= 120 && frame < 240 && (
        <>
          <SectionHeading
            x={150}
            y={110}
            text="One plan, several commitments"
            from={120}
            until={240}
            size={48}
          />
          <AnimatedList
            x={180}
            y={350}
            from={130}
            until={240}
            gap={90}
            items={example.upgrades.map((item, i) => ({
              text: item.label,
              from: 130 + i * 15,
            }))}
          />
          <ComparisonReveal
            x={870}
            y={400}
            from={130}
            until={240}
            left={budget.before}
            right={budget.alex}
            leftAt={140}
            rightAt={170}
            differenceAt={210}
            width={480}
          />
        </>
      )}
      {frame >= 240 && (
        <>
          <SectionHeading
            x={150}
            y={110}
            text="A calculation becomes an action"
            from={240}
            until={360}
            size={48}
          />
          <KineticHeadline
            x={180}
            y={300}
            text="KEEP"
            unit="character"
            stagger={4}
            from={250}
            until={360}
            size={84}
          />
          <TextMorph
            x={180}
            y={650}
            before="Remaining"
            after="Saved"
            changeAt={295}
            destination={{ x: 1050, y: 650 }}
            from={245}
            until={360}
            size={64}
          />
        </>
      )}
    </NarrativeScene>
  );
}
