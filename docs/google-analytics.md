# Google Analytics

Use this recipe to load the Google tag only after the user grants analytics consent.

This is OpenCookie's recommended starting point for small Next.js apps. It follows the basic consent mode pattern: Google tags are blocked before the user chooses, and they load only after consent is granted.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

## Install

```bash
yarn add @opencookie/react
```

## 1. Configure OpenCookie

Create `open-cookie.config.ts` at the app root.

```ts
// open-cookie.config.ts
import { defineOpenCookieConfig } from "@opencookie/react/config"

export const openCookieConfig = defineOpenCookieConfig({
  version: "1",
  categories: [
    {
      id: "necessary",
      label: "Necessary",
      description: "Required for the site to work.",
      required: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Helps us understand site traffic.",
    },
  ],
  googleConsent: {
    enabled: true,
    waitForUpdate: 500,
  },
})
```

With this config, OpenCookie sends Google Consent Mode defaults with analytics denied before a saved choice exists. When the user accepts analytics, OpenCookie sends a consent update.

## 2. Add The Provider

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

## 3. Gate Google Analytics

Create a small client component for the Google tag.

```tsx
// components/google-analytics.tsx
"use client"

import { OpenCookieGate } from "@opencookie/react"

export function GoogleAnalytics() {
  const measurementId = "G-XXXXXXXXXX"

  return (
    <OpenCookieGate category="analytics">
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </OpenCookieGate>
  )
}
```

Then render it inside the provider:

```tsx
// app/layout.tsx
import { GoogleAnalytics } from "../components/google-analytics"

// ...
<OpenCookieProvider config={openCookieConfig}>
  {children}
  <GoogleAnalytics />
  <OpenCookieBanner />
</OpenCookieProvider>
```

## What Happens

Before the user chooses:

- The banner appears.
- `analytics` consent defaults to denied.
- The Google Analytics scripts do not render.
- No Google Analytics script request is made by this component.

If the user rejects:

- The choice is stored locally.
- The Google Analytics scripts stay blocked.

If the user accepts analytics:

- The choice is stored locally.
- OpenCookie sends a Google Consent Mode update.
- The `OpenCookieGate` renders the Google Analytics scripts.

## Common Mistakes

Do not put Google Analytics outside `OpenCookieGate`:

```tsx
// Wrong: this loads before consent.
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
```

Do not omit the category:

```tsx
// Wrong: OpenCookieGate requires an explicit category.
<OpenCookieGate>
  <GoogleAnalytics />
</OpenCookieGate>
```

Do not call this legal compliance by itself. OpenCookie helps with consent-gated loading, but your cookie text, privacy policy, regional rules, and legal basis are still your responsibility.

## Notes

Google documents two consent mode patterns:

- Basic consent mode blocks Google tags until the user interacts with the banner.
- Advanced consent mode loads Google tags with denied defaults before the user chooses.

This recipe uses the basic pattern because OpenCookie is designed to prevent optional scripts from loading until consent is granted.

## References

- [Google Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode)
- [Set up consent mode on websites](https://developers.google.com/tag-platform/security/guides/consent)
- [Google tag API reference](https://developers.google.com/tag-platform/gtagjs/reference)
