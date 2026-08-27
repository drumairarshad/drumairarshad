import { useCallback, useEffect, useState } from "react";
import { BRAND, migrateLegacyBranding } from "./branding.ts";

export type Service = {
  id: string;
  title: string;
  description: string;
  link?: string;
};

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

export type SocialPlatform = "facebook" | "whatsapp" | "instagram" | "tiktok" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  visible: boolean;
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

export type SiteData = {
  doctor: {
    name: string;
    title: string;
    credentials: string;
    tagline: string;
    heroSubtitle: string;
    photoUrl: string;
    about: string;
    qualifications: string[];
  };
  highlights: Highlight[];
  services: Service[];
  hospitals: Hospital[];
  contact: {
    phone: string;
    email: string;
    address: string;
    appointmentNote: string;
  };
  socials: SocialLink[];
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  "facebook",
  "whatsapp",
  "instagram",
  "tiktok",
  "youtube",
];

export const defaultSiteData: SiteData = {
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
    qualifications: ["MBBS (UHS)", "MS Pediatric Surgery — Children’s Hospital Lahore"],
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
  contact: {
    phone: BRAND.phoneDisplay,
    email: BRAND.email,
    address: "",
    appointmentNote:
      "Private consultations at Ch. Rahmat Ali Trust Hospital and IQRAA Medical Complex can be arranged by phone or WhatsApp. Mayo Hospital is listed as government hospital availability and is not booked through this website.",
  },
  socials: [
    { platform: "facebook", url: "https://facebook.com/", visible: true },
    { platform: "whatsapp", url: BRAND.whatsappUrl, visible: true },
    { platform: "instagram", url: "https://instagram.com/", visible: true },
    { platform: "tiktok", url: "https://tiktok.com/", visible: false },
    { platform: "youtube", url: "https://youtube.com/", visible: true },
  ],
};

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
      title: replaceExact(
        data.doctor.title,
        LEGACY_PROFILE.doctor.title,
        defaultSiteData.doctor.title,
      ),
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
      qualifications: arraysEqual(data.doctor.qualifications, LEGACY_PROFILE.doctor.qualifications)
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

const STORAGE_KEY = "pediatric-site-data-v1";

function merge(saved: unknown): SiteData {
  if (!saved || typeof saved !== "object") return defaultSiteData;
  const s = saved as Partial<SiteData>;
  const merged: SiteData = {
    doctor: { ...defaultSiteData.doctor, ...(s.doctor ?? {}) },
    highlights: s.highlights ?? defaultSiteData.highlights,
    services: s.services ?? defaultSiteData.services,
    hospitals: s.hospitals ?? defaultSiteData.hospitals,
    contact: { ...defaultSiteData.contact, ...(s.contact ?? {}) },
    socials: s.socials ?? defaultSiteData.socials,
  };
  return migrateLegacyProfile(migrateLegacyBranding(merged));
}

export function readSiteData(): SiteData {
  if (typeof window === "undefined") return defaultSiteData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? merge(JSON.parse(raw)) : defaultSiteData;
  } catch {
    return defaultSiteData;
  }
}

export function writeSiteData(data: SiteData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("site-data-changed"));
}

export function resetSiteData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("site-data-changed"));
}

export function useSiteData() {
  const [data, setData] = useState<SiteData>(defaultSiteData);

  useEffect(() => {
    const sync = () => setData(readSiteData());
    sync();
    window.addEventListener("site-data-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("site-data-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const save = useCallback((next: SiteData) => {
    writeSiteData(next);
    setData(next);
  }, []);

  return { data, save };
}

export const uid = () => Math.random().toString(36).slice(2, 9);
