# Doctor Social Preview Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the direct portrait social preview with an approved, reference-matched `1200 × 630` Dr. Umair Arshad banner and complete Open Graph/Twitter image metadata.

**Architecture:** Keep the unchanged doctor portrait as the source of truth and compose it into an editable SVG design with exact text and a dark-teal information panel. Export that design once as a crawler-friendly JPEG in `public/`, then centralize its absolute URL, MIME type, and dimensions in `src/lib/seo.ts` for both root and homepage metadata.

**Tech Stack:** SVG, ImageMagick, TypeScript, TanStack Router head metadata, Node test runner, Vite static prerender.

---

## File structure

- Create `assets/social-preview-home.svg`: editable `1200 × 630` source composition using the existing portrait without modifying it.
- Create `public/social-preview-home.jpg`: final optimized social-sharing image consumed by crawlers.
- Create `tests/social-preview.test.ts`: validates the exported JPEG format/dimensions and exact source copy.
- Modify `src/lib/seo.ts`: points sharing metadata to the banner and records its type/dimensions.
- Modify `src/routes/__root.tsx`: publishes complete default Open Graph/Twitter image metadata.
- Modify `src/routes/index.tsx`: publishes the same complete homepage metadata.
- Modify `tests/branding.test.ts`: locks the public banner URL and metadata constants.
- Modify `tests/github-pages-build.test.mjs`: verifies the prerendered GitHub Pages HTML contains the new banner and image fields.

### Task 1: Create the approved banner asset

**Files:**
- Create: `tests/social-preview.test.ts`
- Create: `assets/social-preview-home.svg`
- Create: `public/social-preview-home.jpg`

- [ ] **Step 1: Write the failing asset test**

Create `tests/social-preview.test.ts` with a small JPEG marker parser so the test uses the real exported file without adding an image dependency:

```ts
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function readJpegDimensions(buffer: Buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, "social preview must be a JPEG");
  let offset = 2;

  while (offset < buffer.length) {
    assert.equal(buffer[offset], 0xff, "invalid JPEG marker");
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd9 || marker === 0xda) break;
    const length = buffer.readUInt16BE(offset);
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    offset += length;
  }

  throw new Error("JPEG dimensions not found");
}

test("exports the doctor social preview at 1200 by 630", async () => {
  const image = await readFile(new URL("../public/social-preview-home.jpg", import.meta.url));
  assert.deepEqual(readJpegDimensions(image), { width: 1200, height: 630 });
});

test("keeps the approved doctor details in the editable banner source", async () => {
  const source = await readFile(new URL("../assets/social-preview-home.svg", import.meta.url), "utf8");
  assert.match(source, /Dr\. Umair Arshad/);
  assert.match(source, /MBBS, FCPS \(Paediatrics\)/);
  assert.match(source, /Consultant Pediatrician \/ Child Specialist/);
  assert.match(source, /\+92 304 3755293/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/social-preview.test.ts`

Expected: FAIL because `public/social-preview-home.jpg` and `assets/social-preview-home.svg` do not exist.

- [ ] **Step 3: Add the editable SVG composition**

Create `assets/social-preview-home.svg` with `viewBox="0 0 1200 630"`. Place `../public/dr-umair-arshad.png` inside a `468 × 630` clipped left column, fill the remaining area with `#114f4d`, and render this exact right-column copy:

```text
EXPERT PEDIATRIC CARE
Dr. Umair Arshad
MBBS, FCPS (Paediatrics)
Consultant Pediatrician / Child Specialist
Newborn care · Vaccinations
Growth & development
Appointments: +92 304 3755293
```

Use only system-safe `Arial`/`Georgia` font fallbacks and preserve the original portrait file unchanged.

- [ ] **Step 4: Export the production JPEG**

Run:

```bash
magick -background white assets/social-preview-home.svg -strip -interlace Plane -quality 88 public/social-preview-home.jpg
```

Expected: `public/social-preview-home.jpg` is a `1200 × 630` JPEG.

- [ ] **Step 5: Run the asset tests to verify they pass**

Run: `node --experimental-strip-types --test tests/social-preview.test.ts`

Expected: PASS for JPEG dimensions and exact approved copy.

- [ ] **Step 6: Commit the banner asset**

```bash
git add assets/social-preview-home.svg public/social-preview-home.jpg tests/social-preview.test.ts
git commit -m "feat: add doctor social preview banner"
```

### Task 2: Publish complete Open Graph and Twitter metadata

**Files:**
- Modify: `tests/branding.test.ts`
- Modify: `tests/github-pages-build.test.mjs`
- Modify: `src/lib/seo.ts`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Update metadata expectations first**

In `tests/branding.test.ts`, require:

```ts
assert.equal(
  SEO.imageUrl,
  "https://zeshanashraf829.github.io/zeshanashraf829/social-preview-home.jpg",
);
assert.equal(SEO.imageType, "image/jpeg");
assert.equal(SEO.imageWidth, "1200");
assert.equal(SEO.imageHeight, "630");
```

In `tests/github-pages-build.test.mjs`, require the new absolute URL plus prerendered `og:image:secure_url`, `image/jpeg`, `1200`, and `630` metadata values.

- [ ] **Step 2: Run the expectations to verify they fail**

Run:

```bash
npm test
npm run test:pages
```

Expected: FAIL because SEO still points to `dr-umair-arshad.png` and the existing build lacks the new fields.

- [ ] **Step 3: Update the centralized SEO constants**

Change `src/lib/seo.ts` to:

```ts
export const SEO = {
  siteUrl: "https://zeshanashraf829.github.io/zeshanashraf829/",
  imageUrl: "https://zeshanashraf829.github.io/zeshanashraf829/social-preview-home.jpg",
  imageAlt: "Dr. Umair Arshad — Consultant Pediatrician / Child Specialist",
  imageType: "image/jpeg",
  imageWidth: "1200",
  imageHeight: "630",
  title: "Dr. Umair Arshad | Consultant Pediatrician / Child Specialist",
  description: "Gentle, expert pediatric care from newborn to adolescent with Dr. Umair Arshad.",
} as const;
```

- [ ] **Step 4: Add complete image metadata to both route heads**

In `src/routes/__root.tsx` and `src/routes/index.tsx`, publish:

```ts
{ property: "og:image", content: SEO.imageUrl },
{ property: "og:image:secure_url", content: SEO.imageUrl },
{ property: "og:image:type", content: SEO.imageType },
{ property: "og:image:width", content: SEO.imageWidth },
{ property: "og:image:height", content: SEO.imageHeight },
{ property: "og:image:alt", content: SEO.imageAlt },
{ name: "twitter:card", content: "summary_large_image" },
{ name: "twitter:image", content: SEO.imageUrl },
{ name: "twitter:image:alt", content: SEO.imageAlt },
```

Keep the existing Open Graph/Twitter title and description fields.

- [ ] **Step 5: Rebuild the GitHub Pages output**

Run: `VITE_BASE_PATH=/zeshanashraf829/ npm run build`

Expected: static pages are emitted under `dist/client/` and copy `social-preview-home.jpg` to the output root.

- [ ] **Step 6: Verify all focused tests pass**

Run:

```bash
npm test
npm run test:pages
```

Expected: all branding, banner, and GitHub Pages tests PASS.

- [ ] **Step 7: Commit the metadata change**

```bash
git add src/lib/seo.ts src/routes/__root.tsx src/routes/index.tsx tests/branding.test.ts tests/github-pages-build.test.mjs
git commit -m "feat: use branded doctor link preview"
```

### Task 3: Final verification and delivery

**Files:**
- Verify only; no planned source changes.

- [ ] **Step 1: Run the complete verification suite**

Run:

```bash
npm test
npm run test:pages
npx tsc --noEmit
npm run lint
VITE_BASE_PATH=/zeshanashraf829/ npm run build
git diff --check
```

Expected: tests, typecheck, build, and diff check pass; lint has no errors (existing Fast Refresh warnings may remain).

- [ ] **Step 2: Inspect the final banner and prerendered metadata**

Run:

```bash
magick identify public/social-preview-home.jpg
rg -n "social-preview-home|og:image:secure_url|image/jpeg|1200|630" dist/client/index.html
```

Expected: the asset is exactly `1200 × 630`, the canonical absolute URL is present, and the full Open Graph/Twitter image metadata is crawler-visible in static HTML.

- [ ] **Step 3: Confirm the branch is ready to push**

Run: `git status --short --branch`

Expected: `main` is clean and ahead of `origin/main` only by the new approved commits.
