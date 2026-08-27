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
    /https:\/\/zeshanashraf829\.github\.io\/zeshanashraf829\/social-preview-home\.jpg/,
  );
  assert.match(html, /property="og:image:secure_url"/);
  assert.match(html, /property="og:image:type" content="image\/jpeg"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /Dr\. Umair Arshad \| MBBS, MS Pediatric Surgery/);
  assert.match(html, /Consultant Pediatric Surgeon in Lahore with over 10 years/);
  assert.doesNotMatch(html, /Consultant Pediatrician \/ Child Specialist/);
});

test("renders the pediatric surgeon profile and schedules", async () => {
  const home = await readFile(new URL("index.html", outputDir), "utf8");
  const about = await readFile(new URL("about/index.html", outputDir), "utf8");
  const services = await readFile(new URL("services/index.html", outputDir), "utf8");
  const hospitals = await readFile(new URL("hospitals/index.html", outputDir), "utf8");
  const contact = await readFile(new URL("contact/index.html", outputDir), "utf8");

  assert.match(home, /Specialized surgical care for newborns, children, and adolescents/);
  assert.match(home, /Years in pediatric surgery/);
  assert.doesNotMatch(home, />Children treated</);
  assert.match(about, /Consultant Pediatric Surgeon/);
  assert.match(services, /Painless Circumcision/);
  assert.match(services, /Neonatal Surgery/);
  assert.match(hospitals, /Mayo Hospital Lahore/);
  assert.match(hospitals, /Government hospital availability/);
  assert.match(hospitals, /IQRAA Medical Complex \(Extension\)/);
  assert.match(contact, /Private consultation/);
  assert.doesNotMatch(contact, /Main clinic address/);
});

test("renders the permanent developer attribution", async () => {
  const html = await readFile(new URL("index.html", outputDir), "utf8");

  assert.match(html, /Developed by/);
  assert.match(html, />Musfora Software Developers<\/a>/);
  assert.match(html, /href="https:\/\/musfora\.com\/"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer noopener"/);
});
