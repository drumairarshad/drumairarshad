# Dr. Umair Arshad Website Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website's public legacy doctor and Lovable branding with Dr. Umair Arshad's identity, official contacts, supplied portrait, initials favicon, and GitHub Pages social-preview metadata.

**Architecture:** Keep brand constants and exact legacy-value migration in a pure TypeScript module that can be tested without React. Existing site data remains the single content source for rendered pages, while crawler-facing SEO constants remain independent of browser storage. Store the unchanged portrait once for the application bundle and once at a stable public URL for social crawlers.

**Tech Stack:** TanStack Start, React 19, TypeScript, Vite, Node's built-in test runner, Tailwind CSS, SVG/ICO assets.

---

## File map

- Create `src/lib/branding.ts`: canonical public identity constants and exact legacy-value migration.
- Create `src/lib/contact-links.ts`: normalized `tel:` URL generation.
- Create `src/lib/seo.ts`: canonical GitHub Pages and social-preview constants.
- Create `tests/branding.test.ts`: pure unit coverage for migration, contact links, and SEO URLs.
- Modify `src/lib/site-data.ts`: new defaults and migration integration.
- Modify `src/routes/index.tsx`: supplied portrait and doctor-specific homepage metadata.
- Modify `src/routes/__root.tsx`: global sharing metadata, favicon declarations, and removal of Lovable telemetry.
- Modify `src/routes/contact.tsx`, `src/routes/hospitals.tsx`, and `src/components/site/Footer.tsx`: normalized telephone links.
- Create `src/assets/dr-umair-arshad.png`: unchanged bundled homepage portrait.
- Create `public/dr-umair-arshad.png`: unchanged stable social-preview portrait.
- Create `public/favicon.svg` and replace `public/favicon.ico`: `UA` favicon variants.
- Delete `src/lib/lovable-error-reporting.ts`: remove Lovable-specific browser telemetry.
- Modify `README.md`: remove Lovable promotion and document the neutral local workflow.
- Modify `package.json`: expose the Node test command.

### Task 1: Brand migration and contact-link behavior

**Files:**
- Create: `src/lib/branding.ts`
- Create: `src/lib/contact-links.ts`
- Create: `tests/branding.test.ts`
- Modify: `src/lib/site-data.ts`
- Modify: `src/routes/contact.tsx`
- Modify: `src/routes/hospitals.tsx`
- Modify: `src/components/site/Footer.tsx`
- Modify: `package.json`

- [ ] **Step 1: Add the failing migration and telephone-link tests**

Create `tests/branding.test.ts` with fixtures that contain only the migration's required structural fields:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { BRAND, migrateLegacyBranding } from "../src/lib/branding.ts";
import { toTelHref } from "../src/lib/contact-links.ts";

const legacyData = () => ({
  doctor: { name: "Dr. Ayesha Khan" },
  contact: {
    email: "appointments@drayeshakhan.com",
    phone: "+92 300 1234567",
  },
  hospitals: [
    { phone: "+92 300 1234567" },
    { phone: "+92 300 7654321" },
    { phone: "" },
  ],
  socials: [
    { platform: "facebook", url: "https://facebook.com/" },
    { platform: "whatsapp", url: "https://wa.me/923001234567" },
  ],
});

test("migrates only the exact legacy doctor defaults", () => {
  const migrated = migrateLegacyBranding(legacyData());

  assert.equal(migrated.doctor.name, BRAND.doctorName);
  assert.equal(migrated.contact.email, BRAND.email);
  assert.equal(migrated.contact.phone, BRAND.phoneDisplay);
  assert.deepEqual(
    migrated.hospitals.map((hospital) => hospital.phone),
    [BRAND.phoneDisplay, BRAND.phoneDisplay, ""],
  );
  assert.equal(migrated.socials[1]?.url, BRAND.whatsappUrl);
});

test("preserves administrator-entered custom values", () => {
  const custom = legacyData();
  custom.doctor.name = "Dr. Custom Name";
  custom.contact.email = "clinic@example.com";
  custom.contact.phone = "+92 311 0000000";
  custom.hospitals[0]!.phone = "+92 322 0000000";
  custom.socials[1]!.url = "https://wa.me/923330000000";

  assert.deepEqual(migrateLegacyBranding(custom), custom);
});

test("normalizes display numbers in telephone links", () => {
  assert.equal(toTelHref(BRAND.phoneDisplay), "tel:+923043755293");
});
```

Add this script to `package.json`:

```json
"test": "node --experimental-strip-types --test tests/*.test.ts"
```

- [ ] **Step 2: Run the tests and confirm the new modules are missing**

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/branding.ts` or `src/lib/contact-links.ts`.

- [ ] **Step 3: Implement canonical brand values and narrow legacy migration**

Create `src/lib/branding.ts`:

```ts
export const BRAND = {
  doctorName: "Dr. Umair Arshad",
  email: "drumairarshad74@gmail.com",
  phoneDisplay: "+92 304 3755293",
  phoneLink: "+923043755293",
  whatsappUrl: "https://wa.me/923043755293",
} as const;

type BrandMigratable = {
  doctor: { name: string };
  contact: { email: string; phone: string };
  hospitals: Array<{ phone?: string }>;
  socials: Array<{ platform: string; url: string }>;
};

const LEGACY = {
  doctorName: "Dr. Ayesha Khan",
  email: "appointments@drayeshakhan.com",
  phones: new Set(["+92 300 1234567", "+92 300 7654321"]),
  whatsappUrl: "https://wa.me/923001234567",
} as const;

export function migrateLegacyBranding<T extends BrandMigratable>(data: T): T {
  return {
    ...data,
    doctor: {
      ...data.doctor,
      name:
        data.doctor.name === LEGACY.doctorName ? BRAND.doctorName : data.doctor.name,
    },
    contact: {
      ...data.contact,
      email: data.contact.email === LEGACY.email ? BRAND.email : data.contact.email,
      phone: LEGACY.phones.has(data.contact.phone)
        ? BRAND.phoneDisplay
        : data.contact.phone,
    },
    hospitals: data.hospitals.map((hospital) => ({
      ...hospital,
      phone:
        hospital.phone && LEGACY.phones.has(hospital.phone)
          ? BRAND.phoneDisplay
          : hospital.phone,
    })),
    socials: data.socials.map((social) => ({
      ...social,
      url:
        social.platform === "whatsapp" && social.url === LEGACY.whatsappUrl
          ? BRAND.whatsappUrl
          : social.url,
    })),
  } as T;
}
```

Create `src/lib/contact-links.ts`:

```ts
export function toTelHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
```

In `src/lib/site-data.ts`, import `BRAND` and `migrateLegacyBranding`:

```ts
import { BRAND, migrateLegacyBranding } from "./branding";
```

Use the constants in the existing `defaultSiteData` object:

```ts
doctor: {
  name: BRAND.doctorName,
  // Keep the existing title, credentials, copy, photoUrl, and qualifications.
},
// Set every existing non-empty hospital phone to BRAND.phoneDisplay.
contact: {
  phone: BRAND.phoneDisplay,
  email: BRAND.email,
  // Keep the existing address and appointmentNote.
},
// Set the WhatsApp social URL to BRAND.whatsappUrl.
```

Build and migrate the merged object in `merge`:

```ts
const merged: SiteData = {
  doctor: { ...defaultSiteData.doctor, ...(s.doctor ?? {}) },
  highlights: s.highlights ?? defaultSiteData.highlights,
  services: s.services ?? defaultSiteData.services,
  hospitals: s.hospitals ?? defaultSiteData.hospitals,
  contact: { ...defaultSiteData.contact, ...(s.contact ?? {}) },
  socials: s.socials ?? defaultSiteData.socials,
};
return migrateLegacyBranding(merged);
```

In `src/routes/contact.tsx`, `src/routes/hospitals.tsx`, and `src/components/site/Footer.tsx`, add:

```ts
import { toTelHref } from "@/lib/contact-links";
```

Replace each existing telephone href with the corresponding helper call:

```tsx
href={toTelHref(data.contact.phone)}
href={toTelHref(h.phone)}
```

- [ ] **Step 4: Run focused tests and type-aware checks**

Run: `npm test && npx tsc --noEmit`

Expected: all three tests PASS and TypeScript exits 0.

- [ ] **Step 5: Commit the data and contact corrections**

```bash
git add package.json tests/branding.test.ts src/lib/branding.ts src/lib/contact-links.ts src/lib/site-data.ts src/routes/contact.tsx src/routes/hospitals.tsx src/components/site/Footer.tsx
git commit -m "feat: update doctor identity and contacts"
```

### Task 2: Portrait asset and homepage profile

**Files:**
- Create: `src/assets/dr-umair-arshad.png`
- Create: `public/dr-umair-arshad.png`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Copy the supplied portrait without modifying it**

Run:

```bash
cp /Users/zeshanashraf/Downloads/09A192E3-14F1-4C9B-AA35-C88AE56705EF.PNG src/assets/dr-umair-arshad.png
cp /Users/zeshanashraf/Downloads/09A192E3-14F1-4C9B-AA35-C88AE56705EF.PNG public/dr-umair-arshad.png
```

- [ ] **Step 2: Verify both copies are byte-identical to the source**

Run: `shasum -a 256 /Users/zeshanashraf/Downloads/09A192E3-14F1-4C9B-AA35-C88AE56705EF.PNG src/assets/dr-umair-arshad.png public/dr-umair-arshad.png`

Expected: all three SHA-256 values are identical.

- [ ] **Step 3: Replace the homepage fallback portrait and SEO copy**

In `src/routes/index.tsx`, replace the legacy `pediatric-hero.jpg` import with:

```ts
import heroImage from "@/assets/dr-umair-arshad.png";
```

Preserve `src={data.doctor.photoUrl || heroImage}` so the admin override continues to work. SEO constants are added in Task 3 after their failing test.

- [ ] **Step 4: Run the production compiler**

Run: `npx tsc --noEmit`

Expected: PASS with no missing image-module or import errors.

- [ ] **Step 5: Commit the portrait update**

```bash
git add src/assets/dr-umair-arshad.png public/dr-umair-arshad.png src/routes/index.tsx
git commit -m "feat: use Dr Umair Arshad portrait"
```

### Task 3: GitHub Pages sharing metadata and UA favicon

**Files:**
- Modify: `tests/branding.test.ts`
- Create: `src/lib/seo.ts`
- Create: `public/favicon.svg`
- Replace: `public/favicon.ico`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Add failing tests for absolute SEO URLs**

Append to `tests/branding.test.ts`:

```ts
import { SEO } from "../src/lib/seo.ts";

test("uses absolute GitHub Pages URLs for social crawlers", () => {
  assert.equal(SEO.siteUrl, "https://zeshanashraf829.github.io/zeshanashraf829/");
  assert.equal(
    SEO.imageUrl,
    "https://zeshanashraf829.github.io/zeshanashraf829/dr-umair-arshad.png",
  );
  assert.match(SEO.title, /Dr\. Umair Arshad/);
});
```

- [ ] **Step 2: Run the test and confirm the SEO module is missing**

Run: `npm test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/lib/seo.ts`.

- [ ] **Step 3: Implement stable SEO constants**

Create `src/lib/seo.ts`:

```ts
export const SEO = {
  siteUrl: "https://zeshanashraf829.github.io/zeshanashraf829/",
  imageUrl:
    "https://zeshanashraf829.github.io/zeshanashraf829/dr-umair-arshad.png",
  imageAlt: "Dr. Umair Arshad, Consultant Pediatrician / Child Specialist",
  title: "Dr. Umair Arshad | Consultant Pediatrician / Child Specialist",
  description:
    "Gentle, expert pediatric care from newborn to adolescent with Dr. Umair Arshad.",
} as const;
```

Use these constants in `src/routes/index.tsx`. Add canonical, Open Graph, and Twitter fields:

```ts
meta: [
  { title: SEO.title },
  { name: "description", content: SEO.description },
  { property: "og:type", content: "website" },
  { property: "og:url", content: SEO.siteUrl },
  { property: "og:title", content: SEO.title },
  { property: "og:description", content: SEO.description },
  { property: "og:image", content: SEO.imageUrl },
  { property: "og:image:alt", content: SEO.imageAlt },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: SEO.title },
  { name: "twitter:description", content: SEO.description },
  { name: "twitter:image", content: SEO.imageUrl },
],
links: [{ rel: "canonical", href: SEO.siteUrl }],
```

In `src/routes/__root.tsx`, use the same doctor-specific defaults and image metadata so secondary routes inherit a portrait share image.

- [ ] **Step 4: Create the UA SVG and ICO fallback**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1597a6"/>
  <circle cx="49" cy="15" r="8" fill="#f2b45f"/>
  <text x="32" y="41" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" font-weight="700" text-anchor="middle">UA</text>
</svg>
```

Generate the ICO fallback from the SVG:

```bash
magick public/favicon.svg -background none -define icon:auto-resize=16,32,48,64,128,256 public/favicon.ico
```

Update the root favicon links to prefer SVG while retaining ICO:

```ts
{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
{ rel: "alternate icon", href: "/favicon.ico", type: "image/x-icon" },
```

- [ ] **Step 5: Run tests and validate the assets**

Run: `npm test && file public/favicon.svg public/favicon.ico public/dr-umair-arshad.png && identify public/favicon.ico public/dr-umair-arshad.png`

Expected: tests PASS; `file` reports SVG, Windows icon, and PNG; `identify` reports ICO sizes and a `1086x1448` portrait.

- [ ] **Step 6: Commit the social metadata and favicon**

```bash
git add tests/branding.test.ts src/lib/seo.ts src/routes/index.tsx src/routes/__root.tsx public/favicon.svg public/favicon.ico
git commit -m "feat: add doctor social preview branding"
```

### Task 4: Remove public Lovable branding and telemetry

**Files:**
- Modify: `src/routes/__root.tsx`
- Delete: `src/lib/lovable-error-reporting.ts`
- Modify: `README.md`

- [ ] **Step 1: Remove the Lovable telemetry call**

In `src/routes/__root.tsx`, delete these exact lines:

```ts
import { useEffect, type ReactNode } from "react";
import { reportLovableError } from "../lib/lovable-error-reporting";
```

Replace the React import with:

```ts
import type { ReactNode } from "react";
```

Delete this effect from `ErrorComponent`:

```ts
useEffect(() => {
  reportLovableError(error, { boundary: "tanstack_root_error_component" });
}, [error]);
```

- [ ] **Step 2: Delete the now-unused telemetry module**

Delete `src/lib/lovable-error-reporting.ts` with `apply_patch`:

```text
*** Begin Patch
*** Delete File: src/lib/lovable-error-reporting.ts
*** End Patch
```

Expected: only the specifically named telemetry file is removed.

- [ ] **Step 3: Replace the README marketing copy**

Replace `README.md` with:

````markdown
# Dr. Umair Arshad — Pediatric Clinic Website

A multi-page website for Dr. Umair Arshad, Consultant Pediatrician / Child Specialist. It includes home, about, services, hospitals, contact, and browser-local admin routes.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

## Checks

```sh
npm test
npm run lint
npm run build
```

The admin route stores content changes in the current browser's local storage. Export a JSON backup before clearing browser data or moving content to another device.
````

- [ ] **Step 4: Scan for forbidden public branding**

Run:

```bash
rg -n -i "Dr\. Ayesha Khan|drayeshakhan|lovable" src public README.md docs/superpowers/specs/2026-08-17-doctor-branding-design.md
```

Expected: legacy strings appear only inside `src/lib/branding.ts` as deliberate migration keys and the approved design record; `lovable` appears only in the design's explicit retained-dependency explanation. No runtime component, metadata, favicon, or README contains public Lovable branding.

- [ ] **Step 5: Run lint and tests**

Run: `npm test && npm run lint`

Expected: PASS with no errors.

- [ ] **Step 6: Commit the debranding cleanup**

```bash
git add README.md src/routes/__root.tsx src/lib/lovable-error-reporting.ts
git commit -m "chore: remove public Lovable branding"
```

### Task 5: Production and visual verification

**Files:**
- Verify only; modify the smallest responsible file if a check exposes a defect.

- [ ] **Step 1: Run the complete automated verification suite**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`

Expected: every command exits 0.

- [ ] **Step 2: Inspect built output for crawler metadata**

Run:

```bash
rg -n "Dr\. Umair Arshad|og:image|twitter:image|zeshanashraf829\.github\.io/zeshanashraf829/dr-umair-arshad\.png" .output dist 2>/dev/null
```

Expected: built HTML or server assets contain the doctor name and absolute social image URL.

- [ ] **Step 3: Start the site and inspect the homepage**

Run: `npm run dev`

Open the reported local URL and verify:

- The header and footer display `Dr. Umair Arshad`.
- The supplied portrait appears in the homepage hero without distortion.
- The document title is doctor-specific.
- The favicon shows `UA` after a hard refresh.
- Contact and hospital telephone links resolve to `tel:+923043755293`.
- The WhatsApp link resolves to `https://wa.me/923043755293`.

- [ ] **Step 4: Verify the final diff and allowed retained references**

Run: `git diff --check && git status --short && rg -n -i "lovable" . -g '!node_modules' -g '!bun.lock' -g '!.git/**'`

Expected: no whitespace errors; status contains only intentional plan/checklist updates if any; Lovable references remain only in `AGENTS.md`, `vite.config.ts`, `package.json`, `bunfig.toml`, `.lovable/project.json`, and the approved specification/plan explanations.

- [ ] **Step 5: Record verification completion**

If implementation leaves plan checkbox updates uncommitted, commit them separately:

```bash
git add docs/superpowers/plans/2026-08-17-doctor-branding.md
git commit -m "docs: record branding implementation plan"
```
