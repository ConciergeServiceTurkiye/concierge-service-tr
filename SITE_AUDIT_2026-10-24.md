# Concierge Service Türkiye — Site Audit
Date: 2026-10-24
Repository: https://github.com/ConciergeServiceTurkiye/concierge-service-tr
Production domain: https://www.conciergeservice.com.tr/
Audit branch: audit/site-wide-review-2026-10-24
Production branch `main` was not modified.

## Executive summary
The site has a solid static-site foundation and existing SEO metadata, a sitemap, robots.txt, service catalogues, a trip-planning flow, and contact/booking forms. The highest-priority risks are URL/canonical consistency, inconsistent vehicle capacity claims, and lack of verifiable success feedback in the restaurant reservation form. No production files were changed during this audit.

## Findings (prioritized)

### P1 — Canonical URL and sitemap consistency
- Source: `index.html` canonical points to `https://www.conciergeservice.com.tr/`.
- Source: `airport-transfer.html` canonical and Open Graph URL point to `https://www.conciergeservice.com.tr/airport-transfer.html`; the sitemap also lists .html URLs.
- Live check: opening `https://www.conciergeservice.com.tr/airport-transfer.html` redirects to `https://www.conciergeservice.com.tr/airport-transfer`.
- Risk: canonical tags and sitemap may advertise redirecting URLs instead of the final URL. This should be checked across all sitemap URLs before changing anything.
- Recommended fix: establish one final URL policy; align canonical, og:url, JSON-LD URLs, sitemap entries and internal links to the final 200-response URLs. Verify status codes and redirect chains before deploying.

### P1 — Vehicle capacity mismatch
- Live Airport Transfer page lists Mercedes-Benz V-Class VIP at up to 6 passengers.
- Live Chauffeur Service page lists Mercedes-Benz V-Class VIP at up to 7 guests.
- Risk: customer expectations and operational accuracy.
- Recommended fix: confirm the actual vehicle configuration with the operator; distinguish configurations if they genuinely differ, otherwise use one verified capacity consistently across pages and forms.

### P1 — Restaurant form may display a false-positive success state
- Source: `js/restaurants.js` posts to Google Apps Script using `mode: "no-cors"`.
- The promise handler shows “Reservation received” for any resolved fetch; an opaque no-cors response cannot confirm the HTTP/application result.
- Risk: the guest may be told a reservation was received even if the endpoint did not process it successfully.
- Recommended fix: inspect the Apps Script endpoint and test end-to-end first. Prefer a response path that confirms application-level acceptance. If CORS cannot be safely enabled, change the UI wording so it does not claim verified receipt, and provide a clear fallback/support route. Do not change backend assumptions without testing.

### P2 — Homepage service hierarchy and conversion paths
- Source: `index.html` has six main service cards: airport transfer, meet & greet, chauffeur, private tours/guides, hotels & dining, Turkish baths & experiences. Yacht experiences appear further down the page.
- Opportunity: bring high-intent services (private yacht/Bosphorus, private guide, restaurant reservations) into clearer entry points, with service-specific CTA and request flows.
- Recommended fix: decide service priorities using Search Console and conversion data before major homepage redesign; test mobile first.

### P2 — Structured data completeness
- Source: homepage JSON-LD includes Organization and WebSite, but `sameAs` is empty.
- Recommended fix: add only verified official social profiles and public business profiles. Validate JSON-LD; add page-specific schema only when it accurately describes visible content.

### P2 — Contact form success and failure handling
- Source: `js/contact.js` checks the FormSubmit response and handles errors; WhatsApp flow explicitly tells the visitor they must press Send in WhatsApp. This is a positive pattern to preserve.
- Recommended fix: test the real form on desktop/mobile, including email rejection, popup blocking, keyboard validation, duplicate clicks, and whether requests arrive at the intended inbox.

### P2 — Mobile, accessibility and performance
- Code review has not established real Core Web Vitals or a full keyboard/screen-reader result.
- Recommended checks: PageSpeed Insights / Lighthouse mobile; image payload and lazy-loading; tap target sizes; focus visibility; mobile navigation; dialog focus management; labels and error announcements; no horizontal overflow.
- Do not claim these tests passed until measured.

### P2 — Sitemap and robots production verification
- Source files exist in the repository: `sitemap.xml` and `robots.txt`.
- The browser inspection tool could not retrieve those exact live text endpoints, so their production availability/content remains unverified here.
- Recommended fix: verify HTTP 200 and correct content in a normal browser or command-line request, then inspect sitemap URLs for redirects, 404s, duplicates, and noindex pages.

## Existing strengths to preserve
- Homepage has title, description, canonical, Open Graph, Twitter card and Organization/WebSite JSON-LD.
- A sitemap and robots.txt are present in the repository.
- The site has distinct service pages and a “Plan Your Stay” trip-planning flow.
- Contact form includes explicit validation and a WhatsApp handoff message.
- The Meet & Greet page distinguishes airport assistance from a private car transfer and qualifies variable inclusions.

## Implementation order
1. Establish URL policy and crawl all sitemap URLs; document redirect/status/canonical mismatches.
2. Confirm authoritative vehicle capacities and fix inconsistencies.
3. Test restaurant form end-to-end; correct success/failure semantics based on backend capabilities.
4. Run a representative page inventory for title, meta description, canonical, H1, indexability, internal links, image alt text, and structured data; then extend across all URLs.
5. Test mobile UX and performance with measurements; fix critical issues before cosmetic changes.
6. Improve high-intent service discovery and CTA paths, guided by Search Console and conversion data.
7. Validate all changes on this branch/preview before any production merge.

## Scope and limitations
This is a code and live-page evidence-based initial audit, not yet a complete automated crawl of every URL or a measured Lighthouse/Search Console report. No live production files, hosting settings, DNS, or backend Apps Script code were changed or accessed. No claim is made that a form, sitemap, or performance metric passed a full end-to-end test.
