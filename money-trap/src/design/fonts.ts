import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter.ttf"),
  weight: "100 900",
});
