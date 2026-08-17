import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { toTelHref } from "@/lib/contact-links";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const { data } = useSiteData();

  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">{data.doctor.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{data.doctor.title}</p>
          <p className="mt-4 text-sm text-muted-foreground">{data.doctor.tagline}</p>
          <SocialLinks links={data.socials} className="mt-5" />
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Pages
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary">
                Services
              </Link>
            </li>
            <li>
              <Link to="/hospitals" className="hover:text-primary">
                Hospitals
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-muted-foreground hover:text-primary">
                Admin panel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            {data.contact.phone && (
              <li className="flex gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href={toTelHref(data.contact.phone)}>{data.contact.phone}</a>
              </li>
            )}
            {data.contact.email && (
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
              </li>
            )}
            {data.contact.address && (
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span>{data.contact.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {data.doctor.name}. All rights reserved.
      </div>
    </footer>
  );
}
