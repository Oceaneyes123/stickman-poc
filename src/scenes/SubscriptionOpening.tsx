import { useId } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, font } from "../design/tokens";
import { KineticHeadline } from "../typography";
import { openingTimeline } from "./subscriptionOpeningTimeline";

const ease = (frame: number, end = 30) => interpolate(frame, [0, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const pressScale = (frame: number) => 1 + 0.08 * Math.sin(Math.PI * ease(frame, 12));
const scaleAt = (scale: number, x: number, y: number) => `translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`;
const line = "#B9C8D5";

export const SubscriptionTextureGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const id = useId().replaceAll(":", "");
  const drift = Math.sin(frame / 180) * 9;
  return <AbsoluteFill style={{ background: C.navy, overflow: "hidden" }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
      <defs><pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift * 0.6})`}>
        <circle cx="12" cy="16" r="1.4" fill={C.white} opacity="0.18"/><circle cx="64" cy="61" r="1" fill={C.white} opacity="0.15"/>
        <path d="M30 75 h12 M71 26 h8" stroke={C.white} strokeWidth="1" opacity="0.12"/>
      </pattern></defs>
      <rect width="1920" height="1080" fill={`url(#${id})`}/>
    </svg>
  </AbsoluteFill>;
};

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => <path d="M0 0 L0 68 L18 51 L31 80 L44 74 L31 45 L57 45 Z" transform={`translate(${x} ${y})`} fill={C.white} stroke={C.navy} strokeWidth="4" strokeLinejoin="round" />;
const Screen: React.FC<{ children: React.ReactNode }> = ({ children }) => <><rect x="330" y="130" width="1260" height="730" rx="26" fill={C.white} /><rect x="330" y="130" width="1260" height="68" rx="26" fill="#DBE4EA"/><rect x="330" y="170" width="1260" height="28" fill="#DBE4EA"/><circle cx="375" cy="164" r="8" fill="#9AABB9"/><circle cx="404" cy="164" r="8" fill="#9AABB9"/><circle cx="433" cy="164" r="8" fill="#9AABB9"/>{children}</>;
export const ShowArt: React.FC = () => <><rect x="0" y="0" width="450" height="510" rx="12" fill="#435E71"/><circle cx="320" cy="120" r="66" fill="#E5C497"/><path d="M0 370 L145 155 L290 345 L365 225 L450 360 V510 H0Z" fill="#233F52"/><path d="M0 420 L130 290 L245 400 L350 280 L450 390 V510 H0Z" fill="#79949A"/><path d="M0 455 Q210 390 450 455 V510 H0Z" fill="#244456"/></>;
const Calendar: React.FC<{ x: number; y: number; fill?: string }> = ({ x, y, fill = C.white }) => <g transform={`translate(${x} ${y})`}><rect width="240" height="245" rx="18" fill={fill}/><rect width="240" height="65" rx="18" fill="#D2DEE5"/><rect y="40" width="240" height="25" fill="#D2DEE5"/><path d="M62 20 V-14 M178 20 V-14" stroke={C.navy} strokeWidth="12" strokeLinecap="round"/>{[0,1,2].map(row => [0,1,2].map(col => <rect key={`${row}-${col}`} x={42 + col * 58} y={95 + row * 43} width="22" height="18" rx="4" fill="#A6B7C3"/>))}</g>;

const CancellationCard: React.FC<{ page: number; press?: number }> = ({ page, press = 1 }) => <>
  <rect x="550" y="210" width="820" height="610" rx="20" fill={C.white}/>
  <circle cx="960" cy="340" r="75" fill={page === 1 ? "#FFE1DD" : "#E3EEF0"}/>
  {page === 0 && <text x="960" y="365" textAnchor="middle" fill={C.navy} fontSize="78" fontWeight="700">?</text>}
  {page === 1 && <><path d="M934 308 L1002 340 L934 373Z" fill={C.navy}/><path d="M910 390 L1012 290" stroke={C.red} strokeWidth="10" strokeLinecap="round"/></>}
  {page === 2 && <><path d="M920 325 H1000 V375 H920Z" fill="none" stroke={C.navy} strokeWidth="8"/><path d="M960 310 V390 M914 344 H1006" stroke={C.navy} strokeWidth="7"/></>}
  <text x="960" y="485" textAnchor="middle" fill={C.navy} fontSize="43" fontWeight="700">{["Are you sure?", "You'll lose access", "Another offer"][page]}</text>
  <rect x="740" y="545" width="440" height="78" rx="9" fill={C.navy}/><text x="960" y="596" textAnchor="middle" fill={C.white} fontSize="28" fontWeight="700">Keep membership</text><g transform={scaleAt(press, 960, 685)}><text x="960" y="692" textAnchor="middle" fill="#657788" fontSize="27">Continue canceling →</text></g>
</>;

const CancellationStack: React.FC<{ page: number; frame: number }> = ({ page, frame }) => {
  const progress = page === 0 ? 1 : ease(frame, 24);
  const outgoing = page > 0 && progress < 1 ? <g transform={`translate(${Math.sin(progress * Math.PI) * 390 + progress * 35} ${progress * 35}) rotate(${progress * 4} 960 515)`}><CancellationCard page={page - 1}/></g> : null;
  const clickFrame = page === 0 ? 30 : 54;
  const incoming = <g transform={`translate(${(1-progress)*25} ${(1-progress)*18})`}><CancellationCard page={page} press={pressScale(frame - clickFrame)}/></g>;
  const cursor = ease(frame - (page === 0 ? 0 : 24), 30);
  return <>
    <rect x="585" y="245" width="820" height="610" rx="20" fill="#2A4058" transform="rotate(4 995 550)"/>
    <rect x="555" y="225" width="820" height="610" rx="20" fill="#A8BAC6" transform="rotate(2 965 530)"/>
    {progress < 0.5 ? <>{incoming}{outgoing}</> : <>{outgoing}{incoming}</>}
    {progress >= 1 && <Cursor x={1270-180*cursor} y={760-65*cursor}/>}
  </>;
};

export const SubscriptionCardGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(2, Math.floor(frame / 90));
  return <AbsoluteFill style={{fontFamily:font}}><SubscriptionTextureGallery/><svg style={{position:"relative"}} width="1920" height="1080" viewBox="0 0 1920 1080"><CancellationStack page={page} frame={frame % 90}/></svg></AbsoluteFill>;
};

const OpeningShot: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const absoluteFrame = frame + openingTimeline.scenes[index].from;
  const action = (id: string) => {
    const event = openingTimeline.events.find((item) => item.id === id)!;
    return ease(absoluteFrame - event.from, event.durationInFrames);
  };
  const actionFrame = (id: string) => absoluteFrame - openingTimeline.events.find((item) => item.id === id)!.from;
  const p = ease(frame, 35);
  const draw = (from: number) => ({ pathLength: 1, strokeDasharray: "1 1", strokeDashoffset: 1-ease(frame-from, 20) });
  const page = index - 2;
  return <AbsoluteFill style={{fontFamily:font}}>
    <SubscriptionTextureGallery />
    <svg style={{position:"relative"}} width="1920" height="1080" viewBox="0 0 1920 1080" aria-label="Original illustrated subscription sequence">
      {index === 0 && <>
        <Screen><g transform={scaleAt(0.94 + 0.06*p, 655, 515)}><g transform="translate(430 260)"><ShowArt/></g></g><g opacity={action("start")}><circle cx="655" cy="515" r="62" fill={C.navy} opacity="0.82"/><path d="M640 482 L640 548 L690 515 Z" fill={C.white}/></g><text x="995" y="365" fill={C.navy} fontSize="42" fontWeight="700">One show</text><rect x="995" y="410" width="380" height="15" rx="7" fill="#CDD8DF"/><rect x="995" y="447" width="280" height="15" rx="7" fill="#CDD8DF"/><g opacity={action("trial")} transform={scaleAt(pressScale(actionFrame("start")), 1195, 590)}><rect x="995" y="540" width="400" height="100" rx="12" fill={C.yellow}/><text x="1195" y="603" textAnchor="middle" fill={C.navy} fontSize="32" fontWeight="700">Start free trial</text></g></Screen>
        <Cursor x={1510 - 220*action("trial")} y={790 - 175*action("trial")}/>
        <circle cx="1290" cy="615" r={12 + 38*action("start")} fill="none" stroke={C.navy} strokeWidth="5" opacity={action("start") * (1-action("start")) * 3}/>
      </>}
      {index === 1 && <>
        <Screen><g transform="translate(425 265) scale(.63)"><ShowArt/></g><rect x="425" y="606" width="285" height="10" rx="5" fill="#CFDCE3"/><rect x="425" y="606" width={285*p} height="10" rx="5" fill={C.teal}/><g opacity={action("account")}><text x="800" y="340" fill={C.navy} fontSize="40" fontWeight="700">Membership</text><rect x="800" y="385" width="570" height="130" rx="12" fill="#EAF0F3"/><circle cx="855" cy="450" r="12" fill={C.teal}/><text x="890" y="462" fill={C.navy} fontSize="32">Active</text><g transform={scaleAt(pressScale(actionFrame("cancel") - openingTimeline.events.find((item) => item.id === "cancel")!.durationInFrames), 1022, 627)}><rect x="800" y="585" width="445" height="84" rx="10" fill={C.white} stroke={C.navy} strokeWidth="3"/><text x="1022" y="638" textAnchor="middle" fill={C.navy} fontSize="29" fontWeight="700">Cancel membership</text></g></g></Screen>
        <g opacity={action("account")}><Cursor x={1430-260*action("cancel")} y={740-100*action("cancel")}/></g>
      </>}
      {index >= 2 && index <= 4 && <CancellationStack page={page} frame={frame}/>}
      {index === 5 && <>
        <g transform={`translate(${450 - 110*action("uncertain")} 260) rotate(-5 320 260)`}><rect width="640" height="520" rx="20" fill="#DFE8EC"/><circle cx="320" cy="170" r="80" fill="#BBCBD5"/><path d="M280 170 H360 M320 130 V210" stroke={C.white} strokeWidth="14" strokeLinecap="round"/><rect x="130" y="320" width="380" height="18" rx="9" fill="#B4C5CF"/><rect x="190" y="370" width="260" height="18" rx="9" fill="#B4C5CF"/></g>
        <g transform={`translate(${970 + 120*action("uncertain")} 340)`} opacity={action("uncertain")}><rect width="480" height="365" rx="20" fill={C.white}/><circle cx="95" cy="114" r="21" fill={C.red}/><text x="135" y="124" fill={C.navy} fontSize="38" fontWeight="700">Still active</text><path d="M75 180 H405 M75 235 H315" stroke="#CFDBE2" strokeWidth="14" strokeLinecap="round"/></g>
      </>}
      {index === 6 && <>
        <g transform="translate(310 290)"><rect width="500" height="440" rx="20" fill={C.white}/><circle cx="250" cy="150" r="78" fill="#E1EBEF"/><path d="M220 115 L285 150 L220 185Z" fill={C.navy}/><rect x="85" y="275" width="330" height="14" rx="7" fill="#C4D2DB"/><rect x="145" y="320" width="210" height="14" rx="7" fill="#C4D2DB"/></g>
        <g opacity={1-action("renewal")} transform={`translate(${45*(1-p)} 0)`}>
          <text x="1040" y="365" fill={C.white} fontSize="28" fontWeight="700">Join</text><path d="M1160 355 H1510" stroke={C.teal} strokeWidth="8" strokeLinecap="round" {...draw(12)}/><circle cx="1510" cy="355" r="15" fill={C.teal} opacity={ease(frame-26,8)}/>
          <text x="1040" y="565" fill={C.white} fontSize="28" fontWeight="700">Leave</text><path d="M1160 555 H1510" stroke={line} strokeWidth="8" strokeLinecap="round" {...draw(16)}/>
          {[0,1,2].map((n) => <g key={n} opacity={ease(frame - n*12, 15)} transform={`translate(${1190+n*120} 510)`}><rect width="80" height="90" rx="9" fill={C.white}/><path d="M16 28 H64 M16 47 H54 M16 66 H45" stroke="#9AAEBB" strokeWidth="6" strokeLinecap="round"/></g>)}
        </g>
        <path d="M830 510 H1100" stroke={C.red} strokeWidth="12" strokeLinecap="round" strokeDasharray="270" strokeDashoffset={270 * (1-action("renewal"))}/><path d="M1070 478 L1103 510 L1070 542" fill="none" stroke={C.red} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" opacity={action("renewal")}/>
        <g transform="translate(1190 300)" opacity={action("renewal")}><Calendar x={0} y={0}/><circle cx="120" cy="155" r="44" fill={C.yellow}/><text x="120" y="170" textAnchor="middle" fontSize="44" fontWeight="700" fill={C.navy}>$</text><text x="120" y="320" textAnchor="middle" fontSize="30" fontWeight="700" fill={C.white}>Renewal active</text></g>
        <g opacity={action("convenient-return")}><circle cx="560" cy="440" r="82" fill={C.teal}/><path d="M530 440 L551 462 L594 416" fill="none" stroke={C.navy} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/></g>
      </>}
      {index === 7 && <>
        <g transform={`translate(${220+70*action("rent-pay")} 350)`} opacity={action("rent-pay")}><rect width="300" height="220" rx="18" fill={C.yellow}/><rect x="25" y="45" width="250" height="28" fill="#D29B3C"/><rect x="35" y="130" width="70" height="20" rx="5" fill={C.navy}/></g>
        <g opacity={action("rent-watch")}><path d="M640 460 H740" stroke={line} strokeWidth="10" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1-action("rent-watch")}/><path d="M715 435 L742 460 L715 485" fill="none" stroke={line} strokeWidth="10"/></g>
        <g transform={`translate(800 ${320-20*p})`} opacity={p}><rect width="410" height="300" rx="20" fill={C.white}/><rect x="22" y="22" width="366" height="210" rx="8" fill="#435E71"/><path d="M175 85 L255 128 L175 170Z" fill={C.white}/><rect x="25" y="255" width={360*action("rent-end")} height="12" rx="6" fill={C.teal}/></g>
        <g opacity={action("rent-end")}><path d="M1260 460 H1360" stroke={line} strokeWidth="10" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1-action("rent-end")}/><path d="M1335 435 L1362 460 L1335 485" fill="none" stroke={line} strokeWidth="10"/>
        <circle cx="1500" cy="460" r="95" fill={C.teal}/><path d="M1455 460 L1487 492 L1548 425" fill="none" stroke={C.navy} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"/></g>
        <g opacity={action("rent-again")} transform={`translate(0 ${35*(1-action("rent-again"))})`}><rect x="700" y="660" width="125" height="125" rx="10" fill="#54717D"/><path d="M748 690 L795 722 L748 752Z" fill={C.white}/><rect x="845" y="680" width="370" height="74" rx="10" fill={C.yellow}/><text x="1030" y="729" textAnchor="middle" fill={C.navy} fontSize="28" fontWeight="700">Rent another movie</text></g>
        <text x="960" y="820" textAnchor="middle" fill={C.white} fontSize="30" fontWeight="700" opacity={action("rent-pay")}>One-time rental</text>
      </>}
      {index === 8 && <>
        <g transform="translate(280 275)"><rect width="520" height="480" rx="22" fill={C.white}/><rect x="50" y="50" width="420" height="245" rx="10" fill="#54717D"/><circle cx="260" cy="173" r="80" fill="#8AA8AA"/><path d="M246 120 V208 M246 125 L300 110 V187" fill="none" stroke={C.white} strokeWidth="12" strokeLinecap="round"/><circle cx="230" cy="209" r="20" fill={C.white}/><circle cx="284" cy="188" r="20" fill={C.white}/><path d="M95 355 H425" stroke="#CBD8E0" strokeWidth="12" strokeLinecap="round"/><path d={`M95 355 H${95+330*ease(actionFrame("music"), 180)}`} stroke={C.teal} strokeWidth="12" strokeLinecap="round"/></g>
        <path d="M860 510 H1010" stroke={line} strokeWidth="9" {...draw(18)}/><Calendar x={1080} y={350}/><g opacity={action("next-renewal")}><path d="M1350 475 H1420" stroke={line} strokeWidth="9" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1-action("next-renewal")}/><Calendar x={1450} y={350}/><path d="M1395 450 L1422 475 L1395 500" fill="none" stroke={line} strokeWidth="9"/><circle cx={1200+370*ease(actionFrame("next-renewal"), 55)} cy="475" r="27" fill={C.yellow}/><text x={1200+370*ease(actionFrame("next-renewal"), 55)} y="484" textAnchor="middle" fill={C.navy} fontSize="26" fontWeight="700">$</text></g><text x="1310" y="720" textAnchor="middle" fill={C.white} fontSize="30" fontWeight="700">Automatic renewal</text><g opacity={action("no-checkout")}><circle cx="540" cy="830" r="38" fill={C.teal}/><path d="M520 830 L535 846 L563 814" fill="none" stroke={C.navy} strokeWidth="8" strokeLinecap="round"/><text x="600" y="840" fill={C.white} fontSize="29">No new checkout</text></g>
      </>}
    </svg>
  </AbsoluteFill>;
};

export const TextCutaway: React.FC<{ text: string; highlight: string; duration: number }> = ({ text, highlight, duration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, duration - 7, duration - 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const emphasis = text.split(/\s+/).find((word) => word.includes(highlight));
  return <AbsoluteFill style={{ opacity }}>
    <SubscriptionTextureGallery />
    <svg style={{position:"relative"}} width="1920" height="1080" viewBox="0 0 1920 1080">
      <KineticHeadline from={0} until={duration} enter={6} exit={7} x={96} y={482} width={1728} size={96} text={text} unit="word" stagger={2} motion="slide" textAlign="center" color={C.white} emphasis={emphasis} emphasisColor={C.yellow}/>
    </svg>
  </AbsoluteFill>;
};

export const SubscriptionRenewalGallery: React.FC = () => <OpeningShot index={8}/>;
export const SubscriptionFlowGallery: React.FC = () => <AbsoluteFill><Sequence durationInFrames={330}><OpeningShot index={6}/></Sequence><Sequence from={330} durationInFrames={190}><OpeningShot index={7}/></Sequence></AbsoluteFill>;

export const SubscriptionOpeningVisuals: React.FC = () => <AbsoluteFill>
  {openingTimeline.scenes.map((scene, index) => <Sequence key={scene.id} name={scene.title} from={scene.from} durationInFrames={scene.durationInFrames}><OpeningShot index={index} /></Sequence>)}
  {openingTimeline.events.filter((event) => event.track === "cutaway").map((event) => <Sequence key={event.id} name={event.id} from={event.from} durationInFrames={event.durationInFrames}><TextCutaway text={String(event.payload.text)} highlight={String(event.payload.highlight)} duration={event.durationInFrames} /></Sequence>)}
</AbsoluteFill>;

export const SubscriptionOpening: React.FC = () => <AbsoluteFill><Audio src={staticFile("subscription-opening/narration.wav")} /><SubscriptionOpeningVisuals/></AbsoluteFill>;

