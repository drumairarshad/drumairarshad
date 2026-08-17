import { Facebook, Instagram, MessageCircle, Music2, Youtube } from "lucide-react";
import type { SocialLink, SocialPlatform } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const meta: Record<SocialPlatform, { label: string; Icon: typeof Facebook }> = {
  facebook: { label: "Facebook", Icon: Facebook },
  whatsapp: { label: "WhatsApp", Icon: MessageCircle },
  instagram: { label: "Instagram", Icon: Instagram },
  tiktok: { label: "TikTok", Icon: Music2 },
  youtube: { label: "YouTube", Icon: Youtube },
};

export function SocialLinks({
  links,
  className,
}: {
  links: SocialLink[];
  className?: string;
}) {
  const visible = links.filter((l) => l.visible && l.url.trim().length > 0);
  if (visible.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {visible.map((link) => {
        const { label, Icon } = meta[link.platform];
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
            title={label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}

export const socialMeta = meta;
