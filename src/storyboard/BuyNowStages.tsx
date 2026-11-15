/**
 * Data-driven staging for video 002. Each stage draws one storyboard scene from
 * the direction in the episode plan; camera moves are short and frame-driven.
 */
import { AbsoluteFill } from "remotion";
import { spring } from "remotion";
import type { ReactNode } from "react";
import { C } from "../design/tokens";
import { NarrativeScene } from "../scenes/narrative";
import { WritingDesk, DiningTable, Cup as EnvCup, StoryEnvironment, GroundShadow } from "../scenes/cinematicEnvironment";
import { referenceSkeleton, type ReferenceExpression, type ReferencePose } from "../characters/referenceModel";
import { ReferenceCharacterRig } from "../characters/ReferenceCharacterRig";
import type { CompiledFilmScene } from "./buyNowPlan";
import { BuyNowBackdrop } from "./BuyNowBackdrop";
import { lookForScene, lookVars, type Look } from "./buyNowLook";
import {
  AccountBar,
  Battery,
  CalendarGrid,
  CardColumn,
  Cup,
  Headphones,
  Jacket,
  Laptop,
  Mirror,
  NotificationCard,
  Parcel,
  PaymentCard,
  PegRail,
  Phone,
  PlannedCard,
  PriceBand,
  Shelf,
  Shoebox,
  Shoes,
  Ticket,
  WaitingRail,
  Watch,
} from "./BuyNowArt";

const FLOOR = 940;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const enter = (local: number, start: number, duration = 14) =>
  clamp(spring({ frame: local - start, fps: 30, config: { damping: 24, stiffness: 150, mass: 0.8 }, durationInFrames: duration }));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t);
const usd = (value: number) => `$${value.toLocaleString("en-US")}`;

type StageProps = { scene: CompiledFilmScene; local: number; duration: number };
/** The colour script is the room: every stage inherits its act's backdrop. */
const Scene = ({ scene, children }: { scene: CompiledFilmScene; children: ReactNode }) => {
  const look = lookForScene(scene.id);
  return (
    <NarrativeScene backdrop={<BuyNowBackdrop look={look} />} style={lookVars(look)}>
      {children}
    </NarrativeScene>
  );
};

/** Backing board that lifts cream cards off a coloured wall. */
const Plate = ({
  look,
  x,
  y,
  width,
  height,
}: {
  look: Look;
  x: number;
  y: number;
  width: number;
  height: number;
}) => (
  <g>
    <rect x={x + 14} y={y + 20} width={width} height={height} rx={38} fill="#0B1220" opacity={0.22} />
    <rect x={x} y={y} width={width} height={height} rx={32} fill={look.plate} />
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={32}
      fill="none"
      stroke="#0B1220"
      strokeOpacity={0.12}
      strokeWidth={3}
    />
  </g>
);

const Actor = ({
  who = "sam",
  x,
  y = FLOOR,
  scale = 2,
  facing = 1,
  pose = "standing",
  expression = "neutral",
  gesture,
  local,
  actionFrom = 0,
  shoes = false,
  jacket = false,
}: {
  who?: "sam" | "alex";
  x: number;
  y?: number;
  scale?: number;
  facing?: 1 | -1;
  pose?: ReferencePose;
  expression?: ReferenceExpression;
  gesture?: "shrug" | "pointAt" | "holdWallet" | "wave";
  local: number;
  actionFrom?: number;
  shoes?: boolean;
  jacket?: boolean;
}) => {
  const skeleton = referenceSkeleton({
    frame: local,
    pose,
    // A shot starts in the pose it declares. Blending up from standing made
    // every seated shot stand and sit again in its first 18 frames.
    fromPose: pose,
    gesture,
    actionFrom,
    blendFrames: 18,
  });
  return (
    <g>
      <ReferenceCharacterRig
        identity={who === "sam" ? "Sam" : "Alex"}
        skeleton={skeleton}
        x={x}
        y={y}
        scale={scale}
        facing={facing}
        expression={expression}
        pose={pose}
      />
      {shoes && (
        <g>
          {[skeleton.leftLeg, skeleton.rightLeg].map((leg, i) => (
            <g
              key={i}
              transform={`translate(${x + leg.end.x * scale * facing},${y + leg.end.y * scale}) scale(${scale * facing},${scale})`}
            >
              <Shoes x={0} y={-4} scale={0.34} />
            </g>
          ))}
        </g>
      )}
      {jacket && (
        <g transform={`translate(${x},${y - 330 * scale}) scale(${scale * facing},${scale})`} opacity={0.98}>
          <Jacket x={0} y={0} scale={0.3} hanger={false} />
        </g>
      )}
    </g>
  );
};

const TapRing = ({ x, y, p }: { x: number; y: number; p: number }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <g transform={`translate(${x},${y})`} opacity={1 - p}>
      <circle r={16 + 38 * p} fill="none" stroke={C.yellow} strokeWidth={6 - 3 * p} />
      <circle r={10} fill={C.yellow} />
    </g>
  );
};

const PhoneScreen = ({ screen, local }: { screen: NonNullable<CompiledFilmScene["screen"]>; local: number }) => {
  const p = enter(local, 6, 16);
  const icon =
    screen === "headphones" ? "headphones" : screen === "shoes" ? "shoes" : screen === "ticket" ? "ticket" : screen === "watch" ? "watch" : "jacket";
  if (screen === "off") return null;
  if (screen === "notifications" || screen === "lock") {
    return (
      <g opacity={p}>
        <text x={0} y={-190} textAnchor="middle" fontSize={20} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          09:41
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(-104,${-120 + i * 74})`} opacity={enter(local, 10 + i * 12, 12)}>
            <rect width={208} height={60} rx={10} fill="#EFF3F7" stroke={C.navy} strokeWidth={2} />
            <text x={12} y={25} fontSize={14} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
              Payment coming up
            </text>
            <text x={12} y={45} fontSize={12} fill="#6C7B8B" fontFamily="Inter, sans-serif">
              {["Jacket · TUE", "Headphones · THU", "Shoes · MON"][i]}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (screen === "bank") {
    return (
      <g opacity={p}>
        <text x={-100} y={-200} fontSize={18} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          Account
        </text>
        <rect x={-100} y={-176} width={200} height={34} rx={6} fill={C.yellow} stroke={C.navy} strokeWidth={2} />
        <rect x={-94} y={-170} width={94} height={22} rx={4} fill={C.red} opacity={0.8} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${-96 + i * 50},${-90})`}>
            <rect width={42} height={72} rx={4} fill={C.white} stroke={C.navy} strokeWidth={2} />
            <rect x={5} y={7} width={32} height={10} rx={2} fill={i === 0 ? C.yellow : "#DDE3E9"} />
            <text x={21} y={58} textAnchor="middle" fontSize={12} fill={C.navy} fontFamily="Inter, sans-serif">
              {["TUE", "THU", "MON", "THU"][i]}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (screen === "reminders") {
    return (
      <g opacity={p}>
        <text x={-100} y={-200} fontSize={16} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          Payment reminders
        </text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(-100,${-170 + i * 96})`} opacity={enter(local, 8 + i * 9, 10)}>
            <rect width={200} height={82} rx={8} fill="#EFF3F7" stroke={C.navy} strokeWidth={2} />
            <rect x={8} y={8} width={52} height={66} rx={4} fill={C.white} stroke="#A9B5C1" strokeWidth={2} />
            <text x={72} y={32} fontSize={13} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
              {["Jacket", "Headphones", "Shoes", "Tickets"][i]}
            </text>
            <text x={72} y={55} fontSize={12} fill="#6C7B8B" fontFamily="Inter, sans-serif">
              {["TUE", "THU", "MON", "THU"][i]}
            </text>
          </g>
        ))}
      </g>
    );
  }
  if (screen === "return") {
    return (
      <g opacity={p}>
        <text x={-100} y={-180} fontSize={17} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          Return
        </text>
        <rect x={-100} y={-150} width={200} height={60} rx={8} fill="#EFF3F7" stroke={C.navy} strokeWidth={2} />
        <text x={0} y={-112} textAnchor="middle" fontSize={15} fill={C.navy} fontFamily="Inter, sans-serif">
          Eligible
        </text>
        <rect x={-100} y={-60} width={200} height={54} rx={10} fill={C.teal} stroke={C.navy} strokeWidth={2} />
        <text x={0} y={-26} textAnchor="middle" fontSize={16} fontWeight={750} fill={C.white} fontFamily="Inter, sans-serif">
          Start return
        </text>
      </g>
    );
  }
  return (
    <g opacity={p}>
      <rect x={-104} y={-212} width={208} height={150} rx={8} fill="#EFF3F7" />
      <g transform="translate(0,-150)">
        {icon === "jacket" && <Jacket x={0} y={0} scale={0.52} hanger={false} />}
        {icon === "headphones" && <Headphones x={0} y={0} scale={0.6} kinked />}
        {icon === "shoes" && <Shoes x={0} y={0} scale={0.65} />}
        {icon === "ticket" && <Ticket x={0} y={0} scale={0.55} />}
        {icon === "watch" && <Watch x={0} y={0} scale={0.5} />}
      </g>
      <PriceBand x={-96} y={-42} width={192} height={44} total="$240" />
      <rect x={-96} y={18} width={192} height={46} rx={8} fill={C.navy} />
      <text x={0} y={47} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.white} fontFamily="Inter, sans-serif">
        Pay in four
      </text>
      {screen === "checkout" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={-96 + i * 49} y={78} width={44} height={58} rx={4} fill={i === 0 ? C.yellow : "#DDE3E9"} stroke={C.navy} strokeWidth={2} />
          ))}
        </g>
      )}
      <g transform="translate(-96,170)" opacity={0.55}>
        {[0, 1].map((i) => (
          <rect key={i} x={i * 46} width={38} height={52} rx={3} fill="#E3E8EE" stroke="#A9B5C1" strokeWidth={1.5} />
        ))}
      </g>
    </g>
  );
};

const DeskStage = ({ scene, local, duration }: StageProps) => {
  const camera = scene.camera;
  const p = local / duration;
  const scale = camera ? lerp(camera.from, camera.to, p) : 1;
  const cx = scene.x ?? 960;
  const cy = scene.y ?? 540;
  const phoneP = enter(local, 4, 16);
  return (
    <Scene scene={scene}>
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <PegRail x={1180} y={300} width={540} />
        <g transform="translate(1320,360)">
          <Jacket x={0} y={0} scale={0.7} />
        </g>
        <WritingDesk x={820} y={690} width={650} />
        <g transform="translate(1130,742)">
          <Headphones x={0} y={0} scale={0.8} kinked />
        </g>
        <Actor
          who={scene.who === "alex" ? "alex" : "sam"}
          x={scene.x ?? 650}
          y={scene.y ?? FLOOR}
          scale={scene.scale ?? 2}
          facing={scene.facing ?? 1}
          pose={scene.pose ?? "sitting"}
          expression={scene.expression ?? "neutral"}
          local={local}
          gesture={scene.props?.includes("shrug") ? "shrug" : undefined}
        />
        <g opacity={phoneP} transform={`translate(${scene.band === "split" ? 1060 : 1040},${scene.band === "split" ? 610 : 575})`}>
          <Phone x={0} y={0} scale={scene.band === "split" ? 0.8 : 0.62} rotate={-6}>
            <PhoneScreen screen={scene.screen ?? "jacket"} local={local} />
          </Phone>
        </g>
        {scene.tabHistory ? (
          <g transform="translate(760,330)" opacity={0.9}>
            {Array.from({ length: scene.tabHistory }, (_, i) => (
              <rect key={i} x={i * 54} y={i * 8} width={46} height={64} rx={4} fill="#E7ECF1" stroke="#9AA7B4" strokeWidth={2} />
            ))}
          </g>
        ) : null}
        {scene.props?.includes("parcel") && (
          <g transform="translate(1120,640)">
            <Parcel x={0} y={0} scale={0.8} open={p > 0.4} />
          </g>
        )}
      </g>
    </Scene>
  );
};

const CheckoutStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const split = clamp((p - 0.32) / 0.28);
  const button = enter(local, 14, 14);
  const tap = clamp((p - 0.72) / 0.2);
  const total = scene.text?.find((t) => t.value !== undefined)?.value;
  const noNumbers = scene.props?.includes("noNumbers") === true;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.05) translate(-960,-540)">
        <rect x={500} y={190} width={920} height={700} rx={18} fill="var(--bn-card, #F8FAFC)" stroke={C.navy} strokeWidth={5} filter="url(#cinema-shadow)" />
        <path d="M500 268 H1420" stroke={C.navy} strokeWidth={3} opacity={0.25} />
        <text x={540} y={238} fontSize={24} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif" letterSpacing={2}>
          CHECKOUT
        </text>
        <g transform="translate(690,430)">
          <Jacket x={0} y={0} scale={1.05} />
        </g>
        <text x={900} y={330} fontSize={34} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          Stone chore jacket
        </text>
        <text x={900} y={372} fontSize={22} fill="#6C7B8B" fontFamily="Inter, sans-serif">
          Size M · Stone
        </text>
        <g transform="translate(900,410)">
          <PriceBand
            x={0}
            y={0}
            width={440}
            height={78}
            total={noNumbers ? undefined : total ? usd(total) : "$240"}
          />
        </g>
        <g transform={`translate(900,520)`} opacity={button}>
          <rect width={250} height={62} rx={10} fill={C.navy} />
          <text x={125} y={40} textAnchor="middle" fontSize={24} fontWeight={700} fill={C.white} fontFamily="Inter, sans-serif">
            Pay in four
          </text>
          <TapRing x={210} y={52} p={tap} />
        </g>
        <g transform="translate(900,610)" opacity={split > 0 ? 1 : 0}>
          <PriceBand
            x={0}
            y={0}
            width={440}
            height={96}
            split={Math.max(0.15, split)}
            lit
            installment={noNumbers ? undefined : scene.text?.find((t) => t.text?.includes("$60"))?.text ?? "$60"}
          />
        </g>
        {scene.tabHistory ? (
          <g transform="translate(900,760)" opacity={0.8}>
            {Array.from({ length: scene.tabHistory }, (_, i) => (
              <g key={i} transform={`translate(${i * 58},0)`}>
                <rect width={48} height={62} rx={4} fill="#E7ECF1" stroke="#9AA7B4" strokeWidth={2} />
              </g>
            ))}
          </g>
        ) : null}
      </g>
    </Scene>
  );
};

const BandStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const look = lookForScene(scene.id);
  const total = scene.text?.find((t) => t.value !== undefined)?.value ?? 240;
  const noNumbers = scene.props?.includes("noNumbers") === true;
  const split = scene.band === "split" || scene.band === "compare" ? clamp((p - 0.25) / 0.3) : 0;
  const lift = clamp((p - 0.6) / 0.25);
  const showPlanned = scene.props?.includes("planned");
  const object = scene.props?.find((prop) => ["jacket", "headphones", "shoes", "ticket", "laptop", "watch"].includes(prop));
  return (
    <Scene scene={scene}>
      <g transform="translate(960,560) scale(1) translate(-960,-560)">
        <Plate look={look} x={500} y={140} width={1180} height={760} />
        {object && (
          <g transform="translate(960,240)">
            {object === "jacket" && <Jacket x={0} y={0} scale={0.8} />}
            {object === "headphones" && <Headphones x={0} y={0} scale={1} />}
            {object === "shoes" && <Shoes x={0} y={0} scale={1.1} />}
            {object === "ticket" && <Ticket x={0} y={0} scale={0.9} />}
            {object === "laptop" && <Laptop x={0} y={0} scale={1.1} />}
            {object === "watch" && <Watch x={0} y={0} scale={1} />}
          </g>
        )}
        {scene.band !== "none" && (
          <g>
            {scene.band === "compare" ? (
              <>
                <g transform="translate(600,330)">
                  <PriceBand x={0} y={0} width={720} height={86} total={noNumbers ? undefined : usd(total)} coralEdge />
                </g>
                <g transform="translate(600,500)">
                  <PriceBand x={0} y={0} width={720} height={86} split={Math.max(0.2, split)} lit installment={noNumbers ? undefined : "$60"} />
                </g>
              </>
            ) : (
              <g transform="translate(600,430)">
                <PriceBand
                  x={0}
                  y={0}
                  width={720}
                  height={100}
                  split={split}
                  lit
                  total={split === 0 && !noNumbers ? usd(total) : undefined}
                  installment={noNumbers ? undefined : "$60"}
                />
              </g>
            )}
          </g>
        )}
        {scene.props?.includes("thumb") && (
          <g transform={`translate(${lerp(1420, 1190, lift)},${lerp(560, 500, lift)})`}>
            <path d="M0 0 Q-18 -50 8 -70 Q34 -88 44 -60 L54 10 Q56 44 24 46 Q-6 46 0 0 Z" fill="#E8C4A8" stroke={C.navy} strokeWidth={4} />
          </g>
        )}
        {showPlanned && (
          <g transform="translate(1240,620)">
            <PlannedCard x={0} y={0} scale={0.9} checks={Math.round(clamp((p - 0.45) / 0.35) * 3)} />
          </g>
        )}
        {scene.account && (
          <g transform="translate(420,760)">
            <AccountBar
              x={0}
              y={0}
              width={1080}
              reserved={scene.account.reserved ?? 0.45}
              labels={scene.account.labels}
              savings={scene.account.savings ?? 0}
              repair={scene.account.repair}
              repairAt={enter(local, 18, 14)}
            />
          </g>
        )}
      </g>
    </Scene>
  );
};

const ColumnsStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const look = lookForScene(scene.id);
  const count = scene.columns ?? 4;
  const icons = ["jacket", "headphones", "shoes", "ticket"] as const;
  const dates = ["TUE", "THU", "MON", "THU"];
  // Centre the columns themselves; two columns used to sit left of a four-column plate.
  const columnsWidth = (count - 1) * 345 + 93;
  const start = scene.who === "sam" ? 430 : 960 - columnsWidth / 2;
  const plateWidth = scene.props?.includes("calendar") ? 1360 : columnsWidth + 140;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,560) scale(1) translate(-960,-560)">
        <Plate look={look} x={start - 70} y={240} width={plateWidth} height={620} />
        {Array.from({ length: count }, (_, i) => {
          const reveal = clamp((p - 0.05 - i * 0.12) / 0.3);
          return (
            <g key={i} transform={`translate(${start + i * 345},${300})`}>
              <CardColumn
                x={0}
                y={0}
                count={scene.cards ?? 4}
                icon={icons[i]}
                dates={dates}
                scale={0.7}
                reveal={reveal}
                lit={i === 0 || i === count - 1 || scene.lit !== false}
              />
            </g>
          );
        })}
        {scene.props?.includes("calendar") && (
          <g transform="translate(430,690)">
            <CalendarGrid x={0} y={0} width={1280} height={220} dots={4} cards={["TUE", "THU", "MON", "THU"]} opacity={0.8} />
          </g>
        )}
        {scene.who === "sam" && (
          <Actor x={290} y={FLOOR} scale={1.75} local={local} pose="standing" expression={scene.expression ?? "neutral"} />
        )}
      </g>
    </Scene>
  );
};

const CalendarStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const look = lookForScene(scene.id);
  const dots = scene.calendar?.dots ?? 0;
  const extra = scene.calendar?.extra ?? 0;
  const cards = scene.calendar?.cards ?? [];
  const shown = Math.round(clamp((p - 0.1) / 0.6) * (cards.length || dots));
  return (
    <Scene scene={scene}>
      <g transform="translate(960,560) scale(1.02) translate(-960,-560)">
        <Plate look={look} x={270} y={180} width={1380} height={720} />
        <CalendarGrid
          x={320}
          y={260}
          width={1280}
          height={620}
          dots={Math.min(dots, shown)}
          extra={Math.min(extra, Math.max(0, shown - dots))}
          cards={cards.slice(0, Math.min(cards.length, shown))}
          week={scene.calendar?.week ?? 0}
        />
        {scene.who === "sam" && (
          <Actor
            x={scene.facing === -1 ? 1600 : 260}
            y={FLOOR}
            scale={1.7}
            facing={scene.facing ?? 1}
            local={local}
            pose={scene.pose ?? "standing"}
            expression={scene.expression ?? "neutral"}
          />
        )}
      </g>
    </Scene>
  );
};

const NotificationsStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const count = scene.notifications ?? 3;
  const icons = ["jacket", "headphones", "shoes", "ticket"] as const;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540)">
        <rect x={-320} y={-430} width={640} height={860} rx={48} fill={C.navy} />
        <rect x={-300} y={-410} width={600} height={820} rx={34} fill="var(--bn-card, #EDF1F5)" />
        <text x={150} y={-360} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
          09:41
        </text>
        {Array.from({ length: count }, (_, i) => (
          <g key={i} transform={`translate(${-260},${-300 + i * 170})`} opacity={enter(local, 6 + i * 16, 16)}>
            <NotificationCard x={0} y={0} icon={icons[i]} date={["TUE", "THU", "MON", "THU"][i]} text="Payment coming up" />
          </g>
        ))}
        {scene.props?.includes("bar") && (
          <g transform={`translate(-260,${count >= 3 ? 250 : 120})`} opacity={0.9}>
            <AccountBar x={0} y={0} width={520} reserved={0.36} />
          </g>
        )}
        <TapRing x={180} y={330} p={clamp((p - 0.7) / 0.2)} />
      </g>
    </Scene>
  );
};

const AccountStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const look = lookForScene(scene.id);
  const account = scene.account ?? {};
  const repairAt = clamp((p - 0.25) / 0.35);
  const cards = scene.cards ?? 0;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,520)">
        <Plate look={look} x={-560} y={-240} width={1200} height={620} />
        <AccountBar
          x={-540}
          y={-60}
          width={1080}
          reserved={account.reserved ?? 0.45}
          labels={account.labels}
          savings={account.savings ?? 0}
          repair={account.repair}
          repairAt={repairAt}
        />
        {account.payday && (
          <g>
            <path d="M500 -110 V90" stroke={C.navy} strokeWidth={3} strokeDasharray="9 9" />
            <text x={500} y={-126} textAnchor="middle" fontSize={20} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
              Next payday
            </text>
          </g>
        )}
        {cards > 0 && (
          <g transform="translate(-520,120)">
            {Array.from({ length: cards }, (_, i) => (
              <g key={i} transform={`translate(${i * 132},0)`} opacity={enter(local, 14 + i * 8, 12)}>
                <PaymentCard x={0} y={0} width={112} height={150} icon={(["jacket", "headphones", "shoes", "ticket"] as const)[i]} date={["TUE", "THU", "MON", "THU"][i]} />
              </g>
            ))}
          </g>
        )}
        {scene.props?.includes("transfer") && (
          <g opacity={enter(local, 10, 16)}>
            <path d="M600 -30 C700 -90 760 -90 820 -30" stroke={C.teal} strokeWidth={8} fill="none" markerEnd="url(#arrow-teal)" />
            <defs>
              <marker id="arrow-teal" markerWidth={12} markerHeight={12} refX={8} refY={6} orient="auto">
                <path d="M0 0 L12 6 L0 12 Z" fill={C.teal} />
              </marker>
            </defs>
          </g>
        )}
        {scene.props?.includes("negations") && (
          <g transform="translate(-540,190)">
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(${i * 360},0)`} opacity={enter(local, 10 + i * 14, 12)}>
                <rect width={320} height={88} rx={10} fill={C.white} stroke="#A9B5C1" strokeWidth={2.5} strokeDasharray="8 8" />
                <text x={160} y={52} textAnchor="middle" fontSize={22} fontWeight={700} fill="#6C7B8B" fontFamily="Inter, sans-serif">
                  {["No overdue", "No missed payment", "No extra fees"][i]}
                </text>
              </g>
            ))}
          </g>
        )}
      </g>
    </Scene>
  );
};

const CarStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const click = Math.max(0, Math.min(1, (p - 0.2) / 0.12));
  const click2 = Math.max(0, Math.min(1, (p - 0.42) / 0.12));
  const dead = p > 0.55;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.02) translate(-960,-540)">
        <StoryEnvironment
          location="old-rental"
          cabin={{
            outside: "#1B3350",
            outsideGlow: "#E08A4A",
            body: "#24384F",
            seat: "#6B5748",
          }}
        />
        <Actor
          who="sam"
          x={560}
          y={880}
          scale={1.7}
          facing={1}
          pose="sitting"
          expression={dead ? "worried" : scene.expression ?? "neutral"}
          local={local}
        />
        <g transform="translate(1030,690)">
          <path d="M0 0 V-90" stroke={C.navy} strokeWidth={10} strokeLinecap="round" />
          <circle r={26} fill={C.white} stroke={C.navy} strokeWidth={5} />
          <path d="M-12 0 H12" stroke={C.navy} strokeWidth={6} />
          <TapRing x={0} y={0} p={click} />
          <TapRing x={0} y={0} p={click2} />
        </g>
        <g transform="translate(1290,420)" opacity={dead ? 1 : 0.45}>
          <Battery x={0} y={0} scale={1} dead={dead} />
        </g>
        {dead && (
          <g transform="translate(1290,500)">
            <rect x={-78} y={-32} width={156} height={50} rx={12} fill="var(--bn-card, #F8FAFC)" stroke={C.navy} strokeWidth={3} />
            <text y={4} textAnchor="middle" fontSize={24} fontWeight={750} fill={C.red} fontFamily="Inter, sans-serif">
              battery
            </text>
          </g>
        )}
      </g>
    </Scene>
  );
};

const CafeStage = ({ scene, local }: StageProps) => {
  const icons = ["jacket", "headphones", "shoes", "ticket"] as const;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.04) translate(-960,-540)">
        <DiningTable x={960} y={790} />
        <Actor who="sam" x={560} y={FLOOR} scale={1.9} facing={1} pose="sitting" expression={scene.expression ?? "neutral"} local={local} gesture={scene.props?.includes("shrug") ? "shrug" : undefined} />
        <Actor who="alex" x={1380} y={FLOOR} scale={1.9} facing={-1} pose="sitting" expression="neutral" local={local} />
        <EnvCup x={900} y={742} />
        <EnvCup x={1050} y={742} />
        {scene.props?.includes("phone") && (
          <g transform="translate(760,700) rotate(-8)">
            <rect width={120} height={210} rx={16} fill={C.navy} />
            <rect x={8} y={8} width={104} height={194} rx={10} fill={C.white} />
            <rect x={20} y={40} width={80} height={22} rx={4} fill={C.yellow} />
            <rect x={20} y={80} width={80} height={16} rx={4} fill="#DDE3E9" />
          </g>
        )}
        {scene.props?.includes("band") && (
          <g transform="translate(620,470)">
            {/* The animated beat carries the price; a static duplicate would sit under it. */}
            <PriceBand
              x={0}
              y={0}
              width={680}
              height={80}
              total={scene.text?.some((beat) => beat.value !== undefined) ? undefined : "$240"}
            />
          </g>
        )}
        {scene.props?.includes("icons") && (
          <g transform="translate(720,380)">
            {icons.map((icon, i) => (
              <g key={icon} transform={`translate(${i * 130},0)`} opacity={enter(local, 8 + i * 10, 12)}>
                <rect width={104} height={120} rx={10} fill={C.white} stroke={C.navy} strokeWidth={3} />
                {icon === "jacket" && <Jacket x={52} y={58} scale={0.42} hanger={false} />}
                {icon === "headphones" && <Headphones x={52} y={58} scale={0.5} />}
                {icon === "shoes" && <Shoes x={52} y={58} scale={0.46} />}
                {icon === "ticket" && <Ticket x={52} y={58} scale={0.4} />}
              </g>
            ))}
          </g>
        )}
        {scene.props?.includes("diagram") && (
          <g transform="translate(720,150)">
            <g>
              <text x={0} y={-14} fontSize={22} fontWeight={750} fill={C.red} fontFamily="Inter, sans-serif">
                Sam
              </text>
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(0,${8 + i * 100})`}>
                  <rect width={230} height={76} rx={8} fill={i === 0 ? C.yellow : C.white} stroke={C.navy} strokeWidth={3} />
                  <text x={115} y={47} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
                    {["small payment", "decision", "buy"][i]}
                  </text>
                  {i < 2 && <path d="M115 76 V92" stroke={C.navy} strokeWidth={4} />}
                </g>
              ))}
            </g>
            <g transform="translate(300,0)">
              <text x={0} y={-14} fontSize={22} fontWeight={750} fill={C.teal} fontFamily="Inter, sans-serif">
                Alex
              </text>
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(0,${8 + i * 100})`}>
                  <rect width={230} height={76} rx={8} fill={i === 0 ? "#D9F1F0" : C.white} stroke={C.teal} strokeWidth={3} />
                  <text x={115} y={47} textAnchor="middle" fontSize={18} fontWeight={700} fill={C.navy} fontFamily="Inter, sans-serif">
                    {["full price", "decision", "split payment"][i]}
                  </text>
                  {i < 2 && <path d="M115 76 V92" stroke={C.teal} strokeWidth={4} />}
                </g>
              ))}
            </g>
          </g>
        )}
        {scene.props?.includes("callbacks") && (
          <g transform="translate(1500,300)">
            {icons.slice(0, 3).map((icon, i) => (
              <g key={icon} transform={`translate(0,${i * 150})`} opacity={enter(local, 10 + i * 12, 12)}>
                <rect width={110} height={120} rx={10} fill={C.white} stroke={C.navy} strokeWidth={3} />
                {icon === "jacket" && <Jacket x={55} y={60} scale={0.44} hanger={false} />}
                {icon === "headphones" && <Headphones x={55} y={60} scale={0.5} />}
                {icon === "shoes" && <Shoes x={55} y={60} scale={0.46} />}
              </g>
            ))}
          </g>
        )}
      </g>
    </Scene>
  );
};

const RailStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const camera = scene.camera;
  const scale = camera ? lerp(camera.from, camera.to, p) : 1;
  const cx = scene.x ?? 960;
  const cy = scene.y ?? 540;
  return (
    <Scene scene={scene}>
      <g transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
        <PegRail x={300} y={300} width={620} />
        <g transform="translate(560,390)">
          <Jacket x={0} y={0} scale={1} />
        </g>
        <Shelf x={1320} y={740} width={420} />
        <g transform="translate(1530,738)">
          <Shoebox x={0} y={0} scale={0.9} lid={!scene.props?.includes("openBox")} />
        </g>
        <WritingDesk x={820} y={690} width={520} />
        <g transform="translate(1060,742)">
          <Headphones x={0} y={0} scale={0.85} kinked={!scene.props?.includes("newHeadphones")} />
        </g>
        {scene.props?.includes("waitingRail") && (
          <WaitingRail x={330} y={560} width={580} retract={clamp((p - 0.4) / 0.4)} />
        )}
        {scene.props?.includes("walking") ? (
          <Actor who="sam" x={lerp(760, 1250, clamp((p - 0.1) / 0.75))} y={FLOOR} scale={1.9} facing={1} pose="walking" expression="happy" local={local} />
        ) : (
          scene.who !== "none" && (
            <Actor
              who={scene.who === "alex" ? "alex" : "sam"}
              x={scene.x ?? 760}
              y={scene.y ?? FLOOR}
              scale={scene.scale ?? 1.9}
              facing={scene.facing ?? 1}
              pose={scene.pose ?? "standing"}
              expression={scene.expression ?? "neutral"}
              local={local}
              jacket={scene.props?.includes("wearingJacket")}
            />
          )
        )}
      </g>
    </Scene>
  );
};

const MirrorStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.05) translate(-960,-540)">
        <Mirror x={1180} y={560} scale={1.1}>
          <g transform="translate(0,-20)">
            <Jacket x={0} y={60} scale={0.8} hanger={false} />
          </g>
        </Mirror>
        <Actor who="sam" x={760} y={FLOOR} scale={2.1} facing={1} pose="standing" expression="happy" local={local} />
        <g transform={`translate(${lerp(760, 900, clamp(p * 1.4))},${lerp(560, 520, clamp(p * 1.4))}) rotate(-8)`}>
          <Jacket x={0} y={0} scale={0.75} hanger={false} />
        </g>
        {scene.props?.includes("nod") && <circle cx={780} cy={470} r={70} fill="none" stroke={C.yellow} strokeWidth={3} opacity={0.4} />}
      </g>
    </Scene>
  );
};

const WalkStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  const x = lerp(560, 1280, clamp((p - 0.08) / 0.8));
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.03) translate(-960,-540)">
        <Shelf x={1320} y={740} width={420} />
        <g transform="translate(1530,738)">
          <Shoebox x={0} y={0} scale={0.9} lid={p < 0.18 || p > 0.86} />
        </g>
        <Actor who="sam" x={x} y={FLOOR} scale={2} facing={1} pose="walking" expression={scene.expression ?? "thinking"} local={local} shoes />
      </g>
    </Scene>
  );
};

const WideStage = ({ scene, local }: StageProps) => {
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1) translate(-960,-540)">
        {scene.props?.includes("couch") ? (
          <g transform="translate(760,720)">
            <GroundShadow x={260} y={220} width={560} />
            <path d="M0 0 H520 V120 H0 Z M0 0 V-90 Q0 -120 40 -120 H480 Q520 -120 520 -90 V0" fill="var(--bn-fabric, #A6B4C6)" stroke={C.navy} strokeWidth={6} />
            <path d="M0 120 V180 M520 120 V180" stroke={C.navy} strokeWidth={8} />
          </g>
        ) : (
          <>
            <PegRail x={220} y={300} width={520} />
            <g transform="translate(470,390)">
              <Jacket x={0} y={0} scale={0.9} />
            </g>
            <WritingDesk x={760} y={690} width={560} />
            <g transform="translate(1010,742)">
              <Headphones x={0} y={0} scale={0.8} kinked={false} />
            </g>
            <Shelf x={1380} y={740} width={380} />
            <g transform="translate(1560,738)">
              <Shoebox x={0} y={0} scale={0.85} />
            </g>
            <g transform="translate(1120,700) rotate(-8)">
              <rect width={100} height={180} rx={14} fill={C.navy} />
              <rect x={7} y={7} width={86} height={166} rx={9} fill={C.white} />
              <rect x={18} y={40} width={64} height={18} rx={3} fill={C.yellow} />
            </g>
          </>
        )}
        {scene.who !== "none" && (
          <Actor
            who={scene.who === "alex" ? "alex" : "sam"}
            x={scene.x ?? (scene.props?.includes("couch") ? 800 : 1250)}
            y={scene.y ?? (scene.props?.includes("couch") ? 870 : FLOOR)}
            scale={scene.scale ?? 1.9}
            facing={scene.facing ?? -1}
            pose={scene.pose ?? (scene.props?.includes("couch") ? "sitting" : "standing")}
            expression={scene.expression ?? "neutral"}
            local={local}
          />
        )}
      </g>
    </Scene>
  );
};

const CounterStage = ({ scene, local, duration }: StageProps) => {
  const p = local / duration;
  return (
    <Scene scene={scene}>
      <g transform="translate(960,540) scale(1.03) translate(-960,-540)">
        <rect x={160} y={700} width={1600} height={40} rx={8} fill="var(--bn-wood, #C8BAA2)" stroke={C.navy} strokeWidth={6} />
        <rect x={200} y={740} width={1520} height={200} fill="var(--bn-quiet, #D9E0E6)" stroke={C.navy} strokeWidth={4} />
        <path d="M300 700 V620 H560 V700" fill="none" stroke={C.navy} strokeWidth={5} />
        <text x={430} y={660} textAnchor="middle" fontSize={26} fontWeight={750} fill={C.navy} fontFamily="Inter, sans-serif">
          LUNCH
        </text>
        <Actor who="sam" x={980} y={FLOOR} scale={1.9} facing={1} pose="standing" expression={scene.expression ?? "thinking"} local={local} />
        <g transform="translate(1180,676)">
          <Cup x={0} y={0} scale={0.8} />
          <path d="M-60 10 H80" stroke={C.navy} strokeWidth={5} />
        </g>
        {scene.props?.includes("phone") && (
          <g transform="translate(860,600) rotate(-10)">
            <rect width={110} height={196} rx={14} fill={C.navy} />
            <rect x={7} y={7} width={96} height={182} rx={9} fill={C.white} />
            <rect x={18} y={38} width={74} height={20} rx={4} fill={C.yellow} />
          </g>
        )}
        <TapRing x={1180} y={690} p={clamp((p - 0.6) / 0.2)} />
      </g>
    </Scene>
  );
};

/** Closing pull-around camera; text beats reuse this so labels ride the same transform. */
export const closingCamera = (local: number, duration: number) =>
  lerp(1.55, 1, clamp((local / duration - 0.1) / 0.75));

const ClosingStage = ({ scene, local, duration }: StageProps) => {
  const scale = closingCamera(local, duration);
  const look = lookForScene(scene.id);
  return (
    <Scene scene={scene}>
      <g transform={`translate(960,540) scale(${scale}) translate(-960,-540)`}>
        <Plate look={look} x={540} y={570} width={1120} height={390} />
        <PegRail x={260} y={300} width={520} />
        <g transform="translate(500,390)">
          <Jacket x={0} y={0} scale={0.9} />
        </g>
        <g transform="translate(600,620)">
          {/* No static installment text: the $60 beat animates inside the lit card. */}
          <PriceBand x={0} y={0} width={720} height={96} split={1} lit />
        </g>
        <g transform="translate(600,760)">
          {[1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 188},0)`}>
              <PaymentCard x={0} y={0} width={150} height={150} icon={(["jacket", "headphones", "shoes"] as const)[i - 1]} date={["TUE", "THU", "MON"][i - 1]} />
            </g>
          ))}
        </g>
      </g>
    </Scene>
  );
};

export const BuyNowStage = (props: StageProps) => {
  switch (props.scene.stage) {
    case "desk":
      return <DeskStage {...props} />;
    case "checkout":
      return <CheckoutStage {...props} />;
    case "band":
      return <BandStage {...props} />;
    case "columns":
      return <ColumnsStage {...props} />;
    case "calendar":
      return <CalendarStage {...props} />;
    case "notifications":
      return <NotificationsStage {...props} />;
    case "account":
      return <AccountStage {...props} />;
    case "car":
      return <CarStage {...props} />;
    case "cafe":
      return <CafeStage {...props} />;
    case "rail":
      return <RailStage {...props} />;
    case "mirror":
      return <MirrorStage {...props} />;
    case "walk":
      return <WalkStage {...props} />;
    case "wide":
      return <WideStage {...props} />;
    case "counter":
      return <CounterStage {...props} />;
    case "closing":
      return <ClosingStage {...props} />;
  }
};

export const BuyNowFrame = ({
  scene,
  frame,
}: {
  scene: CompiledFilmScene;
  frame: number;
}) => {
  const local = frame - scene.from;
  if (local < 0 || local >= scene.durationInFrames)
    throw new Error(`Frame ${frame} is outside scene ${scene.id}`);
  return (
    <AbsoluteFill>
      <BuyNowStage scene={scene} local={local} duration={scene.durationInFrames} />
    </AbsoluteFill>
  );
};
