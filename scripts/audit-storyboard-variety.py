"""Build the per-panel audit from visually reviewed v3 annotations and the new shot plan."""
import argparse
import csv
import json
from collections import Counter
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("candidate", type=Path)
args = parser.parse_args()
baseline = Path("out/001-lifestyle-creep/storyboard-design-v3")
old = json.loads((baseline / "index.json").read_text(encoding="utf-8"))
new = json.loads((args.candidate / "index.json").read_text(encoding="utf-8"))
old_panels = [(scene, im) for scene in old["scenes"] for im in scene["images"]]
new_panels = {Path(im["file"]).stem: im for scene in new["scenes"] for im in scene["images"]}
assert len(old_panels) == len(new_panels) == 99

# Visible currency occurrences, including repeated amounts on a phone and receipt.
counts = {
    1:[2,0],2:[0,0,0],3:[0,0],4:[0,4],5:[2],6:[2,3,2],7:[0],8:[0,0],9:[3],10:[1],11:[2],12:[0,0,0,0],13:[3],14:[1,0],15:[3],16:[2],17:[1],18:[0],19:[1],20:[0,0],21:[1,2],22:[3,6],23:[4],24:[2],25:[1],26:[0,0],27:[5],28:[3],29:[3],30:[1],31:[1],32:[4,4],33:[2,2],34:[2,0],35:[2],36:[0],37:[1],38:[5],39:[0,0],40:[0,0],41:[4],42:[3,0],43:[1,1],44:[3],45:[4],46:[3],47:[0],48:[0,0],49:[0],50:[2,5],51:[2,5],52:[0,0],53:[0,0],54:[3],55:[0],56:[1,1],57:[2],58:[3],59:[0],60:[2],61:[2,2],62:[3],63:[0,2],64:[2],65:[3],66:[2,2],67:[3],
}
profiles = {
    "desk": ("Medium character shot", "eye-level frontal wide", "left third; full body, about 55% frame height", "Sam/Alex beside document", "horizontal desk plus vertical slips", "desk, ledger, slips", "desk; documents; occasional keys/laptop"),
    "bank": ("Medium character shot", "eye-level medium or close", "left third; 75-100% height, lower legs sometimes cropped", "phone plus repeated amount", "phone rectangle echoed by receipt", "phone, desk, receipt", "phone; desk; receipt; expense slip"),
    "split": ("Split-screen", "matched frontal wide", "two equal half-frame figures, about 50% height", "paired characters and receipts", "two repeated desk horizontals", "paired desks, receipts", "desks; laptop; cup; receipts; hobby prop"),
    "table": ("Object close-up", "high oblique / angled tabletop", "absent or small Sam behind table", "raise and cost papers", "large trapezoid plus paper rectangles", "table, slips, envelope", "angled table; cost slips; raise envelope"),
    "vehicle": ("Wide environmental shot", "frontal side view wide", "right third; full body, about 55% height", "rental vehicle and key holder", "car wedge and standing silhouette", "rental vehicle, keys", "rental car; held keys"),
    "cabin": ("Character close-up", "passenger-side frontal close", "central head/torso, about 65% height", "Sam's satisfaction in seat", "large seat rectangle and steering ellipse", "seat, steering wheel", "seat; dashboard; steering wheel"),
    "isolated": ("Medium character shot", "eye-level wide", "left third or central pair; full body, about 55% height", "character reaction or equal example", "isolated upright silhouettes", "phone/pay notice or example boundary", "character; optional pay notice/phone"),
    "dining": ("Medium character shot", "eye-level wide", "left-center seated figure, about 50% height", "a meal", "short table and seated silhouette", "dining table and plate", "plate; table"),
    "work": ("Medium character shot", "eye-level wide", "left third seated figure, about 45% height", "working at laptop", "long desk horizontal, small seated figure", "desk and laptop", "desk; laptop; occasional dishes"),
}

def family(sid, phase):
    if phase == "S02-entertainment" or phase == "S12-lift-phone":
        return "bank"
    if sid in {5,11,48,50,51,52,64} and not phase.endswith("rental-tradeoff"):
        return "split"
    if sid in {21,22,61,62}:
        return "table"
    if phase in {"S02-rental","S20-newer-seat"}:
        return "cabin"
    if sid == 19 or phase.endswith(("older-rental","alex-keeps-rental","rental-tradeoff")):
        return "vehicle"
    if sid in {1,49}:
        return "isolated"
    if phase.endswith("meal"):
        return "dining"
    if phase in {"S04-working","S08-cramped","S14-alex-keeps-home","S16-main"}:
        return "work"
    if sid in {3,6,15,23,25,26,28,29,35,44,46,55,58,67} or phase.endswith(("current-plan","earlier-month-three")):
        return "bank"
    return "desk"

families = [(scene, panel, family(int(scene["id"][1:]), Path(panel["file"]).stem)) for scene,panel in old_panels]
subjects = {
  1:"raise notice, then stopped phone check",2:"laptop carry / rental seat / entertainment phone",3:"Sam and enlarged banking screen",4:"work at laptop, then combined cost slips",5:"equal raise receipts beside matched desks",6:"paycheck, expenses and transfer receipts",7:"fictional example ledger and closed book",8:"laptop beside dishes / older rental",9:"pay envelope and expense/remainder slips",10:"Sam considers spending and saving at desk",11:"matched starting raise slips",12:"phone, carried laptop, desk placement and satisfaction",13:"rent and remainder slips beside raise envelope",14:"lease signing / Alex's retained workspace",15:"phone transfer and expense/transfer receipts",16:"comfortable worker and old/new transfer slips",17:"monthly rent slip separated from moving box",18:"retained laptop desk and separate dinner table",19:"newer rental, keys and cost slip",20:"comfortable rental cabin / Alex's older rental",21:"rental quote and raise envelope on angled table",22:"rent, quote and finite allocation on angled table",23:"phone and new transfer plus expenses",24:"separate cost list and closed goal book",25:"service phone and $100 slip",26:"Sam's entertainment phone / Alex's phone",27:"rent/car/service slips and $620 total",28:"phone, expenses and $380 transfer slip",29:"old/new phone transfers plus $380 slip",30:"laptop comfort beside smaller transfer slip",31:"positive contribution slip and open book",32:"three contribution slips and period total",33:"monthly pair, then accumulated pair of slips",34:"raise envelope and transfer / Alex's book",35:"phone transfer mirrored by receipt",36:"balance symbol drawn in open book",37:"contribution slip and closed finance book",38:"combined commitments on desk",39:"seated dinner / paid-once calendar",40:"calendar pages above recurring-expense slips",41:"raise, existing commitments and $80 slip",42:"Sam's reduced transfer / Alex's planning book",43:"Alex's hobby prop / Alex's dinner",44:"Alex's phone and expense/transfer receipts",45:"three allocation slips and $800 total",46:"phone, expense receipt and scheduled calendar",47:"Alex's next purchase review at desk",48:"matched workspaces / paired rental vehicles",49:"equal characters inside example boundary",50:"matched receipt filing / three-month totals",51:"equal pay envelopes / Month 3 transfer receipts",52:"matched desk benefits and character reactions",53:"Sam's full-list stress / useful desk comfort",54:"three-item commitment slip and goal note",55:"service phone and open planning book",56:"crossed-out service slip / billing calendar",57:"unchanged rent/car slips and keys",58:"revised expenses and transfer on phone/receipts",59:"calendar and closed book at retained desk",60:"pay envelope, unchanged transfer and future note",61:"twelve equal units per row on angled tabletop",62:"annual totals and gap above angled tabletop",63:"closed example book / actual transfer phone",64:"matched lifestyle desks and chosen transfer slips",65:"unchanged pay and revised expense/transfer slip",66:"earlier and current transfer phone/receipt",67:"phone, planned transfer receipt and paycheck",
}
foreground_props = {
  1:"pay notice; envelope / phone",2:"desk; laptop; chair; planter / seat; wheel / phone; desk",3:"phone; desk; enlarged screen",4:"desk; laptop / slips; phone; keys; envelope",5:"two desks; two receipts; cup",6:"phone; desk; paycheck envelope; expense/transfer slips",7:"desk; ledger; slip; closed book",8:"desk; laptop; dishes; cup / older rental; keys",9:"desk; pay envelope; two slips",10:"desk; pay envelope; keys; blank goal slip",11:"matched desks; cups; equal slips",12:"phone; laptop; desk; cups; dishes; chair; planter",13:"desk; cost and remaining slips; envelope",14:"desk; document; pen; envelope / laptop; document",15:"desk; phone; expense/transfer slips",16:"desk; laptop; two transfer slips",17:"desk; lease; rent slip; moving box; dashed boundary",18:"desk; laptop; keys; dining table; plate",19:"newer rental; keys; $220 slip",20:"seat; wheel; dashboard / older rental; keys",21:"angled table; quote; raise envelope",22:"angled table; quote; rent slip; raise envelope; allocation strip",23:"desk; phone; expense/transfer slips",24:"desk; cost list; goal note; closed book",25:"desk; service phone; $100 slip; keys",26:"desk; phone / desk; phone; dishes; cup",27:"desk; rent/car slips; phone; keys; envelope",28:"desk; phone; expense/transfer slips",29:"desk; phone; transfer slip",30:"desk; laptop; keys; transfer slip; planter",31:"desk; ledger; open book; contribution slip",32:"desk; ledger; three dated contribution slips",33:"desk; ledger; paired comparison slips",34:"desk; ledger; envelope; transfer slip / open book",35:"desk; phone; transfer receipt",36:"desk; ledger; open book with balance drawing",37:"desk; ledger; contribution slip; closed book",38:"desk; rent/car slips; phone; keys; envelope",39:"dining table; plate / desk; calendar; blank slip",40:"desk; ledger; recurring slips; calendar pages",41:"desk; rent/car slips; keys; envelope; $80 slip",42:"desk; phone; transfer receipt / ledger; open book",43:"desk; laptop; guitar; dishes; slip / dining table; envelope",44:"desk; phone; expense/transfer slips",45:"desk; ledger; three allocation slips",46:"desk; phone; slips; calendar",47:"desk; ledger; choice note; cup; plate; keys",48:"desks; laptop; cup; guitar / two rentals; keys",49:"dashed example boundary",50:"matched desks; receipt trays; laptop; cup; guitar; receipts",51:"matched desks; envelopes / matched desks; receipts; trays",52:"matched desks; laptop; receipt trays; cup; guitar",53:"desk; ledger / desk; laptop; keys; planter",54:"desk; ledger; full commitment list; goal note",55:"desk; phone; open book; goal note",56:"desk; phone; crossed slip / ledger; calendar; removed cost slip",57:"desk; rent/car slips; keys",58:"desk; phone; expense/transfer slips",59:"desk; laptop; keys; calendar; closed book",60:"desk; ledger; envelope; transfer slip; future note",61:"angled tabletop; twelve contribution units in each row",62:"angled tabletop; annual comparison receipts",63:"desk; ledger; closed book / desk; phone; transfer slip",64:"matched desks; guitar; laptop; cup; transfer slips",65:"desk; ledger; paycheck envelope; revised budget slip",66:"desk; phone; transfer slip",67:"desk; phone; transfer slip; paycheck envelope",
}
rows = []
indexes = Counter()
for scene,panel,kind in families:
    sid = int(scene["id"][1:]); phase = Path(panel["file"]).stem
    count = counts[sid][indexes[sid]]; indexes[sid] += 1
    category,camera,actor,subject,shape,repeated,foreground = profiles[kind]
    subject = subjects[sid]
    props = foreground_props[sid]
    if kind == "bank":
        actor = "left third; full body, about 55% frame height" if sid in {2,25,26,55,63,66} or phase == "S12-lift-phone" else actor
    if phase == "S12-open-laptop":
        category,camera,actor,shape = "Object close-up","eye-level laptop/hand close","large Sam at left; torso and laptop dominate","laptop silhouette against desk edge"
    if sid in {61,62}:
        category,subject,shape = "Financial diagram",subjects[sid],"two money rows or annual receipts above tabletop"
    if sid in {39,40,46,59}:
        subject = subjects[sid]
    severity = "High" if kind in {"desk","bank","split","table"} else "Medium" if kind in {"work","vehicle","cabin","isolated"} else "Low"
    if phase == "S49-main": severity = "Low"
    similar = sorted({s["id"] for s,p,k in families if k==kind and s["id"] != scene["id"]})
    design = new_panels[phase]["design"]
    rows.append({
        "Panel":phase, "Scene":scene["id"], "Narrative purpose":scene["title"],
        "Composition type":category, "Camera angle and distance":camera,
        "Character position and size":actor, "Primary subject":subject,
        "Background":"fixed rough paper", "Foreground objects":props,
        "Dominant visual shape":shape, "Repeated props":repeated,
        "Financial figure count":count, "Similar scenes":", ".join(similar),
        "Repetition severity":severity,
        "Suggested redesign":design["category"]+"; "+design["camera"]+"; "+design["action"],
        "New primary subject":design["subject"], "New prop focus":design["propFocus"],
    })
assert all(indexes[sid]==len(values) for sid,values in counts.items())
csv_path = Path("docs/visual-variety-panels.csv")
with csv_path.open("w",newline="",encoding="utf-8") as file:
    writer=csv.DictWriter(file,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)

def runs(items):
    found=[]; start=0
    for i in range(1,len(items)+1):
        if i==len(items) or items[i][2] != items[start][2]:
            if i-start>=3: found.append((Path(items[start][1]["file"]).stem,Path(items[i-1][1]["file"]).stem,items[start][2],i-start))
            start=i
    return found

summary = Counter(kind for _,_,kind in families)
new_summary=Counter(panel["design"]["category"] for panel in new_panels.values())
text = """# Visual variety and art direction audit

Scope: all 67 scenes / 99 panels from storyboard-design-v3, visually reviewed in
chronological order before implementation. Character scale/position descriptions
are visual estimates, not computer-vision measurements. Currency counts include
duplicate visible occurrences. Severity describes repetition across the episode,
not whether a prop is legitimate in an individual shot.

## Evidence and findings

- Baseline: [complete episode](../out/001-lifestyle-creep/visual-variety-audit-v1/complete-episode.png),
  nine chronological sheets of at most 12 panels, composition groups, and seven
  recurring-prop sheets in that same folder. The sheet index lists the groups.
- The longest repeated arrangements are the desk/bank runs through S23–S38 and
  S53–S67. All six S50–S52 panels use the same matched desks. The opening's
  phone/receipt framing recurs at S15/S23/S28/S29/S35/S44/S58/S67.
- Useful anchors: cramped laptop/dishes, rental comfort insert, equal starting
  conditions, a real signing action, and a stable numerical reveal. Keep their
  narrative function, not the repeated desk framing.
- V3 also substitutes Alex in S26/S34/S42 while narration is still following
  Sam. New artwork retains Sam in those moments. Stable panel IDs remain for
  review correspondence; the old `alex-checks` suffix is not a character cue.

### Baseline composition families (visually annotated)

"""
text += "\n".join(f"- {k}: {v} panels" for k,v in summary.items())
text += "\n\n### Consecutive repeated families, at least three panels\n\n"
text += "\n".join(f"- {a} through {b}: {n} panels, {k}" for a,b,k,n in runs(families))
text += """

## Applied composition rules

Choose camera and subject from the narrated action. No cyclic shot-category order.
Use face close-ups for realization, object inserts for actual decisions, POV or
shoulder views for transfers, equal split views for genuine comparisons, and
shared numerical scales for calculations. A desk remains for working/signing;
paper remains for the lease and full-list review. Phones primarily carry actual
checking/transfer actions, listings or cancellation context.

Review three-scene primary-layout runs and five-panel phone/desk/document runs.
These are heuristics, not a creative approval score. Deliberate callbacks include
S01/S29/S67, the same finite $600 allocation at S13/S22/S27/S41/S66, and the
paired monthly-versus-accumulated figures. No random camera changes are added.
Blank calendar grids carry time through narration; images contain currency only.
Contribution bars share scales within each comparison, annual cells share the
same $800 input scale, and the $620 overrun extends beyond the single $600 limit.

## Implemented category distribution

"""
text += "\n".join(f"- {k}: {v} panels" for k,v in new_summary.items())
text += """

## Per-panel repetition audit

Every row below records the reviewed v3 panel and its implemented replacement.
The [CSV](visual-variety-panels.csv) contains the full separate fields, including
complete similar-scene lists, background, foreground and new primary subject.
Background in every row: fixed rough paper. No architectural set is introduced.

| Panel / narrative purpose | Old type / camera | Character position and size | Subject / dominant shape | Foreground / repeated props | Figures | Similar scenes | Severity | Implemented redesign |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
"""
for row in rows:
    values = [row["Panel"]+": "+row["Narrative purpose"],row["Composition type"]+"; "+row["Camera angle and distance"],row["Character position and size"],row["Primary subject"]+"; "+row["Dominant visual shape"],row["Foreground objects"]+"; "+row["Repeated props"],str(row["Financial figure count"]),", ".join(row["Similar scenes"].split(", ")[:5]),row["Repetition severity"],row["Suggested redesign"]]
    text += "| " + " | ".join(v.replace("|","/") for v in values) + " |\n"
text += "\n## Review boundary\n\nNew stills require human visual approval. Category coverage and arithmetic tests\ndo not establish acting, motion, listening or synchronization approval. No new\nvideo/audio or narration timing was created. Older packets remain intact.\n"
text += f"\n## Current redesigned review\n\n[Open all 67 scenes](../{args.candidate.as_posix()}/review/index.html).\n[View the complete redesigned sequence](../{args.candidate.as_posix()}/contact-sheets/complete-episode.png).\nChronological, composition-group and recurring-prop sheets are in that packet's\ncontact-sheets folder. Original images and animated reference movies remain intact.\n"
Path("docs/visual-variety-audit.md").write_text(text,encoding="utf-8")
print(f"Audited {len(rows)} panels; wrote docs/visual-variety-audit.md and {csv_path}")
