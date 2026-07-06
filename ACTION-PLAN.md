# Wave Books SEO Action Plan

## Critical

No critical crawl/indexing blockers were found in the local/prod-build evidence.

## High

1. Replace the App Store placeholder URL everywhere.
   - Evidence: `idAPP_STORE_ID` appears in production HTML, `config.json`, `script.js`, and homepage `SoftwareApplication.downloadUrl`.
   - Impact: Broken conversion path, weak structured data, and poor crawler/user trust.
   - Effort: Small.
   - Files to update: `config.json`, `script.js`, `index.html`, `_layouts/base.html`, `_includes/contact.html`.

2. Add FAQ structured data to the support page.
   - Evidence: `pages/support.md` contains FAQ front matter, but `/support.html` has no JSON-LD.
   - Impact: Better structured eligibility and answer extraction for support queries.
   - Effort: Medium.
   - Suggested implementation: Generate `FAQPage` JSON-LD from the existing `faqs` front matter in `_layouts/support.html`.

3. Enrich homepage software/brand schema.
   - Evidence: only `SoftwareApplication` is present, and its `downloadUrl` is a placeholder.
   - Impact: Improves product entity clarity for Google and AI search.
   - Effort: Small to medium.
   - Add: real download URL, `publisher`, `image`, `screenshot`, `sameAs` links if available, and optionally `Organization`/`WebSite`.

## Medium

4. Refresh or automate sitemap `lastmod`.
   - Evidence: sitemap lists `2026-06-30`, while source pages were edited on `2026-07-05`.
   - Impact: Reduces stale crawl signals.
   - Effort: Small.

5. Expand homepage discovery copy.
   - Evidence: parsed homepage text is about 245 words.
   - Impact: Better relevance for non-branded queries.
   - Effort: Medium.
   - Add concise copy around "offline audiobook player for iPhone", DRM-free M4B/MP3/M4A, iCloud Drive import, AudiobookShelf, Jellyfin, and privacy.

6. Add share metadata to support/legal pages.
   - Evidence: only homepage has OG/Twitter metadata.
   - Impact: Better previews and clearer metadata if support/legal pages are shared or surfaced directly.
   - Effort: Small.

7. Add entity/trust signals.
   - Evidence: limited publisher/developer identity beyond email and policies.
   - Impact: Better E-E-A-T and AI citation confidence.
   - Effort: Medium.
   - Add a brief publisher/about block and link sameAs profiles if available.

8. Confirm live production headers and field performance.
   - Evidence: local WEBrick headers are not production evidence; Google API credentials were unavailable.
   - Impact: Verifies HTTPS, caching, compression, HSTS, and real-user CWV.
   - Effort: Small once production URL/API access is available.

## Low

9. Normalize internal URLs.
   - Evidence: mix of `/`, `index.html#features`, and relative page links.
   - Impact: Cleaner crawl graph and less duplication risk.
   - Effort: Small.

10. Remove or exclude unused large PNG screenshot originals from production output if not needed.
    - Evidence: `assets/screenshots/player.PNG` is about 4.7 MB and PNG originals total several MB.
    - Impact: Smaller deploy artifacts and fewer accidentally indexable heavy assets.
    - Effort: Small.

11. Add `llms.txt` or a concise AI-readable product summary.
    - Evidence: no `llms.txt` found.
    - Impact: Better AI crawler and assistant extraction support.
    - Effort: Small.

## Suggested Sequence

1. Fix App Store URL placeholders.
2. Add support FAQ schema.
3. Refresh sitemap dates.
4. Enrich homepage schema and metadata.
5. Expand homepage/support copy for non-branded discovery.
6. Run live production checks with PageSpeed/CrUX/GSC once credentials are available.

