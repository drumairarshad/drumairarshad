import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Lock, Plus, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  defaultSiteData,
  resetSiteData,
  SOCIAL_PLATFORMS,
  uid,
  useSiteData,
  type SiteData,
} from "@/lib/site-data";
import { socialMeta } from "@/components/site/SocialLinks";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel | Manage Website Content" },
      {
        name: "description",
        content:
          "Private admin panel to edit doctor profile, services, hospitals, contact details and social links for the clinic website.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Panel" },
      { property: "og:description", content: "Manage the clinic website content." },
    ],
  }),
  component: AdminPage,
});

const PASSCODE = "clinic2026";
const AUTH_KEY = "pediatric-admin-auth";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
const labelCls = "block text-xs font-bold uppercase tracking-wide text-muted-foreground";
const cardCls = "surface-card p-6";
const btnPrimary =
  "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90";
const btnGhost =
  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold transition-colors hover:bg-secondary";

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelCls}>{label}</span>
      {textarea ? (
        <textarea
          className={`${inputCls} min-h-28`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputCls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function AdminPage() {
  const { data, save } = useSiteData();
  const [draft, setDraft] = useState<SiteData>(defaultSiteData);
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState("");
  const [tab, setTab] = useState<
    "profile" | "services" | "hospitals" | "contact" | "socials" | "backup"
  >("profile");

  useEffect(() => setDraft(data), [data]);
  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(AUTH_KEY) === "yes");
  }, []);

  const update = (patch: Partial<SiteData>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    save(draft);
    toast.success("Changes saved to this browser");
  };

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-md flex-col px-5 py-24">
        <div className={cardCls}>
          <Lock className="h-7 w-7 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin passcode to manage website content.
          </p>
          <form
            className="mt-6 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (code === PASSCODE) {
                window.sessionStorage.setItem(AUTH_KEY, "yes");
                setAuthed(true);
              } else {
                toast.error("Incorrect passcode");
              }
            }}
          >
            <input
              type="password"
              className={inputCls}
              value={code}
              placeholder="Passcode"
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" className={btnPrimary}>
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    ["profile", "Doctor profile"],
    ["services", "Services"],
    ["hospitals", "Hospitals"],
    ["contact", "Contact"],
    ["socials", "Social media"],
    ["backup", "Backup"],
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit every page of the website. Save, then export the JSON backup to publish changes on
            GitHub Pages.
          </p>
        </div>
        <button onClick={handleSave} className={btnPrimary}>
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card hover:bg-secondary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {tab === "profile" && (
          <div className={cardCls}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Doctor name"
                value={draft.doctor.name}
                onChange={(v) => update({ doctor: { ...draft.doctor, name: v } })}
              />
              <Field
                label="Title"
                value={draft.doctor.title}
                onChange={(v) => update({ doctor: { ...draft.doctor, title: v } })}
              />
              <Field
                label="Credentials"
                value={draft.doctor.credentials}
                onChange={(v) => update({ doctor: { ...draft.doctor, credentials: v } })}
              />
              <Field
                label="Photo URL (optional)"
                value={draft.doctor.photoUrl}
                onChange={(v) => update({ doctor: { ...draft.doctor, photoUrl: v } })}
              />
            </div>
            <div className="mt-4 space-y-4">
              <Field
                label="Hero headline"
                value={draft.doctor.tagline}
                onChange={(v) => update({ doctor: { ...draft.doctor, tagline: v } })}
              />
              <Field
                label="Hero subtitle"
                textarea
                value={draft.doctor.heroSubtitle}
                onChange={(v) => update({ doctor: { ...draft.doctor, heroSubtitle: v } })}
              />
              <Field
                label="About text"
                textarea
                value={draft.doctor.about}
                onChange={(v) => update({ doctor: { ...draft.doctor, about: v } })}
              />
              <Field
                label="Qualifications (one per line)"
                textarea
                value={draft.doctor.qualifications.join("\n")}
                onChange={(v) =>
                  update({
                    doctor: {
                      ...draft.doctor,
                      qualifications: v.split("\n").filter((x) => x.trim()),
                    },
                  })
                }
              />
            </div>

            <h3 className="mt-8 text-lg font-bold">Highlight stats</h3>
            <div className="mt-3 space-y-3">
              {draft.highlights.map((h, i) => (
                <div key={h.id} className="flex flex-wrap items-end gap-3">
                  <div className="w-32">
                    <Field
                      label="Value"
                      value={h.value}
                      onChange={(v) => {
                        const next = [...draft.highlights];
                        next[i] = { ...h, value: v };
                        update({ highlights: next });
                      }}
                    />
                  </div>
                  <div className="min-w-48 flex-1">
                    <Field
                      label="Label"
                      value={h.label}
                      onChange={(v) => {
                        const next = [...draft.highlights];
                        next[i] = { ...h, label: v };
                        update({ highlights: next });
                      }}
                    />
                  </div>
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
                  <button
                    className={btnGhost}
                    onClick={() =>
                      update({ highlights: draft.highlights.filter((x) => x.id !== h.id) })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                className={btnGhost}
                onClick={() =>
                  update({
                    highlights: [
                      ...draft.highlights,
                      { id: uid(), label: "", value: "", visible: true },
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add stat
              </button>
            </div>
          </div>
        )}

        {tab === "services" && (
          <div className="space-y-4">
            {draft.services.map((s, i) => (
              <div key={s.id} className={cardCls}>
                <div className="space-y-4">
                  <Field
                    label="Title"
                    value={s.title}
                    onChange={(v) => {
                      const next = [...draft.services];
                      next[i] = { ...s, title: v };
                      update({ services: next });
                    }}
                  />
                  <Field
                    label="Description"
                    textarea
                    value={s.description}
                    onChange={(v) => {
                      const next = [...draft.services];
                      next[i] = { ...s, description: v };
                      update({ services: next });
                    }}
                  />
                  <Field
                    label="Link (optional)"
                    placeholder="https://..."
                    value={s.link ?? ""}
                    onChange={(v) => {
                      const next = [...draft.services];
                      next[i] = { ...s, link: v };
                      update({ services: next });
                    }}
                  />
                </div>
                <button
                  className={`${btnGhost} mt-4 text-destructive`}
                  onClick={() => update({ services: draft.services.filter((x) => x.id !== s.id) })}
                >
                  <Trash2 className="h-4 w-4" /> Remove service
                </button>
              </div>
            ))}
            <button
              className={btnPrimary}
              onClick={() =>
                update({
                  services: [
                    ...draft.services,
                    { id: uid(), title: "", description: "", link: "" },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4" /> Add service
            </button>
          </div>
        )}

        {tab === "hospitals" && (
          <div className="space-y-4">
            {draft.hospitals.map((h, i) => (
              <div key={h.id} className={cardCls}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Hospital name"
                    value={h.name}
                    onChange={(v) => {
                      const next = [...draft.hospitals];
                      next[i] = { ...h, name: v };
                      update({ hospitals: next });
                    }}
                  />
                  <Field
                    label="Timings"
                    value={h.timings}
                    onChange={(v) => {
                      const next = [...draft.hospitals];
                      next[i] = { ...h, timings: v };
                      update({ hospitals: next });
                    }}
                  />
                  <Field
                    label="Address"
                    value={h.address}
                    onChange={(v) => {
                      const next = [...draft.hospitals];
                      next[i] = { ...h, address: v };
                      update({ hospitals: next });
                    }}
                  />
                  <Field
                    label="Phone (optional)"
                    value={h.phone ?? ""}
                    onChange={(v) => {
                      const next = [...draft.hospitals];
                      next[i] = { ...h, phone: v };
                      update({ hospitals: next });
                    }}
                  />
                  <Field
                    label="Map link (optional)"
                    value={h.mapLink ?? ""}
                    onChange={(v) => {
                      const next = [...draft.hospitals];
                      next[i] = { ...h, mapLink: v };
                      update({ hospitals: next });
                    }}
                  />
                  <label className="block space-y-1.5">
                    <span className={labelCls}>Visit type</span>
                    <select
                      className={inputCls}
                      value={h.visitType}
                      onChange={(event) => {
                        const next = [...draft.hospitals];
                        next[i] = {
                          ...h,
                          visitType: event.target
                            .value as SiteData["hospitals"][number]["visitType"],
                        };
                        update({ hospitals: next });
                      }}
                    >
                      <option value="availability">Government availability</option>
                      <option value="consultation">Private consultation</option>
                    </select>
                  </label>
                </div>
                <button
                  className={`${btnGhost} mt-4 text-destructive`}
                  onClick={() =>
                    update({ hospitals: draft.hospitals.filter((x) => x.id !== h.id) })
                  }
                >
                  <Trash2 className="h-4 w-4" /> Remove hospital
                </button>
              </div>
            ))}
            <button
              className={btnPrimary}
              onClick={() =>
                update({
                  hospitals: [
                    ...draft.hospitals,
                    {
                      id: uid(),
                      name: "",
                      address: "",
                      timings: "",
                      visitType: "consultation",
                      phone: "",
                      mapLink: "",
                    },
                  ],
                })
              }
            >
              <Plus className="h-4 w-4" /> Add hospital
            </button>
          </div>
        )}

        {tab === "contact" && (
          <div className={`${cardCls} space-y-4`}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Phone"
                value={draft.contact.phone}
                onChange={(v) => update({ contact: { ...draft.contact, phone: v } })}
              />
              <Field
                label="Email"
                value={draft.contact.email}
                onChange={(v) => update({ contact: { ...draft.contact, email: v } })}
              />
            </div>
            <Field
              label="Main address"
              value={draft.contact.address}
              onChange={(v) => update({ contact: { ...draft.contact, address: v } })}
            />
            <Field
              label="Appointment note"
              textarea
              value={draft.contact.appointmentNote}
              onChange={(v) => update({ contact: { ...draft.contact, appointmentNote: v } })}
            />
          </div>
        )}

        {tab === "socials" && (
          <div className={`${cardCls} space-y-5`}>
            <p className="text-sm text-muted-foreground">
              Add the profile URL and use the toggle to show or hide each platform on the website.
            </p>
            {SOCIAL_PLATFORMS.map((platform) => {
              const existing =
                draft.socials.find((s) => s.platform === platform) ??
                ({ platform, url: "", visible: false } as const);
              const { label, Icon } = socialMeta[platform];
              const setLink = (patch: Partial<typeof existing>) => {
                const others = draft.socials.filter((s) => s.platform !== platform);
                update({ socials: [...others, { ...existing, ...patch }] });
              };
              return (
                <div key={platform} className="flex flex-wrap items-end gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-56 flex-1">
                    <Field
                      label={label}
                      placeholder="https://..."
                      value={existing.url}
                      onChange={(v) => setLink({ url: v })}
                    />
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={existing.visible}
                    aria-label={`Show ${label}`}
                    onClick={() => setLink({ visible: !existing.visible })}
                    className={`relative h-9 w-16 rounded-full transition-colors ${
                      existing.visible ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-7 w-7 rounded-full bg-card shadow transition-all ${
                        existing.visible ? "left-8" : "left-1"
                      }`}
                    />
                  </button>
                  <span className="w-16 text-xs font-semibold text-muted-foreground">
                    {existing.visible ? "Visible" : "Hidden"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {tab === "backup" && (
          <div className={`${cardCls} space-y-4`}>
            <h2 className="text-lg font-bold">Backup &amp; publish</h2>
            <p className="text-sm text-muted-foreground">
              Content is stored in this browser. Export the JSON file to keep a backup or move
              content to another device — then import it there.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className={btnGhost}
                onClick={() => {
                  const blob = new Blob([JSON.stringify(draft, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "site-content.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" /> Export JSON
              </button>

              <label className={`${btnGhost} cursor-pointer`}>
                <Upload className="h-4 w-4" /> Import JSON
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const parsed = JSON.parse(await file.text()) as SiteData;
                      setDraft(parsed);
                      save(parsed);
                      toast.success("Content imported");
                    } catch {
                      toast.error("Invalid JSON file");
                    }
                  }}
                />
              </label>

              <button
                className={`${btnGhost} text-destructive`}
                onClick={() => {
                  resetSiteData();
                  setDraft(defaultSiteData);
                  toast.success("Reset to default content");
                }}
              >
                <RotateCcw className="h-4 w-4" /> Reset to defaults
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={handleSave} className={btnPrimary}>
          <Save className="h-4 w-4" /> Save changes
        </button>
      </div>
    </div>
  );
}
