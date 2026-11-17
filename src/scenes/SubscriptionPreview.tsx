import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";

export const SubscriptionPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#14243A", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      <Audio src={staticFile("subscription-preview/narration.wav")} />
      <div style={{ position: "absolute", left: 120, top: 100, fontSize: 25, fontWeight: 700, letterSpacing: 4, color: "#F3BE58" }}>THE MONEY TRAP</div>
      <div style={{ position: "absolute", left: 120, top: 300, width: 700, opacity: entrance, transform: `translateY(${(1 - entrance) * 20}px)` }}>
        <div style={{ fontSize: 35, fontWeight: 500, color: "#AAB8C8", marginBottom: 25 }}>ONE SHOW. ONE OFFER.</div>
        <div style={{ fontSize: 86, lineHeight: 1.12, fontWeight: 750 }}>A free trial<br />is easy to start.</div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 180, width: 700, height: 700, background: "#F8FAFC", color: "#14243A", borderRadius: 22, padding: 64, boxSizing: "border-box", opacity: entrance }}>
        <div style={{ marginTop: 60, fontSize: 44, fontWeight: 700 }}>Ready to watch?</div>
        <div style={{ marginTop: 40, borderTop: "2px solid #DCE2E8", paddingTop: 38, fontSize: 35 }}>Start your free trial</div>
        <div style={{ marginTop: 18, fontSize: 32, color: "#5B6777" }}>Then <span style={{ color: "#14243A", fontWeight: 700 }}>$12 / month</span></div>
        <div style={{ marginTop: 70, background: "#F3BE58", borderRadius: 10, textAlign: "center", padding: "25px 0", fontSize: 30, fontWeight: 750 }}>Start trial</div>
        <div style={{ marginTop: 23, fontSize: 24, color: "#5B6777", textAlign: "center" }}>Renews automatically</div>
      </div>
    </AbsoluteFill>
  );
};
