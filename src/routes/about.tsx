import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, GraduationCap, Stethoscope } from "lucide-react";
import { useSiteData } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Doctor | Consultant Pediatrician" },
      {
        name: "description",
        content:
          "Meet the consultant pediatrician: qualifications, clinical experience and the philosophy behind gentle, family-focused child healthcare.",
      },
      { property: "og:title", content: "About the Doctor | Consultant Pediatrician" },
      {
        property: "og:description",
        content: "Qualifications, experience and care philosophy of a practising child specialist.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSiteData();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <span className="eyebrow">
        <Stethoscope className="h-4 w-4" /> About
      </span>
      <h1 className="mt-5 text-4xl font-bold md:text-5xl">{data.doctor.name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        {data.doctor.title} · {data.doctor.credentials}
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-8">
          <h2 className="text-xl font-bold">Care philosophy</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
            {data.doctor.about}
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book an appointment
          </Link>
        </div>

        <div className="surface-card p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <GraduationCap className="h-5 w-5 text-primary" /> Qualifications
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {data.doctor.qualifications.map((q) => (
              <li key={q} className="flex gap-3">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {data.highlights.map((h) => (
          <div key={h.id} className="surface-card p-6 text-center">
            <p className="font-display text-3xl font-bold text-primary">{h.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{h.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
