import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Sparkles } from "lucide-react";
import { useSiteData } from "@/lib/site-data";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Pediatric Services | Vaccination, Newborn & Allergy Care" },
      {
        name: "description",
        content:
          "Full list of pediatric services: newborn care, immunization, growth monitoring, childhood infections, asthma and allergy management, and nutrition counselling.",
      },
      { property: "og:title", content: "Pediatric Services for Children of All Ages" },
      {
        property: "og:description",
        content:
          "Newborn care, vaccinations, growth checks, allergy and asthma plans, and nutrition counselling.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useSiteData();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <span className="eyebrow">
        <Sparkles className="h-4 w-4" /> Services
      </span>
      <h1 className="mt-5 text-4xl font-bold md:text-5xl">Pediatric surgical services</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Specialized surgical assessment and treatment for newborns, children, and adolescents, with
        each care plan explained clearly to families.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {data.services.map((s) => (
          <article key={s.id} className="surface-card flex flex-col p-6">
            <h2 className="text-lg font-bold">{s.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>
            {s.link && (
              <a
                href={s.link}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Learn more <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </article>
        ))}
      </div>

      {data.services.length === 0 && (
        <p className="mt-10 text-muted-foreground">
          No services added yet. Add them from the admin panel.
        </p>
      )}

      <div className="surface-card mt-12 flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <h2 className="text-xl font-bold">Not sure which service you need?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact the doctor’s team for guidance about the right pediatric surgical consultation.
          </p>
        </div>
        <Link
          to="/contact"
          className="rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Contact for consultation
        </Link>
      </div>
    </div>
  );
}
