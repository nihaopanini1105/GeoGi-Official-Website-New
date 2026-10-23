# GeoGi Official Website — Repo Agent Rules

This repo owns GeoGi's public website, research center pages, SEO/GEO-readable site content, responsive visuals and public customer journeys. It does NOT implement GeoGi-OS's AI diagnosis, M10 persistence or unverified scoring. Respect existing website baseline, approved Logo/VI, semantic HTML and mobile design; do not re-create or recolor the brand logo.

For each feature validate the complete public flow on desktop and mobile: real content -> URL/rendered HTML -> accessibility/SEO/schema as applicable -> responsive display -> navigation/forms/links -> failure states -> direct browser check. Preserve existing public URLs and authoritative research claims unless reviewed.

## GeoGi Shared Engineering Operating Rules (review candidate, 2026-10-23)

These rules complement this repository's README, existing approved skills/ADRs and product contracts; they do not override them. The cross-project workflow is documented in the GeoGi-OS development branch:
https://github.com/nihaopanini1105/GeoGi-OS/blob/feat/r03-diagnostic-intelligence-data-engine/docs/development/GEOGI_UNIFIED_ENGINEERING_WORKFLOW.md

1. BEFORE modifying files: verify repository identity, branch, exact HEAD, dirty state, current scope/ownership and applicable local documents. Never assume code or evidence from GeoGi-OS belongs in this repository.
2. Deliver complete observable user workflows (real input -> persistence/processing -> working UI or output -> scoped authorization -> failure/rollback -> test), rather than claiming individual commits, cards, static pages or screenshots as finished features.
3. Keep production and public-facing data unchanged until local tests, regression review, backups/recovery where applicable, and explicit release approval. Do not introduce GitHub Actions as a GeoGi development/test/deploy mechanism.
4. Run repository-appropriate direct tests in its authorized environment. Record real command, exact commit SHA, PASS/FAIL/NOT_RUN, logs and evidence outside checkout. A previous SHA's PASS never certifies the next commit.
5. Codex uses this AGENTS.md as its persistent repo contract; ChatGPT successors must read the latest GitHub branch/Handoff and not restart work from an obsolete SHA. Near tool/quota exhaustion, commit and push safe results, document dirty/unpushed changes and exact next steps.
6. Do not copy the GeoGi-OS Python3.12/PG16/M10 test gate into this repo unless a reviewed local requirement calls for it. No fabricated live platform/source status or production claims.
