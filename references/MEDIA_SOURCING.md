# The Money Trap — Media Sourcing Standards

**Version 1 · 2026-11-16 · Phase 5: documentation only.**

Use the least costly medium that explains the beat well. Prefer original graphics, then verified reusable media where real-world context or evidence is valuable. A file being online, downloadable, credited or already in this repository does not by itself establish permission for the intended use.

Read with [branding](CHANNEL-BRANDING.md), the [visual style guide](VISUAL_STYLE_GUIDE.md), [script guide](SCRIPT_GUIDE.md) and [teaching guide](TEACHING_STYLE_GUIDE.md). Factual claims belong in `sources.md`; asset provenance belongs in the asset manifest. The [existing source ledger](../SOURCES.md) remains historical project provenance, not blanket clearance of future media.

This guide defines a manual workflow and manifest format. No downloader, automatic license checker, media ingestion system or publishing workflow is implemented here. Use local tools, bundle render-time files locally and retain the existing Remotion contract. Do not spend money, invoke paid APIs or acquire a subscription as part of routine sourcing without task authorization.

## 1. Sourcing order on a minimal budget

| Priority | Source | Appropriate use and required check |
|---|---|---|
| 1 | Original code-generated graphics and original SVG illustrations | Processes, objects, diagrams, mock interfaces and comparisons. Reuse existing assets where they fit; record authorship and any third-party inputs. Code-generated does not mean copied artwork is cleared. |
| 2 | User-created graphics, photography, footage and screenshots | Relevant context or evidence. Record who created/provided them and whether the underlying content, people or client material introduces separate rights/privacy concerns. A user-created screenshot still contains third-party interface/content. |
| 3 | Clearly licensed free footage and free-to-use photography | Specific everyday context. Check the actual asset page, applicable license version, commercial-use permission and restrictions. “Free download” is not a license. |
| 4 | Public-domain material where applicable | Historical material or evidence with a documented public-domain basis for the intended jurisdiction. Do not assume all old works, government-site files or library collections are unrestricted. |
| 5 | Other legitimately licensed documentary assets | Authentic excerpts, archive media or specialist footage that is necessary. Use an existing suitable license or seek permission; if rights or budget remain unresolved, use an original explanation or mark the shot pending. |

Do not search for stock just to meet a graphics/footage ratio. Reuse a verified asset only where its subject and permission fit the new shot. Prefer a clear original diagram over unrelated footage or an unclear license.

## 2. Shot-to-asset workflow

1. **Define the need.** Record beat ID, learning purpose, medium and what the asset must show. Distinguish contextual footage from evidence of a specific event.
2. **Check existing originals.** Inspect available objects, diagrams, episode art and local libraries. Check suitability and provenance without editing existing episodes as cleanup.
3. **Find a candidate at its source.** Use the creator/rightsholder, original archive record or legitimate provider asset page. A search result, social repost or aggregator thumbnail is a discovery route, not permission evidence.
4. **Verify the intended use.** Read asset-specific rights information and the governing license/terms. Check commercial monetized video, editing/cropping, online distribution, territory, duration, audience/channel limits, attribution and prohibited associations. Review embedded music, artworks, logos and recognizable people separately.
5. **Retain evidence.** Save the asset page/ID, creator, license text/version, access date, permissions or receipt, and relevant restrictions. Keep a local PDF, screenshot or text capture with URL/date; a mutable link alone is insufficient. Keep correspondence private where necessary.
6. **Record and freeze.** Add the manifest record, downloaded original and source notes. Give the file a stable name and SHA-256; track derived crops/edits and their parent asset. Use local copies at render time, never remote URLs.
7. **Review in context.** Check the actual narration, crop and adjacent shots for false associations, privacy, authenticity and required credits. Record any recreation/disclosure labels and the exact planned use.
8. **Check before delivery.** Confirm every used asset is verified for that use, credits are placed, evidence files resolve and the final render uses the recorded versions. A new use or changed license scope needs renewed review.

Use `pending`, `verified` or `rejected` for rights status. **Verified** means evidence supports the specific recorded use, with restrictions satisfied; it is not a guarantee against a claim. A pending candidate may appear as a labeled planning placeholder, but must not enter a delivery render. Replace it with original art, omit it or resolve the missing permission. Do not silently mark unavailable evidence as verified.

## 3. Permission, attribution and restrictions

### Commercial use and attribution

Treat planned monetized YouTube distribution as commercial use when checking licenses. Verify whether edits, thumbnails, excerpts, translations and redistribution in project files are permitted; permission for one use does not establish all others.

For example, Pexels permits free use/modification and does not require attribution, but restricts harmful depictions of identifiable people, implied endorsement and other uses. Check the [Pexels license](https://www.pexels.com/license/) and [commercial-use guidance](https://help.pexels.com/hc/en-us/articles/360042295214-Can-I-use-the-photos-and-videos-for-a-commercial-project) for the actual shot. This is a candidate source, not blanket clearance of its catalog.

Record the exact license and version; do not collapse all Creative Commons licenses into “CC.” For CC BY 4.0, provide the required credit, license reference and indication of modifications. Its terms also note that other rights may limit a use. Read the [CC BY 4.0 deed and linked legal code](https://creativecommons.org/licenses/by/4.0/) before relying on it. Check any noncommercial, no-derivatives or share-alike conditions in the actual license rather than assuming they fit this channel.

Record the complete attribution text and where it must appear, such as on screen, end credits or description. Verify that placement meets the license; do not assume a description credit is always enough. Preserve required notices even after cropping. Attribution does not replace permission.

### Copyright, public domain and fair-use uncertainty

An archive or public institution hosting an item does not necessarily own its rights or warrant reuse. Check the item's rights statement and provenance. The [Library of Congress explains](https://www.loc.gov/legal/security-copyright-and-privacy/understanding-copyright/) that reuse may depend on public-domain status, a license, permission or an applicable exception. Retain the specific basis and jurisdiction; do not infer it from the website domain or a date alone.

Fair use is a US, case-specific analysis, not an automatic documentary or educational exemption. Consider purpose/character, the work's nature, the amount/substantiality used and market effect. There is no universally safe clip length or percentage. See the [US Copyright Office's fair-use guidance](https://www.copyright.gov/fair-use/). Other jurisdictions may apply different exceptions. Record any proposed exception and its reasoning separately from a license; do not label it “licensed.” If relying on it is material and unresolved, seek qualified advice or replace the asset. This guide is not a legal determination.

### People, trademarks and other embedded rights

Avoid implying endorsement or an unsupported association with debt, distress, scams or wrongdoing. Use neutral context footage where appropriate; an identifiable person's image should not stand in as proof of the fictional character's financial conduct. Review applicable model/property releases, privacy and publicity issues and provider restrictions for the intended context.

Third-party trademarks and recognizable product/interface designs need contextual review. A stock copyright license may not settle trademark, privacy or endorsement questions. Use a neutral original mock interface when an actual brand is unnecessary. Preserve authenticity when a real brand is essential to a documented case; verify the basis for inclusion rather than inventing clearance or silently altering evidence.

## 4. Authentic evidence, screenshots and recreations

| Material | Treatment |
|---|---|
| Authentic screenshot or document | Record original source, date/version, capture context and relevant claim ID. Verify authenticity and use basis. Preserve wording, material qualifications and sequence. Redact private data and disclose editorial redactions. |
| User-created screenshot | Record capture authorship plus the rights/context of the interface and content shown. Remove account credentials and personal/customer data. Capturing a page does not automatically clear its reuse. |
| Original recreated interface, bill or message | Label “Illustrative interface” or “Recreated example” where confusion could arise. Use documented assumptions. Never present it as evidence of actual provider conduct or a real customer's record. |
| Editorial crop, highlight or collage | Keep the original and derived file, document modifications, and preserve context. Do not splice separate sources into an apparently authentic composite or remove qualifications that change meaning. |
| Chart redrawn from data | Cite the dataset/source, definitions, units, period and transformations; check data terms separately from permission to reproduce a published chart. Redrawing does not make unsupported facts original research. |

Keep authentic evidence distinct from illustration at the moment it matters. Fictional prices and balances must not resemble leaked records or verified customer testimony. A source citation cannot make an invented document authentic.

## 5. AI-generated media and YouTube originality

AI-generated media may serve an expressly illustrative role where appropriate, but cannot supply authentic documentary evidence. Record the tool/model, date, relevant input provenance, output file, edits, applicable usage terms and disclosure decision. Do not infer rights merely because an output was generated, or generate a realistic portrayal implying an actual person committed fraud or experienced an undocumented event.

YouTube requires disclosure for realistic AI-generated or meaningfully altered content, including certain depictions of people, events and places. Some minor or clearly nonrealistic assistance has different treatment. Check the current [YouTube disclosure policy](https://support.google.com/youtube/answer/14328491?hl=en) against the finished audio and visuals before upload, including any synthetic voice/music. Record the decision and date; an on-screen recreation label does not replace a required platform disclosure. This task does not authorize generation, a voice substitution or upload.

YouTube's [monetization policies](https://support.google.com/youtube/answer/1311392?hl=en) distinguish repetitive/mass-produced “inauthentic content” from reused content lacking sufficient original contribution. Permission alone does not resolve the reused-content assessment; copyright clearance and monetization are separate questions. Build a specific researched explanation with original narration, meaningful visual development and substantive commentary. A collection of licensed clips with superficial edits is not this channel's creative standard.

**No visual style, media ratio, license, AI disclosure or original-graphics percentage guarantees monetization.** Review the channel and final work against current platform policies, including applicable advertiser suitability and other requirements, at the time of publication. No monetization eligibility is certified by this guide.

## 6. Asset manifest format

For future episodes, keep a manually maintained `asset-manifest.json` beside the episode's planning files under `videos/<episode>/`. This is a documentation convention, not a schema currently consumed or validated by the renderer. Store actual render media in the episode's existing local asset/public arrangement; do not reorganize current assets during this phase.

Keep license evidence in a stable episode-owned `asset-evidence/<asset-id>/` folder or another explicitly recorded local location. Preserve original files and evidence with the production archive while the work remains in use. Do not store passwords, session tokens or unnecessary personal information in the manifest/evidence. Keep private permission records outside version control and record an accessible private reference where needed.

| Field | Required content |
|---|---|
| `id`, `kind`, `title` | Stable asset ID; original SVG, footage, photo, screenshot, document, chart, audio or generated media; descriptive title. |
| `creator`, `source_url` | Creator/rightsholder and original asset page. Original project work may use a repository-relative source path with URL null. Unknown authorship stays pending. |
| `source_path`, `local_path`, `sha256` | Original project source if applicable, frozen local file and file hash. Null for a candidate not yet acquired. |
| `license`, `license_url`, `rights_basis` | Exact license/version and terms link, or documented original authorship/public-domain/permission/exception basis. Never invent a license for an exception. |
| `permitted_uses`, `restrictions` | What the evidence permits and any territory, term, editing, commercial-use, distribution, people/logo or other limits. |
| `intended_use`, `beat_ids`, `claim_ids` | Exact planned placement/context and supported claims or hypothetical assumptions. Approval is for this use. |
| `attribution_text`, `attribution_placement` | Full required credit and its verified placement; explicitly record when no attribution is required and why. |
| `evidence_paths`, `verified_on`, `verified_by`, `status` | Retained evidence locations, verification date in YYYY-MM-DD, reviewer and pending/verified/rejected. Use null dates for unchecked candidates. |
| `parent_asset_id`, `modifications` | Provenance for crops, edits, redactions and derived versions. |
| `authenticity`, `disclosure` | Authentic/original illustration/recreation/generated classification, contextual labels and any platform-disclosure decision or pending review. |

Example **pending planning record only**; this clears no actual asset:

```json
{
  "version": 1,
  "assets": [
    {
      "id": "A001",
      "kind": "footage",
      "title": "Routine car-repair context candidate",
      "creator": null,
      "source_url": null,
      "source_path": null,
      "local_path": null,
      "sha256": null,
      "license": null,
      "license_url": null,
      "rights_basis": null,
      "permitted_uses": [],
      "restrictions": [],
      "intended_use": "Context for a fictional repair; never presented as an actual BNPL customer's experience",
      "beat_ids": ["repair-context"],
      "claim_ids": [],
      "attribution_text": null,
      "attribution_placement": null,
      "evidence_paths": [],
      "verified_on": null,
      "verified_by": null,
      "status": "pending",
      "parent_asset_id": null,
      "modifications": [],
      "authenticity": "pending source review",
      "disclosure": "Pending contextual-label and platform review"
    }
  ]
}
```

Original project assets also get records: identify author/source, third-party inputs if any, actual file/hash, intended use and verification evidence. “Original” is a provenance claim to support, not a shortcut around checking embedded media. For a derived asset, add its own file/hash and link to the parent record rather than replacing the original's identity. Do not mark all historical assets verified as a side effect of introducing this format.

## 7. Evidence review and phase boundary

Before a future delivery, compare the manifest with the actual rendered shots and any audible third-party media. Verify source/license evidence, permitted use, attribution, privacy, authenticity labels and any required disclosure. Record pending items and rights decisions in episode QA alongside, but separately from, factual and technical results. A hash proves file identity, not ownership or permission. Manual verification remains necessary; no automated license gate is claimed.

The official policy/license pages cited here were consulted on **2026-11-16**. Recheck the applicable version when acquiring assets and before publication; this date does not clear any specific media file. Historical source records remain unchanged. This guide, the [research playbooks](../research/README.md) and updated [global instructions](../AGENTS.md) are synchronized through Phase 9. The migration documents a workflow without implementing automatic clearance or certifying media/monetization.
