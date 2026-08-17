# Dr. Umair Arshad Website Branding Design

## Goal

Replace the website's public Dr. Ayesha Khan and Lovable branding with Dr. Umair Arshad's identity, official contact details, supplied portrait, initials favicon, and social-sharing metadata suitable for the project's GitHub Pages URL.

## Scope

### Doctor identity and contact details

- Set the default doctor name to `Dr. Umair Arshad`.
- Set the public email to `drumairarshad74@gmail.com`.
- Display the official phone number as `+92 304 3755293` and use the normalized number `+923043755293` in telephone and WhatsApp links.
- Replace existing placeholder hospital phone numbers with the official number so the website does not publish conflicting contact information.
- Migrate only exact legacy defaults stored in browser local storage. Preserve unrelated administrator customizations.

### Portrait

- Copy the supplied portrait into the repository unchanged.
- Use it as the default homepage hero portrait.
- Preserve the admin panel's optional photo URL override.
- Update generated alternative text through the new doctor name.

### Favicon

- Replace the existing Lovable favicon with a site-colored `UA` initials icon.
- Provide a modern SVG favicon and an ICO fallback so browsers do not reuse the old icon path.

### Social sharing and SEO

- Use `https://zeshanashraf829.github.io/zeshanashraf829/` as the canonical project URL.
- Add doctor-specific document title and description metadata.
- Add Open Graph URL, title, description, type, and portrait image metadata.
- Add equivalent Twitter card title, description, and image metadata.
- Use an absolute GitHub Pages portrait URL so external link-preview crawlers can fetch it.
- Keep the supplied portrait unchanged rather than generating or cropping a replacement.

### Lovable debranding

- Remove visitor-facing Lovable branding and the old favicon.
- Remove Lovable promotion from the README.
- Remove the Lovable-specific client error-reporting integration.
- Retain the hidden Lovable Vite build dependency and the repository history-protection instructions, as approved, because they are not visitor-facing and removing them could destabilize the current build or connected history.

## Data flow

The default site-data object supplies the new doctor identity and contacts to the header, footer, home, hospitals, contact, and admin routes. On browser load, saved site data is merged with current defaults. A narrow migration replaces only known legacy name, email, phone, hospital-phone, and WhatsApp values, leaving administrator-entered values intact. The bundled portrait is used unless an administrator has deliberately supplied a custom photo URL.

Root route metadata supplies crawler-visible SEO and sharing fields independently of browser local storage. This ensures link previews use the canonical Dr. Umair Arshad identity even though social crawlers do not execute or share a visitor's local admin settings.

## Failure handling

- If browser storage is unavailable or malformed, the website falls back to the new defaults.
- If no custom photo URL is present, the bundled portrait always renders.
- The existing general error boundary remains, but it no longer sends errors through Lovable-specific hooks.

## Verification

- Add focused tests for legacy-data migration and preservation of custom values where supported by the existing toolchain.
- Run lint and the production build.
- Inspect built metadata for the canonical title, description, URL, and portrait.
- Confirm the portrait and both favicon formats exist and have valid image dimensions/types.
- Scan tracked website and documentation files to confirm Ayesha and public Lovable branding are gone, allowing only the approved build dependency and repository safeguard references.

## Out of scope

- Removing or replacing the approved Lovable build package.
- Rewriting or force-pushing published Git history.
- Deploying the site or changing GitHub Pages repository settings.
- Changing medical qualifications, biography, services, locations, or appointment timings beyond the requested identity and contact corrections.
