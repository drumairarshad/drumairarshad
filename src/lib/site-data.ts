import { useCallback, useEffect, useState } from "react";
import { BRAND, migrateLegacyBranding } from "./branding";

export type Service = {
  id: string;
  title: string;
  description: string;
  link?: string;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  timings: string;
  phone?: string;
  mapLink?: string;
};

export type SocialPlatform =
  | "facebook"
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  visible: boolean;
};

export type Highlight = { id: string; label: string; value: string };

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
    title: "Consultant Pediatrician / Child Specialist",
    credentials: "MBBS, FCPS (Paediatrics)",
    tagline: "Gentle, expert care for every stage of childhood",
    heroSubtitle:
      "Newborn to adolescent care across leading hospitals in the city — with parents guided at every step.",
    photoUrl: "",
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
    phone: BRAND.phoneDisplay,
    email: BRAND.email,
    address: "Block B, Main Boulevard, Gulberg III, Lahore",
    appointmentNote:
      "Appointments can be booked by phone or WhatsApp between 9:00 AM and 8:00 PM. Emergencies are seen on a walk-in basis.",
  },
  socials: [
    { platform: "facebook", url: "https://facebook.com/", visible: true },
    { platform: "whatsapp", url: BRAND.whatsappUrl, visible: true },
    { platform: "instagram", url: "https://instagram.com/", visible: true },
    { platform: "tiktok", url: "https://tiktok.com/", visible: false },
    { platform: "youtube", url: "https://youtube.com/", visible: true },
  ],
};

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
  return migrateLegacyBranding(merged);
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
