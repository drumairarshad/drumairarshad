import assert from "node:assert/strict";
import test from "node:test";

import { BRAND, migrateLegacyBranding } from "../src/lib/branding.ts";
import { toTelHref } from "../src/lib/contact-links.ts";
import { SEO } from "../src/lib/seo.ts";

const legacyData = () => ({
  doctor: { name: "Dr. Ayesha Khan" },
  contact: {
    email: "appointments@drayeshakhan.com",
    phone: "+92 300 1234567",
  },
  hospitals: [{ phone: "+92 300 1234567" }, { phone: "+92 300 7654321" }, { phone: "" }],
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
  custom.hospitals[1]!.phone = "+92 344 0000000";
  custom.socials[1]!.url = "https://wa.me/923330000000";

  assert.deepEqual(migrateLegacyBranding(custom), custom);
});

test("normalizes display numbers in telephone links", () => {
  assert.equal(toTelHref(BRAND.phoneDisplay), "tel:+923043755293");
});

test("uses absolute GitHub Pages URLs for social crawlers", () => {
  assert.equal(SEO.siteUrl, "https://zeshanashraf829.github.io/zeshanashraf829/");
  assert.equal(
    SEO.imageUrl,
    "https://zeshanashraf829.github.io/zeshanashraf829/social-preview-home.jpg",
  );
  assert.equal(SEO.imageType, "image/jpeg");
  assert.equal(SEO.imageWidth, "1200");
  assert.equal(SEO.imageHeight, "630");
  assert.match(SEO.title, /Dr\. Umair Arshad/);
});
