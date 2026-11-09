import { Composition, registerRoot } from "remotion";
import { OpeningSceneStudy } from "./OpeningSceneStudy";
registerRoot(() => (
  <Composition
    id="OpeningSceneStudy"
    component={OpeningSceneStudy}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={90}
    defaultProps={{ shot: "s01-a-raise" as const }}
  />
));
