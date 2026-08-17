import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { SocialLinks } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Child Specialist & Consultant Pediatrician | Clinic Timings" },
      {
        name: "description",
        content:
          "Experienced child specialist offering newborn care, vaccinations, growth monitoring and allergy treatment across multiple hospitals. Book an appointment today.",
      },
      { property: "og:title", content: "Child Specialist & Consultant Pediatrician" },
      {
        property: "og:description",
        content:
          "Gentle, expert pediatric care from newborn to adolescent, available at multiple hospitals.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useSiteData();

  return (
    <div>
      <section className="hero-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div>
            <span className="eyebrow">
              <HeartPulse className="h-4 w-4" /> {data.doctor.credentials}
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              {data.doctor.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {data.doctor.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <CalendarCheck className="h-5 w-5" /> Book an appointment
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-bold transition-colors hover:bg-secondary"
              >
                View services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <SocialLinks links={data.socials} className="mt-8" />
          </div>

          <div className="surface-card overflow-hidden p-0">
            <img
              src={data.doctor.photoUrl || heroImage}
              alt={`${data.doctor.name}, ${data.doctor.title}`}
              width={1200}
              height={900}
              className="h-full w-full bg-primary-soft object-cover"
            />
          </div>

        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {data.highlights.map((h) => (
            <div key={h.id} className="surface-card p-6 text-center">
              <p className="font-display text-4xl font-bold text-primary">{h.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">
              <ShieldCheck className="h-4 w-4" /> Care we provide
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">Popular services</h2>
          </div>
          <Link to="/services" className="font-semibold text-primary hover:underline">
            See all services →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {data.services.slice(0, 6).map((s) => (
            <article key={s.id} className="surface-card p-6">
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  Learn more →
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-3xl font-bold md:text-4xl">Where to find me</h2>
          <p className="mt-2 text-muted-foreground">
            Consultations available at {data.hospitals.length} locations.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {data.hospitals.map((h) => (
              <div key={h.id} className="surface-card p-6">
                <h3 className="text-lg font-bold">{h.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{h.address}</p>
                <p className="mt-3 text-sm font-semibold text-primary">{h.timings}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
