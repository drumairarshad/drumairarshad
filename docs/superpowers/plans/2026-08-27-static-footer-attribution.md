# Static Footer Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a permanent, non-editable `Developed by Musfora Software Developers` link beneath the site-wide copyright line.

**Architecture:** Keep the attribution as static JSX in the shared `Footer` component so it appears on every route without entering the browser-local content model. Lock the text, URL, new-tab behavior, and non-editability with source and prerendered-output tests.

**Tech Stack:** React 19, TypeScript, TanStack Start static prerendering, Node test runner, Tailwind CSS.

---

## File structure

- Create `tests/footer-attribution.test.ts`: verifies the permanent footer markup and proves it is absent from editable site/admin data.
- Modify `tests/github-pages-build.test.mjs`: verifies crawler-visible static HTML includes the attribution.
- Modify `src/components/site/Footer.tsx`: renders the attribution beneath the copyright line.

### Task 1: Add and verify the permanent footer attribution

**Files:**
- Create: `tests/footer-attribution.test.ts`
- Modify: `tests/github-pages-build.test.mjs`
- Modify: `src/components/site/Footer.tsx`

- [ ] **Step 1: Add failing source and prerender contracts**

Create `tests/footer-attribution.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders a permanent Musfora attribution outside editable site data", async () => {
  const [footer, siteData, admin] = await Promise.all([
    readFile(new URL("../src/components/site/Footer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/site-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(footer, /Developed by/);
  assert.match(footer, />\s*Musfora Software Developers\s*</);
  assert.match(footer, /href="https:\/\/musfora\.com\/"/);
  assert.match(footer, /target="_blank"/);
  assert.match(footer, /rel="noreferrer noopener"/);
  assert.doesNotMatch(siteData, /Musfora Software Developers/);
  assert.doesNotMatch(admin, /Musfora Software Developers/);
});
```

Append to `tests/github-pages-build.test.mjs`:

```js
test("renders the permanent developer attribution", async () => {
  const html = await readFile(new URL("index.html", outputDir), "utf8");

  assert.match(html, /Developed by/);
  assert.match(html, />Musfora Software Developers<\/a>/);
  assert.match(html, /href="https:\/\/musfora\.com\/"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer noopener"/);
});
```

- [ ] **Step 2: Run the new tests and verify the red state**

Run:

```bash
npm test
npm run test:pages
```

Expected: `npm test` fails because `Footer.tsx` lacks the Musfora attribution; `npm run test:pages` fails because the current prerendered homepage lacks it.

- [ ] **Step 3: Add the static footer markup**

Replace the bottom copyright block in `src/components/site/Footer.tsx` with:

```tsx
<div className="space-y-1 border-t border-border py-5 text-center text-xs text-muted-foreground">
  <p>© {new Date().getFullYear()} {data.doctor.name}. All rights reserved.</p>
  <p>
    Developed by{" "}
    <a
      href="https://musfora.com/"
      target="_blank"
      rel="noreferrer noopener"
      className="font-semibold text-foreground transition-colors hover:text-primary"
    >
      Musfora Software Developers
    </a>
  </p>
</div>
```

Do not add the text or URL to `src/lib/site-data.ts` or `src/routes/admin.tsx`.

- [ ] **Step 4: Build and verify the green state**

Run:

```bash
npm test
VITE_BASE_PATH=/zeshanashraf829/ npm run build
npm run test:pages
npx tsc --noEmit
npm run lint
git diff --check
```

Expected: unit and prerender tests pass, the build and TypeScript exit zero, diff check is clean, and lint reports zero errors with only the repository’s seven existing Fast Refresh warnings.

- [ ] **Step 5: Inspect the rendered footer**

Run:

```bash
VITE_BASE_PATH=/zeshanashraf829/ npm run preview -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/zeshanashraf829/`, scroll to the footer, and confirm the attribution appears beneath the copyright line without wrapping awkwardly at desktop or mobile width. Confirm the link has `target="_blank"` and the browser console has no errors.

- [ ] **Step 6: Commit the implementation**

```bash
git add src/components/site/Footer.tsx tests/footer-attribution.test.ts tests/github-pages-build.test.mjs
git commit -m "feat: add permanent Musfora footer attribution"
```

- [ ] **Step 7: Push without rewriting history**

```bash
git push origin main
git status --short --branch
```

Expected: local `main` and `origin/main` point to the same commit, and the worktree is clean.
