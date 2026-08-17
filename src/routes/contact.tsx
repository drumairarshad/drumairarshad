import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Mail, MapPin, Phone } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { toTelHref } from "@/lib/contact-links";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Appointments | Child Specialist Clinic" },
      {
        name: "description",
        content:
          "Call, email or message on WhatsApp to book a pediatric appointment. Clinic address, phone number and consultation hours.",
      },
      { property: "og:title", content: "Contact & Appointments" },
      {
        property: "og:description",
        content: "Phone, email, WhatsApp and clinic address for booking a pediatric visit.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSiteData();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <span className="eyebrow">
        <CalendarCheck className="h-4 w-4" /> Appointments
      </span>
      <h1 className="mt-5 text-4xl font-bold md:text-5xl">Get in touch</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{data.contact.appointmentNote}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {data.contact.phone && (
          <a href={toTelHref(data.contact.phone)} className="surface-card block p-7">
            <Phone className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-bold">Call the clinic</h2>
            <p className="mt-1 text-muted-foreground">{data.contact.phone}</p>
          </a>
        )}
        {data.contact.email && (
          <a href={`mailto:${data.contact.email}`} className="surface-card block p-7">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-bold">Email</h2>
            <p className="mt-1 break-all text-muted-foreground">{data.contact.email}</p>
          </a>
        )}
        {data.contact.address && (
          <div className="surface-card p-7 md:col-span-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-bold">Main clinic address</h2>
            <p className="mt-1 text-muted-foreground">{data.contact.address}</p>
          </div>
        )}
      </div>

      <div className="surface-card mt-8 p-7">
        <h2 className="text-lg font-bold">Follow &amp; message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Health tips, clinic updates and quick replies on social media.
        </p>
        <SocialLinks links={data.socials} className="mt-5" />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold">Consultation hours by hospital</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/70">
              <tr>
                <th className="px-5 py-3 font-bold">Hospital</th>
                <th className="px-5 py-3 font-bold">Timings</th>
              </tr>
            </thead>
            <tbody>
              {data.hospitals.map((h) => (
                <tr key={h.id} className="border-t border-border">
                  <td className="px-5 py-3">{h.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{h.timings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
