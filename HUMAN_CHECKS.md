# Human Checks — Wave Books

Items from `ACTION-PLAN.md` that need a person, real values, credentials, or a live deploy before they can be completed.

## Blocking launch

- [ ] **Replace the App Store placeholder URL** (`ACTION-PLAN.md` #1, #3)
  - `idAPP_STORE_ID` is a placeholder in 11 spots across 6 files. Once you have the real App Store ID, one command fixes them all:
    ```sh
    grep -rl 'idAPP_STORE_ID' --include='*.html' --include='*.js' --include='*.json' . \
      | grep -v _site | xargs sed -i '' 's/idAPP_STORE_ID/id0000000000/g'
    ```
    (Swap `id0000000000` for the real `id1234567890`.)
  - Files touched: `config.json`, `script.js`, `index.html`, `_layouts/base.html`, `_includes/contact.html`. This also fixes the schema `downloadUrl` (#3).

## Needs real data (non-blocking)

- [ ] **Add `sameAs` social/profile links** to the homepage schema (`ACTION-PLAN.md` #3, #7).
  - When enriching `index.html` with an `Organization` node, fill `sameAs` with real URLs (e.g. Mastodon, X, GitHub, App Store publisher page) if available.
- [ ] **Confirm the publisher/developer legal name.** Schema currently uses `"Wave Books"` as the Organization name. Replace if the App Store developer entity differs.

## Needs a live deploy + credentials

- [ ] **Confirm production headers & field performance** (`ACTION-PLAN.md` #8).
  - Once `https://wavebooks.app/` is live, verify: HTTPS, HSTS, gzip/brotli compression, cache headers.
  - Run PageSpeed Insights / CrUX / Google Search Console for real-user Core Web Vitals. Needs the Google API credentials that were unavailable during the audit.
