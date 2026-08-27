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
    {
      id: "h1",
      label: "Years of experience",
      value: "12+",
    } as unknown as SiteData["highlights"][number],
    {
      id: "h2",
      label: "Children treated",
      value: "20,000+",
    } as unknown as SiteData["highlights"][number],
    {
      id: "h3",
      label: "Hospitals",
      value: "3",
    } as unknown as SiteData["highlights"][number],
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
