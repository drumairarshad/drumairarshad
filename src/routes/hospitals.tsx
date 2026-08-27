import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock, MapPin, Phone } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { toTelHref } from "@/lib/contact-links";

export const Route = createFileRoute("/hospitals")({
  head: () => ({
    meta: [
      { title: "Hospitals & Clinic Timings | Child Specialist" },
      {
        name: "description",
        content:
          "Find consultation hospitals, addresses, phone numbers and OPD timings for the child specialist across all practice locations.",
      },
      { property: "og:title", content: "Hospitals & Clinic Timings" },
      {
        property: "og:description",
        content: "Addresses, phone numbers and OPD timings for every practice location.",
      },
    ],
  }),
  component: HospitalsPage,
});

function HospitalsPage() {
  const { data } = useSiteData();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <span className="eyebrow">
        <Building2 className="h-4 w-4" /> Locations
      </span>
      <h1 className="mt-5 text-4xl font-bold md:text-5xl">Hospitals &amp; timings</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Mayo Hospital is listed for government hospital availability. Private pediatric surgery
        consultations can be arranged at Ch. Rahmat Ali Trust Hospital and IQRAA Medical Complex.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {data.hospitals.map((h) => (
          <article key={h.id} className="surface-card p-7">
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              {h.visitType === "availability"
                ? "Government hospital availability"
                : "Private consultation"}
            </span>
            <h2 className="mt-4 text-xl font-bold">{h.name}</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{h.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="font-semibold text-foreground">{h.timings}</span>
              </li>
              {h.visitType === "consultation" && h.phone && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <a href={toTelHref(h.phone)} className="hover:text-primary">
                    {h.phone}
                  </a>
                </li>
              )}
            </ul>
            {h.mapLink && (
              <a
                href={h.mapLink}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Open in maps →
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="surface-card mt-12 flex flex-wrap items-center justify-between gap-4 p-8">
        <p className="font-semibold">Need help arranging a private consultation?</p>
        <Link
          to="/contact"
          className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Contact for consultation
        </Link>
      </div>
    </div>
  );
}
