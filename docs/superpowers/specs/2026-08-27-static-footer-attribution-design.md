# Static Footer Attribution Design

## Status

Approved in conversation on 2026-08-27.

## Goal

Add a permanent, site-wide footer attribution reading `Developed by Musfora Software Developers`, with `Musfora Software Developers` linking to `https://musfora.com/`.

## Presentation

- Place the attribution as a second centered line beneath the existing copyright inside the footer’s bottom bordered bar.
- Keep the attribution visually secondary using the footer’s existing small muted text styling.
- Give the linked company name a clear hover treatment consistent with the site’s primary color.
- Open the external link in a new browser tab.

## Implementation

- Render the attribution directly in `src/components/site/Footer.tsx`.
- Use a standard anchor with `href="https://musfora.com/"`, `target="_blank"`, and `rel="noreferrer noopener"`.
- Do not add the attribution text or URL to `SiteData`, local storage, backup JSON, or the admin panel. It must not be editable.
- Because `Footer` is rendered by the root route, the attribution appears on every public and admin page.

## Verification

- Add a source contract test proving the exact text, URL, new-tab target, and safe `rel` attributes are present in `Footer.tsx`.
- Extend the GitHub Pages prerender test to prove the attribution is present in generated homepage HTML.
- Verify the admin source and site-data model do not contain an editable Musfora field.
- Run unit tests, the GitHub Pages build/tests, TypeScript, lint, and a browser check of the footer.

## Out of Scope

- Adding an editable developer-credit setting.
- Adding a logo, image, tracking parameters, or additional agency contact details.
- Changing any existing footer contact details, page links, or copyright text.
