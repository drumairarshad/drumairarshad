# Pediatric Surgeon Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website’s obsolete general-pediatrician defaults with Dr. Umair Arshad’s approved pediatric-surgeon profile, services, schedules, admin visibility controls, and social-sharing metadata.

**Architecture:** Keep `src/lib/site-data.ts` as the single browser-local content model, extend highlights with `visible` and hospitals with `visitType`, and add a narrow exact-value migration for saved legacy defaults. Public routes consume those normalized fields, while crawler-facing metadata stays centralized in `src/lib/seo.ts` and the deterministic SVG/JPEG social banner remains separate from the homepage portrait.

**Tech Stack:** React 19, TypeScript, TanStack Router/Start, Tailwind CSS, Radix Switch, Node test runner, SVG, ImageMagick, Vite static prerender.

---

## File structure

- Create `tests/site-data.test.ts`: verifies new defaults, visibility filtering, visit types, and exact-value migration.
- Create `tests/admin-contract.test.ts`: verifies admin source wiring for statistic visibility and hospital visit types without adding a browser-test dependency.
- Modify `src/lib/site-data.ts`: owns the new profile defaults, types, pure visibility helper, and saved-data migration.
- Modify `src/routes/admin.tsx`: adds statistic show/hide switches and hospital visit-type controls.
- Modify `src/routes/index.tsx`: uses the surgical profile, visible statistics, surgical services, and availability-aware location copy.
- Modify `src/routes/about.tsx`: uses the surgical biography/qualifications and visible statistics.
- Modify `src/routes/services.tsx`: presents all nine pediatric surgical services.
- Modify `src/routes/hospitals.tsx`: distinguishes government availability from private consultations.
- Modify `src/routes/contact.tsx`: removes the false main-clinic address and labels each hospital schedule by visit type.
- Modify `src/components/site/Footer.tsx`: presents the new professional title and no placeholder address.
- Modify `src/lib/seo.ts`: centralizes the approved pediatric-surgery SEO identity.
- Modify `assets/social-preview-home.svg`: updates the deterministic share-banner copy.
- Modify `public/social-preview-home.jpg`: stores the regenerated `1200 × 630` crawler image.
- Modify `tests/branding.test.ts`: locks the approved SEO title, description, and image alternative text.
- Modify `tests/social-preview.test.ts`: locks the new banner copy and obsolete-copy removal.
- Modify `tests/github-pages-build.test.mjs`: verifies new public content and crawler metadata in prerendered HTML.
- Modify `README.md`: replaces the obsolete Consultant Pediatrician / Child Specialist description.

### Task 1: Normalize the profile data model and saved-data migration

**Files:**
- Create: `tests/site-data.test.ts`
- Modify: `src/lib/site-data.ts`

- [ ] **Step 1: Write failing tests for the approved defaults**

Create `tests/site-data.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultSiteData,
  getVisibleHighlights,
  migrateLegacyProfile,
  type SiteData,
} from "../src/lib/site-data.ts";

test("uses the approved pediatric surgeon defaults", () => {
  assert.equal(defaultSiteData.doctor.title, "Consultant Pediatric Surgeon");
  assert.equal(defaultSiteData.doctor.credentials, "MBBS (UHS) · MS Pediatric Surgery");
  assert.equal(
    defaultSiteData.doctor.tagline,
    "Specialized surgical care for newborns, children, and adolescents",
  );
  assert.equal(
    defaultSiteData.doctor.heroSubtitle,
    "Over 10 years of experience in pediatric surgery and 16 years in the medical field. Currently serving as Consultant Pediatric Surgeon at Mayo Hospital Lahore.",
  );
  assert.equal(
    defaultSiteData.doctor.about,
    "Dr. Umair Arshad is a Consultant Pediatric Surgeon with over 10 years of experience in pediatric surgery and 16 years in the medical field. He currently works as a Consultant Pediatric Surgeon at Mayo Hospital Lahore, providing surgical care for newborns, children, and adolescents.",
  );
  assert.deepEqual(defaultSiteData.doctor.qualifications, [
    "MBBS (UHS)",
    "MS Pediatric Surgery — Children’s Hospital Lahore",
  ]);
  assert.deepEqual(
    defaultSiteData.services.map(({ title }) => title),
    [
      "Painless Circumcision",
      "Inguinal Hernia",
      "Undescended Testis",
      "Tongue-Tie",
      "Acute Appendicitis",
      "Rectal Polyp",
      "Laparoscopic Surgery",
      "Emergency Pediatric Surgical Care",
      "Neonatal Surgery",
    ],
  );
  assert.deepEqual(
    defaultSiteData.hospitals.map(({ name, visitType, timings }) => ({
      name,
      visitType,
      timings,
    })),
    [
      {
        name: "Mayo Hospital Lahore",
        visitType: "availability",
        timings: "Monday–Saturday, 8:00 AM–2:00 PM",
      },
      {
        name: "Ch. Rahmat Ali Trust Hospital",
        visitType: "consultation",
        timings: "Saturday, Tuesday & Thursday, 4:00–6:00 PM",
      },
      {
        name: "IQRAA Medical Complex (Extension)",
        visitType: "consultation",
        timings: "Daily, 6:00–8:00 PM",
      },
    ],
  );
});

test("hides children treated while retaining its editable value", () => {
  const treated = defaultSiteData.highlights.find(({ label }) => label === "Children treated");

  assert.deepEqual(treated, {
    id: "h2",
    label: "Children treated",
    value: "1000+",
    visible: false,
  });
  assert.deepEqual(
    getVisibleHighlights(defaultSiteData.highlights).map(({ value }) => value),
    ["16", "10+", "2"],
  );
});

test("migrates exact old defaults to the pediatric surgeon profile", () => {
  const legacy = structuredClone(defaultSiteData) as SiteData;
  legacy.doctor.title = "Consultant Pediatrician / Child Specialist";
  legacy.doctor.credentials = "MBBS, FCPS (Paediatrics)";
  legacy.doctor.tagline = "Gentle, expert care for every stage of childhood";
  legacy.doctor.heroSubtitle =
    "Newborn to adolescent care across leading hospitals in the city — with parents guided at every step.";
  legacy.doctor.about =
    "With over 12 years of clinical experience, I care for children from their very first breath through their teenage years. My practice focuses on preventive care, growth and development, childhood infections, allergies and nutrition — always explained in plain language so parents feel confident about the next step.";
  legacy.doctor.qualifications = [
    "MBBS — King Edward Medical University",
    "FCPS (Paediatrics) — College of Physicians & Surgeons",
    "Certified in Neonatal Resuscitation (NRP)",
    "Member, Pakistan Pediatric Association",
  ];
  legacy.highlights = [
    { id: "h1", label: "Years of experience", value: "12+" } as unknown as SiteData["highlights"][number],
    { id: "h2", label: "Children treated", value: "20,000+" } as unknown as SiteData["highlights"][number],
    { id: "h3", label: "Hospitals", value: "3" } as unknown as SiteData["highlights"][number],
  ];
  legacy.services = [
    {
      id: "s1",
      title: "Newborn & Neonatal Care",
      description:
        "First check-ups, jaundice management, feeding support and growth monitoring for your newborn.",
      link: "",
    },
    {
      id: "s2",
      title: "Vaccination & Immunization",
      description:
        "Complete EPI schedule plus optional vaccines, with reminders and a personal immunization card.",
      link: "",
    },
    {
      id: "s3",
      title: "Growth & Development",
      description:
        "Height, weight and milestone tracking with early detection of developmental delays.",
      link: "",
    },
    {
      id: "s4",
      title: "Childhood Infections",
      description:
        "Diagnosis and treatment of fever, chest infections, diarrhoea and other common illnesses.",
      link: "",
    },
    {
      id: "s5",
      title: "Allergy & Asthma Care",
      description:
        "Long-term plans for asthma, eczema and food allergies so children can play freely again.",
      link: "",
    },
    {
      id: "s6",
      title: "Nutrition Counselling",
      description:
        "Personalised diet plans for picky eaters, underweight children and adolescent nutrition.",
      link: "",
    },
  ];
  legacy.hospitals = [
    {
      id: "c1",
      name: "City Children's Hospital",
      address: "Block B, Main Boulevard, Gulberg III, Lahore",
      timings: "Mon – Fri, 9:00 AM – 1:00 PM",
      phone: "+92 304 3755293",
      mapLink: "",
    },
    {
      id: "c2",
      name: "Al-Shifa Medical Complex",
      address: "12-A, Model Town Link Road, Lahore",
      timings: "Mon, Wed, Fri, 4:00 PM – 7:00 PM",
      phone: "+92 304 3755293",
      mapLink: "",
    },
    {
      id: "c3",
      name: "Care Family Clinic",
      address: "Sector C, Bahria Town, Lahore",
      timings: "Tue & Thu, 5:00 PM – 8:00 PM",
      phone: "",
      mapLink: "",
    },
  ] as unknown as SiteData["hospitals"];
  legacy.contact.address = "Block B, Main Boulevard, Gulberg III, Lahore";
  legacy.contact.appointmentNote =
    "Appointments can be booked by phone or WhatsApp between 9:00 AM and 8:00 PM. Emergencies are seen on a walk-in basis.";

  const migrated = migrateLegacyProfile(legacy);

  assert.equal(migrated.doctor.title, "Consultant Pediatric Surgeon");
  assert.equal(migrated.doctor.credentials, "MBBS (UHS) · MS Pediatric Surgery");
  assert.deepEqual(migrated.doctor.qualifications, defaultSiteData.doctor.qualifications);
  assert.deepEqual(migrated.highlights, defaultSiteData.highlights);
  assert.deepEqual(migrated.services, defaultSiteData.services);
  assert.deepEqual(migrated.hospitals, defaultSiteData.hospitals);
  assert.deepEqual(migrated.contact, defaultSiteData.contact);
});

test("preserves administrator-customized values during profile migration", () => {
  const custom = structuredClone(defaultSiteData);
  custom.doctor.tagline = "Custom surgical headline";
  custom.highlights.find(({ id }) => id === "h2")!.value = "1,237";
  custom.services[0]!.description = "Custom circumcision description";
  custom.hospitals[0]!.timings = "Custom Mayo schedule";

  const migrated = migrateLegacyProfile(custom);

  assert.equal(migrated.doctor.tagline, "Custom surgical headline");
  assert.equal(migrated.highlights.find(({ id }) => id === "h2")!.value, "1,237");
  assert.equal(migrated.highlights.find(({ id }) => id === "h2")!.visible, false);
  assert.equal(migrated.services[0]!.description, "Custom circumcision description");
  assert.equal(migrated.hospitals[0]!.timings, "Custom Mayo schedule");
});
```

- [ ] **Step 2: Run the profile-data tests to verify they fail**

Run:

```bash
node --experimental-strip-types --test tests/site-data.test.ts
```

Expected: FAIL because `visible`, `visitType`, `getVisibleHighlights`, and `migrateLegacyProfile` do not exist and the defaults still describe a general pediatrician.

- [ ] **Step 3: Extend the shared types and helpers**

In `src/lib/site-data.ts`, use these public types and helper:

```ts
export type VisitType = "availability" | "consultation";

export type Hospital = {
  id: string;
  name: string;
  address: string;
  timings: string;
  visitType: VisitType;
  phone?: string;
  mapLink?: string;
};

export type Highlight = {
  id: string;
  label: string;
  value: string;
  visible: boolean;
};

export function getVisibleHighlights(highlights: Highlight[]) {
  return highlights.filter(({ visible }) => visible);
}
```

- [ ] **Step 4: Replace the default doctor, statistics, services, hospitals, and contact note**

Use this exact doctor object and these default arrays in `src/lib/site-data.ts`:

```ts
doctor: {
  name: BRAND.doctorName,
  title: "Consultant Pediatric Surgeon",
  credentials: "MBBS (UHS) · MS Pediatric Surgery",
  tagline: "Specialized surgical care for newborns, children, and adolescents",
  heroSubtitle:
    "Over 10 years of experience in pediatric surgery and 16 years in the medical field. Currently serving as Consultant Pediatric Surgeon at Mayo Hospital Lahore.",
  photoUrl: "",
  about:
    "Dr. Umair Arshad is a Consultant Pediatric Surgeon with over 10 years of experience in pediatric surgery and 16 years in the medical field. He currently works as a Consultant Pediatric Surgeon at Mayo Hospital Lahore, providing surgical care for newborns, children, and adolescents.",
  qualifications: [
    "MBBS (UHS)",
    "MS Pediatric Surgery — Children’s Hospital Lahore",
  ],
},
highlights: [
  { id: "h1", label: "Years in the medical field", value: "16", visible: true },
  { id: "h4", label: "Years in pediatric surgery", value: "10+", visible: true },
  { id: "h2", label: "Children treated", value: "1000+", visible: false },
  { id: "h3", label: "Private consultation locations", value: "2", visible: true },
],
services: [
  {
    id: "s1",
    title: "Painless Circumcision",
    description:
      "Comfort-focused circumcision care with age-appropriate pain management and postoperative guidance.",
    link: "",
  },
  {
    id: "s2",
    title: "Inguinal Hernia",
    description:
      "Assessment and surgical treatment of inguinal hernias and groin swelling in children.",
    link: "",
  },
  {
    id: "s3",
    title: "Undescended Testis",
    description:
      "Evaluation and surgical correction of an undescended testis with age-appropriate planning.",
    link: "",
  },
  {
    id: "s4",
    title: "Tongue-Tie",
    description:
      "Assessment and surgical release when tongue-tie affects feeding or oral function.",
    link: "",
  },
  {
    id: "s5",
    title: "Acute Appendicitis",
    description:
      "Urgent evaluation and surgical management of suspected appendicitis in children.",
    link: "",
  },
  {
    id: "s6",
    title: "Rectal Polyp",
    description: "Evaluation and removal of rectal polyps causing bleeding or discomfort.",
    link: "",
  },
  {
    id: "s7",
    title: "Laparoscopic Surgery",
    description: "Minimally invasive pediatric surgery when clinically appropriate.",
    link: "",
  },
  {
    id: "s8",
    title: "Emergency Pediatric Surgical Care",
    description: "Assessment and management of urgent pediatric surgical conditions.",
    link: "",
  },
  {
    id: "s9",
    title: "Neonatal Surgery",
    description: "Specialized surgical evaluation and care for newborn conditions.",
    link: "",
  },
],
hospitals: [
  {
    id: "c1",
    name: "Mayo Hospital Lahore",
    address: "Hospital Road, Anarkali Bazaar, Lahore, Punjab 54000",
    timings: "Monday–Saturday, 8:00 AM–2:00 PM",
    visitType: "availability",
    phone: "",
    mapLink: "",
  },
  {
    id: "c2",
    name: "Ch. Rahmat Ali Trust Hospital",
    address: "45 Civic Centre, Dr. Wasti Chowk, Ch. Rahmat Ali Road, Township, Lahore",
    timings: "Saturday, Tuesday & Thursday, 4:00–6:00 PM",
    visitType: "consultation",
    phone: BRAND.phoneDisplay,
    mapLink: "",
  },
  {
    id: "c3",
    name: "IQRAA Medical Complex (Extension)",
    address: "24–26 A, Maulana Shaukat Ali Road, Johar Town, Lahore",
    timings: "Daily, 6:00–8:00 PM",
    visitType: "consultation",
    phone: BRAND.phoneDisplay,
    mapLink: "",
  },
],
```

Set `contact.address` to an empty string and set `contact.appointmentNote` to:

```text
Private consultations at Ch. Rahmat Ali Trust Hospital and IQRAA Medical Complex can be arranged by phone or WhatsApp. Mayo Hospital is listed as government hospital availability and is not booked through this website.
```

- [ ] **Step 5: Add an exact-field migration and normalize saved arrays**

Add these exact legacy constants and migration helpers to `src/lib/site-data.ts`:

```ts
const LEGACY_PROFILE = {
  doctor: {
    title: "Consultant Pediatrician / Child Specialist",
    credentials: "MBBS, FCPS (Paediatrics)",
    tagline: "Gentle, expert care for every stage of childhood",
    heroSubtitle:
      "Newborn to adolescent care across leading hospitals in the city — with parents guided at every step.",
    about:
      "With over 12 years of clinical experience, I care for children from their very first breath through their teenage years. My practice focuses on preventive care, growth and development, childhood infections, allergies and nutrition — always explained in plain language so parents feel confident about the next step.",
    qualifications: [
      "MBBS — King Edward Medical University",
      "FCPS (Paediatrics) — College of Physicians & Surgeons",
      "Certified in Neonatal Resuscitation (NRP)",
      "Member, Pakistan Pediatric Association",
    ],
  },
  highlights: [
    { id: "h1", label: "Years of experience", value: "12+" },
    { id: "h2", label: "Children treated", value: "20,000+" },
    { id: "h3", label: "Hospitals", value: "3" },
  ],
  services: [
    {
      id: "s1",
      title: "Newborn & Neonatal Care",
      description:
        "First check-ups, jaundice management, feeding support and growth monitoring for your newborn.",
      link: "",
    },
    {
      id: "s2",
      title: "Vaccination & Immunization",
      description:
        "Complete EPI schedule plus optional vaccines, with reminders and a personal immunization card.",
      link: "",
    },
    {
      id: "s3",
      title: "Growth & Development",
      description:
        "Height, weight and milestone tracking with early detection of developmental delays.",
      link: "",
    },
    {
      id: "s4",
      title: "Childhood Infections",
      description:
        "Diagnosis and treatment of fever, chest infections, diarrhoea and other common illnesses.",
      link: "",
    },
    {
      id: "s5",
      title: "Allergy & Asthma Care",
      description:
        "Long-term plans for asthma, eczema and food allergies so children can play freely again.",
      link: "",
    },
    {
      id: "s6",
      title: "Nutrition Counselling",
      description:
        "Personalised diet plans for picky eaters, underweight children and adolescent nutrition.",
      link: "",
    },
  ],
  hospitals: [
    {
      id: "c1",
      name: "City Children's Hospital",
      address: "Block B, Main Boulevard, Gulberg III, Lahore",
      timings: "Mon – Fri, 9:00 AM – 1:00 PM",
      phone: BRAND.phoneDisplay,
      mapLink: "",
    },
    {
      id: "c2",
      name: "Al-Shifa Medical Complex",
      address: "12-A, Model Town Link Road, Lahore",
      timings: "Mon, Wed, Fri, 4:00 PM – 7:00 PM",
      phone: BRAND.phoneDisplay,
      mapLink: "",
    },
    {
      id: "c3",
      name: "Care Family Clinic",
      address: "Sector C, Bahria Town, Lahore",
      timings: "Tue & Thu, 5:00 PM – 8:00 PM",
      phone: "",
      mapLink: "",
    },
  ],
  contact: {
    address: "Block B, Main Boulevard, Gulberg III, Lahore",
    appointmentNote:
      "Appointments can be booked by phone or WhatsApp between 9:00 AM and 8:00 PM. Emergencies are seen on a walk-in basis.",
  },
} as const;

const arraysEqual = (left: readonly string[], right: readonly string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const replaceExact = (value: string, legacy: string, replacement: string) =>
  value === legacy ? replacement : value;

function migrateHighlights(highlights: Highlight[]): Highlight[] {
  const legacyById = new Map<string, (typeof LEGACY_PROFILE.highlights)[number]>(
    LEGACY_PROFILE.highlights.map((item) => [item.id, item]),
  );
  const defaultById = new Map<string, Highlight>(
    defaultSiteData.highlights.map((item) => [item.id, item]),
  );
  const hasLegacyShape = highlights.some(
    (item) => typeof (item as Partial<Highlight>).visible !== "boolean",
  );
  const migrated = highlights.map((item) => {
    const legacy = legacyById.get(item.id);
    const replacement = defaultById.get(item.id);

    if (!legacy || !replacement) {
      return { ...item, visible: item.visible ?? true };
    }

    return {
      ...item,
      label: replaceExact(item.label, legacy.label, replacement.label),
      value: replaceExact(item.value, legacy.value, replacement.value),
      visible: item.visible ?? replacement.visible,
    };
  });

  if (!hasLegacyShape) return migrated;

  const migratedById = new Map(migrated.map((item) => [item.id, item]));
  const defaultIds = new Set(defaultSiteData.highlights.map(({ id }) => id));
  return [
    ...defaultSiteData.highlights.map((item) => migratedById.get(item.id) ?? item),
    ...migrated.filter(({ id }) => !defaultIds.has(id)),
  ];
}

function migrateServices(services: Service[]): Service[] {
  const legacyById = new Map<string, (typeof LEGACY_PROFILE.services)[number]>(
    LEGACY_PROFILE.services.map((item) => [item.id, item]),
  );
  const defaultById = new Map<string, Service>(
    defaultSiteData.services.map((item) => [item.id, item]),
  );
  const containsLegacyDefaults = services.some((item) => {
    const legacy = legacyById.get(item.id);
    return legacy && (item.title === legacy.title || item.description === legacy.description);
  });
  const migrated = services.map((item) => {
    const legacy = legacyById.get(item.id);
    const replacement = defaultById.get(item.id);

    if (!legacy || !replacement) return item;

    return {
      ...item,
      title: replaceExact(item.title, legacy.title, replacement.title),
      description: replaceExact(item.description, legacy.description, replacement.description),
    };
  });

  if (!containsLegacyDefaults) return migrated;

  const migratedById = new Map(migrated.map((item) => [item.id, item]));
  const defaultIds = new Set(defaultSiteData.services.map(({ id }) => id));
  return [
    ...defaultSiteData.services.map((item) => migratedById.get(item.id) ?? item),
    ...migrated.filter(({ id }) => !defaultIds.has(id)),
  ];
}

function migrateHospitals(hospitals: Hospital[]): Hospital[] {
  const legacyById = new Map<string, (typeof LEGACY_PROFILE.hospitals)[number]>(
    LEGACY_PROFILE.hospitals.map((item) => [item.id, item]),
  );
  const defaultById = new Map<string, Hospital>(
    defaultSiteData.hospitals.map((item) => [item.id, item]),
  );

  return hospitals.map((item) => {
    const legacy = legacyById.get(item.id);
    const replacement = defaultById.get(item.id);

    if (!legacy || !replacement) {
      return {
        ...item,
        visitType: (item as Partial<Hospital>).visitType ?? "consultation",
      };
    }

    return {
      ...item,
      name: replaceExact(item.name, legacy.name, replacement.name),
      address: replaceExact(item.address, legacy.address, replacement.address),
      timings: replaceExact(item.timings, legacy.timings, replacement.timings),
      phone: replaceExact(item.phone ?? "", legacy.phone, replacement.phone ?? ""),
      mapLink: replaceExact(item.mapLink ?? "", legacy.mapLink, replacement.mapLink ?? ""),
      visitType: (item as Partial<Hospital>).visitType ?? replacement.visitType,
    };
  });
}

export function migrateLegacyProfile(data: SiteData): SiteData {
  return {
    ...data,
    doctor: {
      ...data.doctor,
      title: replaceExact(data.doctor.title, LEGACY_PROFILE.doctor.title, defaultSiteData.doctor.title),
      credentials: replaceExact(
        data.doctor.credentials,
        LEGACY_PROFILE.doctor.credentials,
        defaultSiteData.doctor.credentials,
      ),
      tagline: replaceExact(
        data.doctor.tagline,
        LEGACY_PROFILE.doctor.tagline,
        defaultSiteData.doctor.tagline,
      ),
      heroSubtitle: replaceExact(
        data.doctor.heroSubtitle,
        LEGACY_PROFILE.doctor.heroSubtitle,
        defaultSiteData.doctor.heroSubtitle,
      ),
      about: replaceExact(
        data.doctor.about,
        LEGACY_PROFILE.doctor.about,
        defaultSiteData.doctor.about,
      ),
      qualifications: arraysEqual(
        data.doctor.qualifications,
        LEGACY_PROFILE.doctor.qualifications,
      )
        ? [...defaultSiteData.doctor.qualifications]
        : data.doctor.qualifications,
    },
    highlights: migrateHighlights(data.highlights),
    services: migrateServices(data.services),
    hospitals: migrateHospitals(data.hospitals),
    contact: {
      ...data.contact,
      address: replaceExact(
        data.contact.address,
        LEGACY_PROFILE.contact.address,
        defaultSiteData.contact.address,
      ),
      appointmentNote: replaceExact(
        data.contact.appointmentNote,
        LEGACY_PROFILE.contact.appointmentNote,
        defaultSiteData.contact.appointmentNote,
      ),
    },
  };
}
```

In `merge(saved)`, call migrations in this order:

```ts
return migrateLegacyProfile(migrateLegacyBranding(merged));
```

- [ ] **Step 6: Run the profile-data and existing branding tests**

Run:

```bash
npm test
```

Expected: all tests PASS, including the new defaults, visibility, and migration cases.

- [ ] **Step 7: Commit the normalized profile model**

```bash
git add src/lib/site-data.ts tests/site-data.test.ts
git commit -m "feat: add pediatric surgeon profile data"
```

### Task 2: Wire public pages and admin controls

**Files:**
- Create: `tests/admin-contract.test.ts`
- Modify: `tests/github-pages-build.test.mjs`
- Modify: `src/routes/admin.tsx`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/about.tsx`
- Modify: `src/routes/services.tsx`
- Modify: `src/routes/hospitals.tsx`
- Modify: `src/routes/contact.tsx`
- Modify: `src/components/site/Footer.tsx`

- [ ] **Step 1: Add failing contracts for admin wiring and rendered profile content**

Create `tests/admin-contract.test.ts`:

```ts
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
```

Extend `tests/github-pages-build.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the contracts to verify they fail**

Run:

```bash
npm test
npm run test:pages
```

Expected: FAIL because admin controls and new public content are not wired, and the current prerendered pages still contain the old profile.

- [ ] **Step 3: Add statistic visibility and visit-type controls to the admin**

Import the existing Radix switch:

```ts
import { Switch } from "@/components/ui/switch";
```

Beside each highlight label/value pair, render:

```tsx
<label className="flex items-center gap-2 pb-2 text-xs font-semibold text-muted-foreground">
  <Switch
    checked={h.visible}
    onCheckedChange={(checked) => {
      const next = [...draft.highlights];
      next[i] = { ...h, visible: checked };
      update({ highlights: next });
    }}
  />
  {h.visible ? "Shown publicly" : "Hidden publicly"}
</label>
```

New statistics must use `visible: true`. In each hospital editor, add a labeled native select:

```tsx
<label className="block space-y-1.5">
  <span className={labelCls}>Visit type</span>
  <select
    className={inputCls}
    value={h.visitType}
    onChange={(event) => {
      const next = [...draft.hospitals];
      next[i] = {
        ...h,
        visitType: event.target.value as SiteData["hospitals"][number]["visitType"],
      };
      update({ hospitals: next });
    }}
  >
    <option value="availability">Government availability</option>
    <option value="consultation">Private consultation</option>
  </select>
</label>
```

New hospitals must use `visitType: "consultation"`.

- [ ] **Step 4: Update homepage and About rendering**

Import and use `getVisibleHighlights` in `src/routes/index.tsx` and `src/routes/about.tsx`:

```ts
const visibleHighlights = getVisibleHighlights(data.highlights);
```

In `src/routes/index.tsx`, also derive the private-location count:

```ts
const privateConsultationCount = data.hospitals.filter(
  ({ visitType }) => visitType === "consultation",
).length;
```

Render `visibleHighlights` with:

```tsx
<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
```

Update the homepage eyebrow to `data.doctor.title`, set the primary CTA to `Contact for consultation`, set the secondary CTA to `View surgical services`, and change the location summary to:

```tsx
Availability across {data.hospitals.length} Lahore hospitals, including{" "}
{privateConsultationCount} private consultation locations.
```

On About, rename `Care philosophy` to `Professional profile` and continue rendering the approved biography and qualifications from shared data.

- [ ] **Step 5: Make Hospitals and Contact availability-aware**

In both routes derive the label with:

```ts
const visitLabel =
  hospital.visitType === "availability"
    ? "Government hospital availability"
    : "Private consultation";
```

Show the label as a badge on hospital cards. Set the Hospitals introduction to `Mayo Hospital is listed for government hospital availability. Private pediatric surgery consultations can be arranged at Ch. Rahmat Ali Trust Hospital and IQRAA Medical Complex.` Only show the doctor phone link on cards where `visitType === "consultation"`.

On Contact:

- Remove the `Main clinic address` card and unused `MapPin` import.
- Add a `Visit type` column to the schedule table.
- Keep phone, email, and WhatsApp contact methods.
- Use the shared `appointmentNote` for the Mayo/private distinction.

- [ ] **Step 6: Update service-page and footer presentation**

Set the Services page heading to `Pediatric surgical services`, its introduction to `Specialized surgical assessment and treatment for newborns, children, and adolescents, with each care plan explained clearly to families.`, and keep all nine shared service cards.

The Footer continues to render `data.doctor.title`, which now displays `Consultant Pediatric Surgeon`; an empty default contact address must render no location row.

- [ ] **Step 7: Rebuild and run the public/admin contracts**

Run:

```bash
VITE_BASE_PATH=/zeshanashraf829/ npm run build
npm test
npm run test:pages
npx tsc --noEmit
```

Expected: all tests PASS, TypeScript exits zero, three statistics render by default, and the admin source contains both controls.

- [ ] **Step 8: Commit the page and admin wiring**

```bash
git add src/routes/admin.tsx src/routes/index.tsx src/routes/about.tsx src/routes/services.tsx src/routes/hospitals.tsx src/routes/contact.tsx src/components/site/Footer.tsx tests/admin-contract.test.ts tests/github-pages-build.test.mjs
git commit -m "feat: present pediatric surgery services and schedules"
```

### Task 3: Replace crawler metadata and regenerate the social banner

**Files:**
- Modify: `tests/branding.test.ts`
- Modify: `tests/social-preview.test.ts`
- Modify: `tests/github-pages-build.test.mjs`
- Modify: `src/lib/seo.ts`
- Modify: `src/routes/about.tsx`
- Modify: `src/routes/services.tsx`
- Modify: `src/routes/hospitals.tsx`
- Modify: `src/routes/contact.tsx`
- Modify: `assets/social-preview-home.svg`
- Modify: `public/social-preview-home.jpg`
- Modify: `README.md`

- [ ] **Step 1: Change SEO and banner expectations first**

In `tests/branding.test.ts`, require:

```ts
assert.equal(SEO.title, "Dr. Umair Arshad | MBBS, MS Pediatric Surgery");
assert.equal(
  SEO.description,
  "Consultant Pediatric Surgeon in Lahore with over 10 years of pediatric surgery experience and 16 years in the medical field.",
);
assert.equal(
  SEO.imageAlt,
  "Dr. Umair Arshad — MBBS, MS Pediatric Surgery and Consultant Pediatric Surgeon",
);
```

Replace the old banner-copy assertions in `tests/social-preview.test.ts` with:

```ts
assert.match(source, /CONSULTANT PEDIATRIC SURGEON/);
assert.match(source, /MBBS \(UHS\) · MS Pediatric Surgery/);
assert.match(source, /10\+ years of pediatric surgery experience/);
assert.match(source, /Mayo Hospital Lahore/);
assert.doesNotMatch(source, /FCPS/);
assert.doesNotMatch(source, /Child Specialist/);
```

Add to the GitHub Pages metadata test:

```js
assert.match(html, /Dr\. Umair Arshad \| MBBS, MS Pediatric Surgery/);
assert.match(html, /Consultant Pediatric Surgeon in Lahore with over 10 years/);
assert.doesNotMatch(html, /Consultant Pediatrician \/ Child Specialist/);
```

- [ ] **Step 2: Run focused tests to verify they fail**

Run:

```bash
npm test
npm run test:pages
```

Expected: FAIL because the current SEO constants, banner source, and prerendered HTML still contain general-pediatrician copy.

- [ ] **Step 3: Update centralized and route-specific metadata**

Set `src/lib/seo.ts` to:

```ts
export const SEO = {
  siteUrl: "https://zeshanashraf829.github.io/zeshanashraf829/",
  imageUrl: "https://zeshanashraf829.github.io/zeshanashraf829/social-preview-home.jpg",
  imageAlt: "Dr. Umair Arshad — MBBS, MS Pediatric Surgery and Consultant Pediatric Surgeon",
  imageType: "image/jpeg",
  imageWidth: "1200",
  imageHeight: "630",
  title: "Dr. Umair Arshad | MBBS, MS Pediatric Surgery",
  description:
    "Consultant Pediatric Surgeon in Lahore with over 10 years of pediatric surgery experience and 16 years in the medical field.",
} as const;
```

Use these exact route titles and descriptions:

| Route | Title | Description |
|---|---|---|
| About | `About Dr. Umair Arshad \| Pediatric Surgeon` | `Learn about Dr. Umair Arshad, a Consultant Pediatric Surgeon at Mayo Hospital Lahore with over 10 years of pediatric surgery experience.` |
| Services | `Pediatric Surgery Services \| Dr. Umair Arshad` | `Explore pediatric surgery services for newborns, children, and adolescents, including circumcision, hernia care, laparoscopy, and neonatal surgery.` |
| Hospitals | `Hospital Availability & Consultation Timings \| Dr. Umair Arshad` | `View Dr. Umair Arshad’s Mayo Hospital availability and private pediatric surgery consultation timings in Lahore.` |
| Contact | `Contact Dr. Umair Arshad \| Pediatric Surgery Consultations` | `Contact Dr. Umair Arshad for private pediatric surgery consultations and view hospital availability in Lahore.` |

- [ ] **Step 4: Replace the social banner text without changing its portrait**

In `assets/social-preview-home.svg`, keep the canvas, dark-teal split layout, portrait reference, renderer-compatible SVG features, and circles. Replace the right-column text with:

```text
CONSULTANT PEDIATRIC SURGEON
Dr. Umair Arshad
MBBS (UHS) · MS Pediatric Surgery
10+ years of pediatric surgery experience
Pediatric surgery · Neonatal surgery
Laparoscopy · Emergency services
Consultant Pediatric Surgeon · Mayo Hospital Lahore
```

Remove the old FCPS, Child Specialist, vaccination, growth, and generic pediatric-care copy. Adjust only text positions/font sizes needed to prevent clipping; do not alter `public/dr-umair-arshad.png`.

- [ ] **Step 5: Export and visually inspect the JPEG**

Run:

```bash
magick -background white assets/social-preview-home.svg -strip -interlace Plane -quality 88 public/social-preview-home.jpg
magick identify public/social-preview-home.jpg
```

Expected: ImageMagick identifies `public/social-preview-home.jpg` as a `1200x630` JPEG. Inspect the output with the local image viewer and confirm the portrait, name, credentials, role, service lines, and Mayo line are legible with no clipping or overlap.

- [ ] **Step 6: Update README and rebuild crawler-visible output**

Set the README introduction to:

```markdown
# Dr. Umair Arshad — Pediatric Surgeon Website

A multi-page website for Dr. Umair Arshad, MBBS (UHS), MS Pediatric Surgery and Consultant Pediatric Surgeon. It includes home, about, services, hospitals, contact, and browser-local admin routes.
```

Run:

```bash
VITE_BASE_PATH=/zeshanashraf829/ npm run build
npm test
npm run test:pages
```

Expected: all tests PASS and the prerendered homepage contains the approved title, description, and absolute social banner URL.

- [ ] **Step 7: Commit the SEO and social preview refresh**

```bash
git add src/lib/seo.ts src/routes/about.tsx src/routes/services.tsx src/routes/hospitals.tsx src/routes/contact.tsx assets/social-preview-home.svg public/social-preview-home.jpg README.md tests/branding.test.ts tests/social-preview.test.ts tests/github-pages-build.test.mjs
git commit -m "feat: update pediatric surgeon SEO and social preview"
```

### Task 4: Final public-content audit and delivery

**Files:**
- Verify all changed files; no planned source additions.

- [ ] **Step 1: Run the complete verification suite from committed state**

Run:

```bash
npm test
VITE_BASE_PATH=/zeshanashraf829/ npm run build
npm run test:pages
npx tsc --noEmit
npm run lint
git diff --check
```

Expected: unit tests, Pages tests, typecheck, build, and diff check exit zero; lint has zero errors (the repository’s existing Fast Refresh warnings may remain).

- [ ] **Step 2: Audit public source for obsolete claims**

Run:

```bash
rg -n -i "Consultant Pediatrician|Child Specialist|FCPS|Vaccination|Allergy|Nutrition Counselling|20,000\+|City Children's Hospital|Al-Shifa Medical Complex|Care Family Clinic" src/routes src/components src/lib/seo.ts README.md assets/social-preview-home.svg
```

Expected: no matches. Legacy constants in `src/lib/site-data.ts`, migration tests, historical specs, and Git history are intentionally excluded.

- [ ] **Step 3: Inspect generated metadata and assets**

Run:

```bash
magick identify public/social-preview-home.jpg dist/client/social-preview-home.jpg
rg -a -n "Dr\. Umair Arshad \| MBBS, MS Pediatric Surgery|og:image:secure_url|image/jpeg|1200|630" dist/client/index.html
```

Expected: both images are `1200 × 630` JPEGs and the static homepage exposes the approved title plus complete Open Graph image metadata.

- [ ] **Step 4: Perform browser verification at the GitHub Pages base path**

Run:

```bash
VITE_BASE_PATH=/zeshanashraf829/ npm run preview -- --host 127.0.0.1 --port 4173
```

Open `http://localhost:4173/zeshanashraf829/` and inspect these exact routes:

```text
http://localhost:4173/zeshanashraf829/
http://localhost:4173/zeshanashraf829/about
http://localhost:4173/zeshanashraf829/services
http://localhost:4173/zeshanashraf829/hospitals
http://localhost:4173/zeshanashraf829/contact
http://localhost:4173/zeshanashraf829/admin
```

Confirm:

- Three statistics render publicly and `1000+ Children treated` is absent.
- The admin statistic switch can show the `1000+` card after saving and hide it again.
- Mayo uses government-availability wording and no appointment phone.
- Both private consultation locations display the approved schedules.
- All nine services render and the supplied portrait remains unchanged.
- Navigation works under `/zeshanashraf829/`.

- [ ] **Step 5: Confirm Git state and complete the selected integration workflow**

Run:

```bash
git status --short --branch
git log --oneline --decorate -6
```

Expected: `main` is clean and ahead of `origin/main` only by the approved spec, plan, and implementation commits. Follow the user-selected finishing workflow without rewriting published history.
