# Plausible

Use this recipe to load Plausible only after the user grants analytics consent.

Plausible is popular with indie hackers and privacy-conscious teams. OpenCookie can gate Plausible the same way it gates any optional analytics script: no analytics category consent, no script render.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

## Install

```bash
yarn add @opencookie/react
```

## 1. Add The Provider

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

The default OpenCookie config already includes an `analytics` category. Create `open-cookie.config.ts` only if you want custom labels, descriptions, versions, or category IDs.

## 2. Gate Plausible

Create a small client component for Plausible.

```tsx
// components/plausible-analytics.tsx
"use client"

import { OpenCookieGate } from "@opencookie/react"

export function PlausibleAnalytics() {
  return (
    <OpenCookieGate category="analytics">
      <script
        defer
        data-domain="example.com"
        src="https://plausible.io/js/script.js"
      />
    </OpenCookieGate>
  )
}
```

Render it inside the provider:

```tsx
// app/layout.tsx
import { PlausibleAnalytics } from "../components/plausible-analytics"

// ...
<OpenCookieProvider>
  {children}
  <PlausibleAnalytics />
  <OpenCookieBanner />
</OpenCookieProvider>
```

Replace `example.com` with the domain configured in Plausible.

## Site-Specific Plausible Snippets

Plausible may give you a site-specific snippet such as `https://plausible.io/js/pa-XXXXX.js`, especially when using newer script options, enhanced measurements, or a proxy setup.

Use the snippet Plausible gives you and keep it inside `OpenCookieGate`:

```tsx
<OpenCookieGate category="analytics">
  <script async src="https://plausible.io/js/pa-XXXXX.js" />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};
        plausible.init=plausible.init||function(i){plausible.o=i||{}};
        plausible.init();
      `,
    }}
  />
</OpenCookieGate>
```

The exact snippet may differ. Treat Plausible as the source of truth for the script content; OpenCookie is responsible for deciding when it renders.

## What Happens

Before the user chooses:

- The banner appears.
- `analytics` consent defaults to denied.
- The Plausible script does not render.
- No Plausible script request is made by this component.

If the user rejects:

- The choice is stored locally.
- Plausible stays blocked.

If the user accepts analytics:

- The choice is stored locally.
- `OpenCookieGate` renders the Plausible script.
- Plausible can start collecting analytics according to your Plausible setup.

## Common Mistakes

Do not put the Plausible script directly in `app/head.tsx`, `next/head`, or a layout `<head>` if you want OpenCookie to gate it:

```tsx
// Wrong: this loads before OpenCookie can check consent.
<script defer data-domain="example.com" src="https://plausible.io/js/script.js" />
```

Do not omit the category:

```tsx
// Wrong: OpenCookieGate requires an explicit category.
<OpenCookieGate>
  <PlausibleAnalytics />
</OpenCookieGate>
```

If you use `next-plausible`, make sure the provider itself is only rendered after consent. Otherwise it may load Plausible before OpenCookie can gate it.

## References

- [Plausible script docs](https://plausible.io/docs/plausible-script)
- [Plausible Next.js integration](https://plausible.io/docs/nextjs-integration)
- [Plausible script update guide](https://plausible.io/docs/script-update-guide)
