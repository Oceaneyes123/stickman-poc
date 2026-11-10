# Animation reverse engineering

Evidence base: `../evidence/visual-observations.md` (six sampled videos, one
per channel) and the caption corpus. **Read the limits first:** this is a study of
single frames pulled at 3–1,000 s intervals. It supports claims about construction,
staging and pose. It does **not** support claims about easing, hold length, cut
rate, or "smoothness" — none of those were measured, and any number quoted for
them elsewhere is invented.

## 1. Character construction, by channel

| Channel | Head | Limbs | Face | Identity signal | Hands |
|---|---|---|---|---|---|
| Alan Becker | hollow circle, uniform stroke | single line, no elbows/knees drawn | **none** | colour only (orange/green/yellow/blue/red) | none |
| Beanie Survives | round white fill, black outline | thin single line | two dot eyes, tiny mouth | yellow beanie | none |
| The Paint Explainer | round, filled | thin, 1–2 segment | dot eyes, oval mouth (astronaut) | helmet / suit | mittens at most |
| TheOdd1sOut | oversized round, ~1/3 of body height | stubby, rounded nubs | dash or dot eyes, single-line mouth | hair shape + shirt colour | nubs |
| Kurzgesagt | varies per video (creature, humanoid) | varies | often just eyes | silhouette and colour | varies |
| Sam O'Nella (titles only) | crude circle | crude line | dots | crude drawing as a joke | none |

**Observed rule:** no channel in the corpus draws articulated fingers, elbows or
knees on a stick figure. Expression is carried by (a) head angle, (b) limb
arrangement, (c) mouth shape when a face exists, and (d) spacing to other objects.
The Paint Explainer's astronaut and TheOdd1sOut's customers both prove that a dot
eye plus a mouth line is enough for a readable emotion at 480p.

**What this means for a rig:** the existing `ReferenceCharacterRig` in this repo
already exceeds every stickman in the corpus in articulation. Extra joints are not
what the audience rewards; silhouette clarity at small scale is. Do not add rig
complexity to chase fidelity the reference channels do not have.

## 2. Posing and staging, observed

- **The Paint Explainer, 5 s:** a tiny stick figure engulfed in flames beside a
  huge Sun. The pose (limbs spread, arms up) reads as "flailing" at roughly 40 px
  tall. The emotion is legible without a face because the *relationship* to the
  environment (tiny vs huge, engulfed) does the work.
- **The Paint Explainer, 150 s:** astronaut standing frontally, arms slightly out,
  feet apart, red arrows above labelled "pressure". Neutral pose + hostile
  environment = the beat. No acting required.
- **Beanie Survives, 20 s:** peephole fisheye with the character's worried face and
  a bandaged forearm filling the circle. The distortion, not the drawing, sells
  claustrophobia.
- **Beanie Survives, 250 s / 350 s:** the same kitchen at two light levels. The
  second visit is darker and tighter; the character is doing the same activity.
  Continuity of set plus a lighting change carries "time has passed and things are
  worse" without new art.
- **TheOdd1sOut, 70 s:** employee upright, arms folded, straight mouth; customer
  leaning forward with both hands flat on the counter, wide mouth. Two poses, one
  counter, white void. The joke is entirely in the pose contrast.
- **Alan Becker, 5 s / 25 s / 60 s:** five figures walking in a line (legs split
  mid-stride), then standing at a ledge, then a very wide multi-level mineshaft with
  a diagonal spider swarm. Scale changes between shots, not within them.
- **Kurzgesagt, 40 s / 80 s:** rim light along a silhouette; a giant cropped face
  against a small seated figure. Composition, not articulation, carries the beat.

## 3. Environments

Three distinct cost tiers appear in the corpus:

1. **White void + one prop** (TheOdd1sOut, The Paint Explainer). The prop is the
   scene. Cheapest, and the tier this project can actually sustain for 10–15 min.
2. **One reusable set, relit** (Beanie Survives). Apartment, kitchen, hallway —
   each drawn once, revisited at different times of day. This is the highest-value
   tier for a serial: the audience learns the geography and the lighting change
   becomes information.
3. **Per-shot bespoke art** (Kurzgesagt). A new landscape, creature and palette per
   beat. Studio cost; not reproducible here at quality.

Alan Becker sits outside the tiers: a blocky world whose textures are the joke, with
flat vector characters composited on top. The mismatch *is* the style.

## 4. Motion cues visible in stills (and what they do not prove)

What the frames show:

- **Anticipation is staged in the composition, not the timing.** Alan Becker's 25 s
  ledge shot puts the group at the edge with empty space below — the still contains
  the setup for the drop.
- **Speed is carried by geometry.** Alan Becker's 100 s frame is dominated by a
  diagonal rail; The Paint Explainer's 260 s probe descends on a diagonal with a
  "deepest point" label. Diagonal + label reads as travel even in a still.
- **Weight is carried by ground contact and shadow.** Beanie's character always has
  feet on a floor plane; the shadow under the astronaut in The Paint Explainer's
  150 s frame is the only thing making him stand on the ground rather than float.
- **Overlap for depth.** Alan Becker's 180 s group shot overlaps heads and limbs;
  Kurzgesagt's 40 s frame puts abstract bubbles in the foreground, the figure in the
  midground, black behind.

What is unmeasured: interpolation, easing curves, secondary motion, follow-through,
motion blur, actual shot durations. A follow-up that needs these must sample
consecutive frames at 4–8 fps over a 5–10 s window; the current corpus cannot.

## 5. Style choices worth adopting, and their cost

| Choice | Evidence | Cost in this repo | Verdict |
|---|---|---|---|
| Persistent section label (planet name, day counter) | Paint Explainer every frame; Beanie "SUPPLIES · DAY 9" | One text element driven by scene props | Adopt |
| Red reserved for force/danger/cost | Paint Explainer arrows/thermometers; repo already uses coral for costs | Already in the palette | Adopt, enforce |
| One stand-in figure per beat, scaled to the environment | Paint Explainer 5 s, 150 s | Existing rig + scale prop | Adopt |
| Reusable set relit for time passage | Beanie 5 s vs 80 s | Scene templates already exist; add a lighting variant prop | Adopt |
| Face economy: dot eyes + one mouth line | Odd1sOut, Paint Explainer, Beanie | Rig already has expressions; use fewer | Adopt |
| No articulated fingers/elbows on stick figures | All six | Current rig is already more detailed | Do not add more |
| Per-shot bespoke illustration | Kurzgesagt | Weeks per video | Reject |
| Blocky-texture world composited with vector figures | Alan Becker | Needs a texture pipeline and a reason | Reject |

## 6. Where this project already exceeds the references

Read from `docs/movement-system.md`, `docs/walking-mechanics-research.md` and
`src/characters/`: the repo has constrained IK, a gait planner, planted contacts and
balance solving. None of the six sampled channels demonstrate anything comparable in
a still — Alan Becker's figures are single-line limbs. The risk here is not
under-animation; it is spending effort on rig fidelity that the reference formats
never needed, while the cheaper levers (composition, set reuse, labels, one
measurement per beat) go unused.
