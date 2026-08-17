export const BRAND = {
  doctorName: "Dr. Umair Arshad",
  email: "drumairarshad74@gmail.com",
  phoneDisplay: "+92 304 3755293",
  phoneLink: "+923043755293",
  whatsappUrl: "https://wa.me/923043755293",
} as const;

type BrandMigratable = {
  doctor: { name: string };
  contact: { email: string; phone: string };
  hospitals: Array<{ phone?: string }>;
  socials: Array<{ platform: string; url: string }>;
};

const LEGACY = {
  doctorName: "Dr. Ayesha Khan",
  email: "appointments@drayeshakhan.com",
  phones: new Set(["+92 300 1234567", "+92 300 7654321"]),
  whatsappUrl: "https://wa.me/923001234567",
} as const;

export function migrateLegacyBranding<T extends BrandMigratable>(data: T): T {
  return {
    ...data,
    doctor: {
      ...data.doctor,
      name: data.doctor.name === LEGACY.doctorName ? BRAND.doctorName : data.doctor.name,
    },
    contact: {
      ...data.contact,
      email: data.contact.email === LEGACY.email ? BRAND.email : data.contact.email,
      phone: LEGACY.phones.has(data.contact.phone) ? BRAND.phoneDisplay : data.contact.phone,
    },
    hospitals: data.hospitals.map((hospital) => ({
      ...hospital,
      phone:
        hospital.phone && LEGACY.phones.has(hospital.phone) ? BRAND.phoneDisplay : hospital.phone,
    })),
    socials: data.socials.map((social) => ({
      ...social,
      url:
        social.platform === "whatsapp" && social.url === LEGACY.whatsappUrl
          ? BRAND.whatsappUrl
          : social.url,
    })),
  } as T;
}
