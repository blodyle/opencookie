# Agent Instructions

OpenCookie is a tiny, frontend-only consent gate for React and Next.js apps.

Core rules:

- Keep OpenCookie small.
- Keep it frontend-only.
- Do not add telemetry.
- Do not add backend features.
- Do not add dashboards.
- Do not add external API calls.
- Do not add heavy dependencies.
- Do not make legal compliance claims.
- Do not force a specific UI.
- Prefer simple code.
- Prefer clear docs.
- Prefer good examples.
- Keep the package easy to understand.

Simplicity is a product feature. Do not expand OpenCookie into a consent management platform.

Tests should protect behavior contracts: consent storage, version invalidation, required categories, gate rendering, and Google Consent Mode updates.
