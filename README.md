# OpenCookie

[![CI](https://github.com/blodyle/opencookie/actions/workflows/ci.yml/badge.svg)](https://github.com/blodyle/opencookie/actions/workflows/ci.yml)
[![npm alpha](https://img.shields.io/npm/v/%40opencookie%2Freact/alpha?label=npm%20alpha)](https://www.npmjs.com/package/@opencookie/react)
[![license](https://img.shields.io/npm/l/%40opencookie%2Freact)](https://github.com/blodyle/opencookie/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/%40opencookie%2Freact?label=minzip)](https://bundlephobia.com/package/@opencookie/react)
[![telemetry](https://img.shields.io/badge/telemetry-none-111111)](https://github.com/blodyle/opencookie#what-opencookie-is-not)

Tiny, frontend-only consent gating for Next.js and React apps.

OpenCookie helps developers block analytics, pixels, widgets, and other optional components until the user gives consent. It has no backend, no dashboard, no telemetry, and no hosted API.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

Try the live demo: [blodyle.github.io/opencookie](https://blodyle.github.io/opencookie/)

## Install

```bash
yarn add @opencookie/react
```

## Basic Next.js App Router Setup

Add the provider and default banner:

```tsx
// app/layout.tsx
import { OpenCookieBanner, OpenCookieProvider } from "@opencookie/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider>
          {children}
          <OpenCookieBanner />
        </OpenCookieProvider>
      </body>
    </html>
  )
}
```

`config` is optional. When no config is passed, OpenCookie uses the built-in categories:

- `necessary`, required and always granted
- `analytics`
- `marketing`
- `preferences`

Before the user chooses, optional categories are denied by default.

## Custom Config

Create `open-cookie.config.ts` when you want to customize categories, labels, descriptions, versioning, storage, or Google Consent Mode mapping.

`defineOpenCookieConfig` is optional too. It gives you typed defaults and a clear place for coding agents to inspect consent behavior.

```ts
// open-cookie.config.ts
import { defineOpenCookieConfig } from "@opencookie/react/config"

export const openCookieConfig = defineOpenCookieConfig({
  version: "1",
  categories: [
    { id: "necessary", label: "Necessary", required: true },
    { id: "analytics", label: "Analytics" },
    { id: "marketing", label: "Marketing" },
  ],
  googleConsent: {
    enabled: true,
  },
})
```

Then pass it to the provider:

```tsx
// app/layout.tsx
import { OpenCookieBanner, OpenCookieProvider } from "@opencookie/react"
import { openCookieConfig } from "../open-cookie.config"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider config={openCookieConfig}>
          {children}
          <OpenCookieBanner />
        </OpenCookieProvider>
      </body>
    </html>
  )
}
```

Gate analytics or any optional child:

```tsx
import { OpenCookieGate } from "@opencookie/react"

export function Analytics() {
  return (
    <OpenCookieGate category="analytics">
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" />
    </OpenCookieGate>
  )
}
```

`OpenCookieGate` requires a category. This keeps gated scripts and components explicit:

```tsx
<OpenCookieGate category="marketing">
  <iframe src="https://www.youtube.com/embed/example" />
</OpenCookieGate>
```

The default banner can stay calm or use a lighter tone:

```tsx
<OpenCookieBanner tone="playful" />
```

## Bring Your Own UI

The default banner is optional. Build your own UI with `useOpenCookie`:

```tsx
"use client"

import { useOpenCookie } from "@opencookie/react"

export function CookieBanner() {
  const consent = useOpenCookie()

  if (!consent.shouldShowBanner) return null

  return (
    <div>
      <p>We use optional cookies for analytics.</p>
      <button onClick={consent.rejectAll}>Reject</button>
      <button onClick={consent.acceptAll}>Accept all</button>
    </div>
  )
}
```

## Google Consent Mode

When `googleConsent.enabled` is true, OpenCookie writes Google Consent Mode commands to `window.dataLayer`.

Before a saved choice exists, optional Google storage signals are denied. After consent is saved, OpenCookie sends an update based on the saved categories.

Default mapping:

| Google signal | OpenCookie category |
| --- | --- |
| `analytics_storage` | `analytics` |
| `ad_storage` | `marketing` |
| `ad_user_data` | `marketing` |
| `ad_personalization` | `marketing` |
| `functionality_storage` | `preferences` |
| `personalization_storage` | `preferences` |
| `security_storage` | always granted |

You can override this mapping in config.

## Recipes

- [Google Analytics](docs/google-analytics.md)
- [Plausible](docs/plausible.md)

## What OpenCookie Is Not

OpenCookie is not a full consent management platform. It does not include a backend, hosted dashboard, user accounts, remote config, cookie scanner, vendor scanner, IAB TCF, audit logs, cross-device sync, or legal compliance guarantees.
