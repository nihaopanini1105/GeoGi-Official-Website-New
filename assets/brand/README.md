# GeoGi Logo System v1.0

Frozen: 2026-08-13

This package is the canonical logo source for the entire GeoGi project: Mini Program, official website, GeoGi OS, PDF reports, content images, social platforms, favicons, avatars and app icons.

## Canonical rule
- Wordmark: `GeoGi`
- Wordmark weight: Regular / 400. Never bold.
- Primary light-background logo: `geogi-logo-horizontal-navy`
- Dark-background logo: `geogi-logo-horizontal-white`
- Narrow layouts: vertical lockup
- App / Mini Program / avatar / favicon: icon only
- No white backing card behind the logo.
- Never use legacy `dark/core/mark_dark` assets.
- Never let generative AI redraw or approximate the logo after this version is frozen.
- Never stretch, rotate, recolor, change ring geometry, move the orbit dot, or change wordmark weight.

## Source of truth
Every GeoGi repository should copy or sync this package into `assets/brand/` and keep `manifest.json`. Any replacement requires a new logo-system version.
