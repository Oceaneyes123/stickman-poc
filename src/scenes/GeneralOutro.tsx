import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { font } from "../design/tokens";

const C = {
  background: "#0F0F0F",
  white: "#FFFFFF",
  red: "#FF0000",
  panel: "#272727",
  line: "#505050",
};

/** Standalone eight-second outro; also reusable inside a film Sequence. */
export const GeneralOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tween = (start: number, end: number, from = 0, to = 1) =>
    interpolate(t, [start, end], [from, to], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  const titleIn = tween(0.12, 0.72);
  const controlsIn = tween(0.75, 1.15);
  const liked = t >= 1.85;
  const subscribed = t >= 3.55;
  const likePress = interpolate(
    t,
    [1.77, 1.85, 2.02, 2.2],
    [1, 0.94, 1.06, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const subscribePress = interpolate(
    t,
    [3.47, 3.55, 3.72, 3.9],
    [1, 0.96, 1.03, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const cursorX = interpolate(
    t,
    [1.2, 1.65, 2.35, 3.3, 3.9, 4.3],
    [740, 700, 700, 1120, 1120, 1195],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const cursorY = interpolate(
    t,
    [1.2, 1.65, 2.35, 2.8, 3.3, 3.9, 4.3],
    [795, 650, 650, 710, 650, 650, 755],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const ambient = tween(0, 1.1);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background, fontFamily: font }}>
      <svg
        viewBox="0 0 1920 1080"
        width="1920"
        height="1080"
        role="img"
        aria-label="Thanks for watching Like and subscribe."
      >
        {/* Background arcs resolve once, leaving a quiet final hold. */}
        <g
          fill="none"
          stroke={C.line}
          strokeWidth="2"
          opacity={0.42 * ambient}
          transform={`translate(${24 * (1 - ambient)} ${-16 * (1 - ambient)})`}
        >
          <circle cx="160" cy="100" r="300" />
          <circle cx="160" cy="100" r="335" />
          <circle cx="1770" cy="1020" r="340" />
          <circle cx="1770" cy="1020" r="375" />
        </g>
        <g opacity={titleIn} transform={`translate(0 ${36 * (1 - titleIn)})`}>
          <text
            x="960"
            y="410"
            textAnchor="middle"
            fill={C.white}
            fontSize="104"
            fontWeight="760"
            letterSpacing="-4"
          >
            Thanks for watching
          </text>
        </g>
        <g
          opacity={controlsIn}
          transform={`translate(0 ${28 * (1 - controlsIn)})`}
        >
          <g transform={`translate(690 620) scale(${likePress})`}>
            <rect
              x="-90"
              y="-66"
              width="180"
              height="132"
              rx="66"
              fill={C.panel}
            />
            <g
              transform="translate(-36 -39) scale(3)"
              fill="none"
              stroke={C.white}
              strokeWidth="1.4"
              strokeLinejoin="miter"
            >
              <path
                d="M8 21V9L13 3C14 2 16 3 16 5L15 9H21C22 9 23 10 22.5 12L20 20C19.8 20.7 19 21 18 21Z"
                fill={liked ? C.white : "none"}
              />
              <path d="M2 9H5V21H2Z" fill={liked ? C.white : "none"} />
            </g>
          </g>
          <g transform={`translate(1120 620) scale(${subscribePress})`}>
            <rect
              x="-250"
              y="-66"
              width="500"
              height="132"
              rx="66"
              fill={subscribed ? C.panel : C.red}
            />
            <g
              transform="translate(-190 -25)"
              fill="none"
              stroke={C.white}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {subscribed ? (
                <path d="M3 26L18 41L48 9" />
              ) : (
                <path d="M9 3L48 25L9 47Z" fill={C.white} strokeWidth="3" />
              )}
            </g>
            <text
              x="38"
              y="14"
              textAnchor="middle"
              fill={C.white}
              fontSize="39"
              fontWeight="700"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </text>
          </g>
        </g>
        {/* One ring carries each click's feedback without particle clutter. */}
        {[1.85, 3.55].map((click, index) => (
          <circle
            key={click}
            cx={index === 0 ? 690 : 1120}
            cy="620"
            r={tween(click, click + 0.5, 66, 109)}
            fill="none"
            stroke={index === 0 ? C.white : C.red}
            strokeWidth="3"
            opacity={t < click ? 0 : tween(click, click + 0.5, 0.65, 0)}
          />
        ))}
        <g
          transform={`translate(${cursorX} ${cursorY})`}
          opacity={tween(1.2, 1.4) * tween(4.05, 4.3, 1, 0)}
        >
          <path
            d="M0 0L8 57L22 42L35 68L47 61L34 37L55 34Z"
            fill={C.white}
            stroke={C.background}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
