# SwipeStart Offline Million Catalog

SwipeStart now uses a deterministic offline catalog of **1,000,000 startup ideas**.

- 200,000 AI ideas
- 200,000 Consumer ideas
- 200,000 SaaS ideas
- 200,000 Creator ideas
- 200,000 Local ideas
- No API calls
- No account required
- No network required after the web app is cached
- Stable idea IDs from 1 to 1,000,000

`ideas-v2.js` contains the compact renderer and catalog definition. Each permanent ID maps to a fixed combination of target user, problem, mechanism, twist, outcome, business model and metadata. This lets the browser/iPhone render a million fixed cards without loading a million JavaScript objects into RAM.

`sw.js` caches the web build for offline use. For the native TestFlight build, the same catalog can be bundled as a compact SQLite index and rendered with the same deterministic rules.
