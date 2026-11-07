import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Sam, Alex } from "./characters/ReferenceCharacterRig";
import { bankState, walkingSam } from "./scenes/bankModel";
import {
  BankActorView,
  BankExterior,
  BankInterior,
} from "./scenes/BankExample";
import { font } from "./design/tokens";

const Panel = ({
  x,
  y,
  title,
  children,
}: {
  x: number;
  y: number;
  title: string;
  children: React.ReactNode;
}) => (
  <g transform={`translate(${x},${y})`}>
    <rect
      width={576}
      height={430}
      rx={12}
      fill="#F8FAFC"
      stroke="#CDD5DC"
      strokeWidth={2}
    />
    <text x={24} y={42} fontSize={26} fontWeight={700} fill="#14243A">
      {title}
    </text>
    <svg
      y={62}
      width={576}
      height={352}
      viewBox="0 0 576 352"
      overflow="hidden"
    >
      {children}
    </svg>
  </g>
);

export const MovementReview = () => {
  const frame = useCurrentFrame();
  const walk = walkingSam(frame, 100, 460, 0, 138, false);
  const walker = { ...walk, scale: 1.05, y: 318 };
  const stop = {
    ...walkingSam(frame, 100, 420, 0, 83, true),
    scale: 1.05,
    y: 318,
  };
  const doorFrame = 90 + Math.min(59, Math.round(frame * 0.5));
  const door = bankState(doorFrame);
  const handoffFrame = 150 + frame;
  const handoff = bankState(handoffFrame);
  return (
    <AbsoluteFill style={{ background: "#EDF0F2", fontFamily: font }}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        role="img"
        aria-label="Five-second movement review: walking in both directions, stop and turn, opening a door, giving money, and gestures"
        style={{ fontFamily: font }}
      >
        <text x={64} y={70} fill="#14243A" fontSize={40} fontWeight={800}>
          MOVEMENT REVIEW
        </text>
        <text x={1856} y={68} textAnchor="end" fill="#64748B" fontSize={25}>
          5 seconds · one continuous frame
        </text>
        <Panel x={64} y={116} title="01  Walk right · Sam">
          <path d="M 28 324 H 548" stroke="#CBD5E1" strokeWidth={2} />
          <BankActorView actor={walker} identity="Sam" expression="neutral" />
        </Panel>
        <Panel x={672} y={116} title="02  Walk left · Alex">
          <path d="M 28 324 H 548" stroke="#CBD5E1" strokeWidth={2} />
          <BankActorView
            actor={{ ...walker, x: 576 - walker.x, facing: -1 }}
            identity="Alex"
          />
        </Panel>
        <Panel x={1280} y={116} title="03  Carry · stop · turn">
          <path d="M 28 324 H 548" stroke="#CBD5E1" strokeWidth={2} />
          <g
            transform={`translate(${stop.x + stop.rig.rightArm.end.x * stop.scale},${stop.y + stop.rig.rightArm.end.y * stop.scale})`}
          >
            <rect
              x={0}
              y={-5}
              width={47}
              height={25}
              rx={3}
              fill="#D1FAE5"
              stroke="#14243A"
              strokeWidth={2}
            />
            <text
              x={26}
              y={14}
              textAnchor="middle"
              fill="#10B981"
              fontSize={20}
              fontWeight={700}
            >
              $
            </text>
          </g>
          <BankActorView
            actor={stop}
            identity="Sam"
            hands={{ right: "fist" }}
          />
        </Panel>
        <Panel x={64} y={584} title="04  Reach · open · release door">
          <svg width={576} height={352} viewBox="1000 310 550 570">
            <BankExterior state={door} />
          </svg>
        </Panel>
        <Panel x={672} y={584} title="05  Approach · give · receive">
          <svg width={576} height={352} viewBox="520 330 860 560">
            <BankInterior state={handoff} frame={handoffFrame} />
          </svg>
        </Panel>
        <Panel x={1280} y={584} title="06  Wave · point · acknowledge">
          <path d="M 28 324 H 548" stroke="#CBD5E1" strokeWidth={2} />
          <Sam x={100} y={318} scale={0.9} gesture="wave" expression="happy" />
          <Alex
            x={285}
            y={318}
            scale={0.9}
            gesture="pointAt"
            expression="confident"
          />
          <Alex x={465} y={318} scale={0.9} gesture="nod" expression="happy" />
        </Panel>
        <text x={64} y={1055} fill="#64748B" fontSize={24}>
          Same rig and contact targets as BankExample · planted feet · forward
          knees · opposing arm swing
        </text>
      </svg>
    </AbsoluteFill>
  );
};
