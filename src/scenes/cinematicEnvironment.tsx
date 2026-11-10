import { C, cinema } from "../design/tokens";
import { Room } from "../storyboard/OpeningSceneStudy";

/** Soft ground contact for furniture; the character rig owns its own shadow. */
export const GroundShadow = ({
  x,
  y,
  width,
}: {
  x: number;
  y: number;
  width: number;
}) => (
  <ellipse
    cx={x}
    cy={y + 4}
    rx={width / 2}
    ry={11}
    fill={C.navy}
    stroke="none"
    opacity={0.14}
  />
);
export type StoryLocation =
  | "sam-old"
  | "sam-new"
  | "alex-home"
  | "workplace"
  | "old-rental"
  | "new-rental"
  | "dining";
export const WritingDesk = ({
  x = 820,
  y = 690,
  width = 650,
  old = false,
}: {
  x?: number;
  y?: number;
  width?: number;
  old?: boolean;
}) => (
  <>
    <GroundShadow x={x + width / 2} y={940} width={width * 0.9} />
    <g stroke={C.navy} strokeWidth={cinema.outline.furniture}>
      <path
        d={`M${x + 35} ${y + 24}V940 M${x + width - 35} ${y + 24}V940`}
        fill="none"
      />
      <path
        d={`M${x} ${y}H${x + width}V${y + 30}H${x}Z`}
        fill={old ? cinema.material.desk : cinema.material.wood}
      />
      <path
        d={`M${x + 12} ${y + 44}H${x + width - 12}`}
        strokeWidth={2}
        strokeOpacity={0.25}
      />
    </g>
  </>
);
export const Cup = ({ x, y }: { x: number; y: number }) => (
  <g
    transform={`translate(${x},${y})`}
    fill={C.white}
    stroke={C.navy}
    strokeWidth={4}
  >
    <path d="M-24 -52H24V-5Q0 8 -24 -5Z M24 -42C65 -55 63 -8 24 -15" />
    <ellipse cy={-52} rx={24} ry={7} />
  </g>
);
export const DiningTable = ({
  x = 1430,
  y = 770,
}: {
  x?: number;
  y?: number;
}) => (
  <g transform={`translate(${x},${y})`} stroke={C.navy} strokeWidth={5}>
    <GroundShadow x={95} y={170} width={400} />
    <path
      d="M-120 0H310V24H-120Z M-80 24V170 M270 24V170"
      fill={cinema.material.wood}
    />
    <ellipse cx={95} cy={-14} rx={82} ry={25} fill={C.white} />
    <path d="M-25 -44V-5 M-37 -44V-30H-13V-44 M218 -44V-5" fill="none" />
  </g>
);
export const GuestChair = ({ x = 1530 }: { x?: number }) => (
  <g stroke={C.navy} strokeWidth={6}>
    <GroundShadow x={x + 70} y={940} width={210} />
    <path
      d={`M${x} 880V740Q${x + 70} 700 ${x + 140} 740V880Z`}
      fill={cinema.material.fabric}
    />
    <path
      d={`M${x - 10} 880H${x + 150}V900H${x - 10}Z M${x + 10} 900V940 M${x + 130} 900V940`}
      fill={cinema.material.desk}
    />
  </g>
);
const VehicleCabin = ({ older }: { older: boolean }) => (
  <g>
    <rect width={1920} height={1080} fill={C.white} />
    <path
      d="M170 120L1690 100L1800 730H100Z"
      fill={cinema.environment.glass}
      stroke={C.navy}
      strokeWidth={8}
    />
    <path
      d="M1100 380L930 740H1500L1290 380Z"
      fill={cinema.environment.floor}
    />
    <path
      d="M1190 470L1170 570 M1150 625L1130 730"
      stroke={C.white}
      strokeWidth={10}
    />
    <rect
      x={350}
      y={350}
      width={400}
      height={530}
      rx={70}
      fill={older ? "#97A2AD" : "#71849B"}
      stroke={C.navy}
      strokeWidth={7}
    />
    <rect
      x={420}
      y={235}
      width={235}
      height={175}
      rx={45}
      fill={cinema.material.fabric}
      stroke={C.navy}
      strokeWidth={6}
    />
    <path
      d="M0 840Q960 760 1920 840V1080H0Z"
      fill={cinema.material.foreground}
    />
    <ellipse
      cx={850}
      cy={840}
      rx={140}
      ry={95}
      fill="none"
      stroke={C.navy}
      strokeWidth={28}
    />
    <path
      d="M0 0H200L315 820L190 1080H0Z M1700 0H1920V1080H1830L1650 105Z"
      fill={C.navy}
    />
  </g>
);
export const StoryEnvironment = ({
  location,
  compact = false,
  architecture = false,
}: {
  location: StoryLocation;
  compact?: boolean;
  architecture?: boolean;
}) => {
  if (location === "old-rental" || location === "new-rental")
    return <VehicleCabin older={location === "old-rental"} />;
  const old = location === "sam-old" || location === "alex-home";
  if (!architecture)
    return (
      <g>
        {!old && !compact && (
          <g stroke={C.navy} strokeWidth={5}>
            <path
              d="M1610 900V690 M1608 750Q1490 650 1530 610Q1610 620 1610 730 M1610 790Q1740 690 1720 650Q1640 650 1610 770"
              fill={C.teal}
            />
            <path
              d="M1550 820H1670L1650 900H1570Z"
              fill={cinema.material.fabric}
            />
          </g>
        )}
        {location === "dining" && <DiningTable />}
      </g>
    );
  return (
    <g transform={compact ? "scale(.5,1)" : undefined}>
      <Room old={old} office={location === "workplace"} />
      <rect
        width={1920}
        height={1080}
        fill={old ? cinema.environment.oldWall : cinema.environment.wall}
        opacity={0.13}
      />
      {!compact && (
        <>
          <path
            d="M120 935V350H360V935"
            fill={old ? "#CBD5DE" : "#D9D5C9"}
            stroke={C.navy}
            strokeWidth={5}
          />
          <path
            d="M145 375H335V918H145Z"
            fill="none"
            stroke={C.navy}
            strokeOpacity={0.22}
            strokeWidth={3}
          />
          <circle cx={317} cy={665} r={8} fill={C.navy} />
          <path
            d="M580 965L810 880H1480L1670 965Z"
            fill={old ? "#C6D2D9" : "#CFDCD6"}
            opacity={0.7}
          />
        </>
      )}
      {!old && (
        <path
          d="M1230 220L1710 220L1530 935H820Z"
          fill={cinema.environment.daylight}
          opacity={0.18}
        />
      )}
      {location === "dining" && <DiningTable />}
    </g>
  );
};
