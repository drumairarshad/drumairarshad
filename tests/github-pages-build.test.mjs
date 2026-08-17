import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputDir = new URL("../dist/client/", import.meta.url);
const requiredPages = [
  "index.html",
  "about/index.html",
  "services/index.html",
  "hospitals/index.html",
  "contact/index.html",
  "admin/index.html",
];

test("emits static HTML for every public route", async () => {
  for (const page of requiredPages) {
    await assert.doesNotReject(access(new URL(page, outputDir)), `${page} is missing`);
  }
});

test("uses the GitHub Pages project base path", async () => {
  const html = await readFile(new URL("index.html", outputDir), "utf8");

  assert.match(html, /\/zeshanashraf829\/assets\//);
  assert.match(html, /href="\/zeshanashraf829\/about"/);
  assert.match(
    html,
    /https:\/\/zeshanashraf829\.github\.io\/zeshanashraf829\/dr-umair-arshad\.png/,
  );
});
