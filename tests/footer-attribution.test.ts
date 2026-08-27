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
