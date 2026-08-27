import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("admin exposes statistic visibility and hospital visit type controls", async () => {
  const source = await readFile(new URL("../src/routes/admin.tsx", import.meta.url), "utf8");

  assert.match(source, /import \{ Switch \}/);
  assert.match(source, /checked=\{h\.visible\}/);
  assert.match(source, /visible: checked/);
  assert.match(source, /visitType/);
  assert.match(source, /Government availability/);
  assert.match(source, /Private consultation/);
});
