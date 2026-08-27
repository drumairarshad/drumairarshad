# Dr. Umair Arshad Pediatric Surgeon Profile Design

## Status

Approved in conversation on 2026-08-27. This specification replaces the website's old general-pediatrician profile with the supplied pediatric-surgery information.

## Goal

Present Dr. Umair Arshad consistently as a Consultant Pediatric Surgeon across the public website, browser-local admin defaults, hospital schedules, SEO metadata, and social-sharing banner. Remove unsupported qualifications, statistics, services, and placeholder locations while preserving unrelated administrator customizations.

## Authoritative professional profile

- Name: `Dr. Umair Arshad`
- Header credentials: `MBBS (UHS) · MS Pediatric Surgery`
- Professional title: `Consultant Pediatric Surgeon`
- Qualification entries:
  - `MBBS (UHS)`
  - `MS Pediatric Surgery — Children’s Hospital Lahore`
- Current position: `Consultant Pediatric Surgeon, Mayo Hospital Lahore`
- Experience:
  - Over 10 years in pediatric surgery
  - 16 years in the medical field
- Homepage tagline: `Specialized surgical care for newborns, children, and adolescents`
- Homepage summary: `Over 10 years of experience in pediatric surgery and 16 years in the medical field. Currently serving as Consultant Pediatric Surgeon at Mayo Hospital Lahore.`
- About copy: `Dr. Umair Arshad is a Consultant Pediatric Surgeon with over 10 years of experience in pediatric surgery and 16 years in the medical field. He currently works as a Consultant Pediatric Surgeon at Mayo Hospital Lahore, providing surgical care for newborns, children, and adolescents.`

All former claims about FCPS (Paediatrics), general pediatrics, preventive care, vaccination, allergy, nutrition, membership, neonatal-resuscitation certification, King Edward Medical University education, 12 years of experience, and 20,000 children treated are obsolete and must not remain in public defaults or crawler metadata.

## Statistics

Each highlight statistic gains a required `visible` boolean. Public statistic sections render only entries where `visible` is true. The admin panel retains editable value and label fields and adds a show/hide switch to every statistic.

Default statistics:

| Value | Label | Public by default |
|---|---|---|
| `16` | Years in the medical field | Yes |
| `10+` | Years in pediatric surgery | Yes |
| `1000+` | Children treated | No |
| `2` | Private consultation locations | Yes |

The statistic grid must adapt to the number of visible cards. Enabling the hidden `1000+` card must not create an awkward isolated row or overflow on small screens.

## Pediatric surgery services

Replace the old six general-pediatric services with these nine services in this order:

1. **Painless Circumcision** — Comfort-focused circumcision care with age-appropriate pain management and postoperative guidance.
2. **Inguinal Hernia** — Assessment and surgical treatment of inguinal hernias and groin swelling in children.
3. **Undescended Testis** — Evaluation and surgical correction of an undescended testis with age-appropriate planning.
4. **Tongue-Tie** — Assessment and surgical release when tongue-tie affects feeding or oral function.
5. **Acute Appendicitis** — Urgent evaluation and surgical management of suspected appendicitis in children.
6. **Rectal Polyp** — Evaluation and removal of rectal polyps causing bleeding or discomfort.
7. **Laparoscopic Surgery** — Minimally invasive pediatric surgery when clinically appropriate.
8. **Emergency Pediatric Surgical Care** — Assessment and management of urgent pediatric surgical conditions. Do not imply that Dr. Umair personally provides 24-hour availability.
9. **Neonatal Surgery** — Specialized surgical evaluation and care for newborn conditions.

Homepage and Services page headings, introductions, calls to action, and metadata must use pediatric-surgery language. General vaccination, growth monitoring, infections, asthma, allergy, and nutrition services must be removed from defaults and SEO.

## Hospitals and availability

Hospital data gains a `visitType` value of `availability` or `consultation`. This drives the badge and explanatory wording on hospital and contact pages. Timings stay editable in the admin panel so the user can update them later.

### Mayo Hospital Lahore

- Visit type: `availability`
- Address: `Hospital Road, Anarkali Bazaar, Lahore, Punjab 54000`
- Timing: `Monday–Saturday, 8:00 AM–2:00 PM`
- Public label: `Government hospital availability`
- Do not show appointment-booking language or the private consultation phone as if it books Mayo Hospital visits.

### Ch. Rahmat Ali Trust Hospital

- Visit type: `consultation`
- Address: `45 Civic Centre, Dr. Wasti Chowk, Ch. Rahmat Ali Road, Township, Lahore`
- Timing: `Saturday, Tuesday & Thursday, 4:00–6:00 PM`
- Public label: `Private consultation`
- The official Dr. Umair phone and WhatsApp links may be used to arrange a consultation.

### IQRAA Medical Complex (Extension)

- Visit type: `consultation`
- Address: `24–26 A, Maulana Shaukat Ali Road, Johar Town, Lahore`
- Timing: `Daily, 6:00–8:00 PM`
- Public label: `Private consultation`
- The official Dr. Umair phone and WhatsApp links may be used to arrange a consultation.

The homepage location summary must distinguish three hospital locations from two private consultation locations. The Hospitals page introduction becomes availability-oriented rather than saying every location is appointment-based. The Contact page removes the misleading single `Main clinic address` card and uses the complete hospital schedule as the source of location information.

Official address references:

- Mayo Hospital Lahore: <https://www.mayohospital.gop.pk/>
- Ch. Rahmat Ali Trust Hospital: <https://chrahmatalitrust.org/hospital/>
- IQRAA Medical Complex: <https://www.iqraamedicalcomplex.com.pk/contact>

The doctor-specific days and times above come from the user and take precedence over general hospital opening hours.

## Page presentation

### Header and footer

- Display `Dr. Umair Arshad` as the brand name.
- Display `MBBS (UHS) · MS Pediatric Surgery` as the compact credential line.
- Display `Consultant Pediatric Surgeon` in the footer.
- Keep the existing `UA` favicon and supplied portrait.

### Homepage

- Eyebrow: `Consultant Pediatric Surgeon`
- Main heading: `Specialized surgical care for newborns, children, and adolescents`
- Summary: the approved experience and Mayo Hospital sentence.
- Primary action: `Contact for consultation`
- Secondary action: `View surgical services`
- Render the first six surgical services in the existing service preview.
- Render only visible highlights using an auto-fitting responsive grid.
- Present Mayo as availability and the other two locations as private consultations.

### About page

- Use the approved title, credentials, biography, and qualifications.
- Rename the generic care-philosophy heading to a professional-profile or experience heading.
- Render only visible highlight statistics.

### Services page

- Use surgical-service headings and introductions.
- Render all nine approved services.
- Retain the contact guidance call to action without promising outcomes or 24-hour personal coverage.

### Hospitals and Contact pages

- Show a visit-type badge on every hospital.
- Use appointment language only for `consultation` locations.
- Use availability wording for Mayo Hospital.
- Continue displaying official email, phone, and WhatsApp details for contacting Dr. Umair.

## SEO and social sharing

Use these homepage SEO defaults:

- Title: `Dr. Umair Arshad | MBBS, MS Pediatric Surgery`
- Description: `Consultant Pediatric Surgeon in Lahore with over 10 years of pediatric surgery experience and 16 years in the medical field.`
- Image alt: `Dr. Umair Arshad — MBBS, MS Pediatric Surgery and Consultant Pediatric Surgeon`
- Canonical URL: `https://zeshanashraf829.github.io/zeshanashraf829/`
- Social banner URL, type, and dimensions remain an absolute `1200 × 630` JPEG under the canonical site.

Update route titles and descriptions to pediatric-surgery wording:

- About: `About Dr. Umair Arshad | Pediatric Surgeon`
- Services: `Pediatric Surgery Services | Dr. Umair Arshad`
- Hospitals: `Hospital Availability & Consultation Timings | Dr. Umair Arshad`
- Contact: `Contact Dr. Umair Arshad | Pediatric Surgery Consultations`

Regenerate the existing dark-teal split social banner using the supplied portrait unchanged. The banner hierarchy is:

1. `CONSULTANT PEDIATRIC SURGEON`
2. `Dr. Umair Arshad`
3. `MBBS (UHS) · MS Pediatric Surgery`
4. `10+ years of pediatric surgery experience`
5. `Pediatric surgery · Neonatal surgery`
6. `Laparoscopy · Emergency services`
7. `Consultant Pediatric Surgeon · Mayo Hospital Lahore`

Open Graph and Twitter metadata retain secure image URL, MIME type, dimensions, alternative text, and `summary_large_image` card values.

## Admin and saved-data migration

The admin remains browser-local. It must support:

- Editing doctor identity, biography, qualifications, and experience copy.
- Editing, adding, and deleting services.
- Editing hospital name, address, timing, phone, map link, and visit type.
- Editing statistic value and label.
- Showing or hiding every statistic.

Migration is narrow and non-destructive:

- Replace a scalar only when it exactly matches a known old default.
- Replace legacy qualification entries only when they match the old default qualification set.
- Migrate known service and hospital fields by stable IDs and exact old values. Preserve any field the administrator changed.
- For a saved `Children treated` highlight that lacks `visible`, default to false and migrate the exact old `20,000+` value to `1000+`. Preserve a custom value but still initialize visibility to false.
- For other saved highlights without `visible`, use the matching new default when the ID is known and true for administrator-created highlights.
- Malformed or inaccessible browser storage falls back to the new defaults.

## Error handling

- The supplied local portrait remains the fallback when an admin photo URL is blank or fails to be provided.
- Empty public service, hospital, or visible-statistic lists retain the existing empty-state behavior where available and must not crash rendering.
- Unknown legacy values are preserved rather than guessed.
- Government availability is never converted into a private appointment claim.

## Verification

- Unit-test all new defaults: name, title, credentials, biography, qualifications, statistics, nine services, three hospitals, visit types, and timings.
- Test exact-default migration and preservation of administrator-customized fields.
- Test missing-statistic visibility migration and public filtering.
- Test the `1000+ Children treated` statistic is hidden by default and becomes visible when enabled.
- Test the social banner source contains the approved surgical text and the exported JPEG remains exactly `1200 × 630`.
- Test the canonical SEO URL, title, description, image URL, type, and dimensions.
- Test prerendered GitHub Pages HTML contains the new crawler-visible metadata and project base path.
- Scan public source and README content to ensure obsolete FCPS, Consultant Pediatrician / Child Specialist, vaccination, allergy, nutrition, placeholder hospital, and old-statistic claims are removed. Historical specs and Git history are excluded from this scan.
- Run the complete unit test suite, GitHub Pages tests, TypeScript, lint, and production build.

## Out of scope

- Changing the official email, phone, WhatsApp number, portrait, favicon, canonical GitHub Pages URL, deployment workflow, or repository history.
- Publishing claims not supplied by the user, including exact patient outcomes, guaranteed painlessness, personal 24-hour availability, or appointment guarantees at Mayo Hospital.
- Removing the existing browser-local admin model or adding a server/database.
