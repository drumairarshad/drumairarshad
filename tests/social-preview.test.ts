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
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
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
  const source = await readFile(
    new URL("../assets/social-preview-home.svg", import.meta.url),
    "utf8",
  );

  assert.match(source, /CONSULTANT PEDIATRIC SURGEON/);
  assert.match(source, /Dr\. Umair Arshad/);
  assert.match(source, /MBBS \(UHS\) · MS Pediatric Surgery/);
  assert.match(source, /10\+ years of pediatric surgery experience/);
  assert.match(source, /Mayo Hospital Lahore/);
  assert.doesNotMatch(source, /FCPS/);
  assert.doesNotMatch(source, /Child Specialist/);
});

test("uses SVG features that render reliably in the production exporter", async () => {
  const source = await readFile(
    new URL("../assets/social-preview-home.svg", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /linearGradient/);
  assert.doesNotMatch(source, /letter-spacing/);
  assert.doesNotMatch(source, /<tspan/);
});
