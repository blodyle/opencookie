# Settings Link In A Footer

Use this recipe when you want visitors to reopen cookie preferences after their first choice.

OpenCookie includes `OpenCookieSettingsButton` for the simple case and `useOpenCookie` for custom links or menu items.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

## Simple Button

Render `OpenCookieSettingsButton` anywhere inside `OpenCookieProvider`.

```tsx
// components/footer.tsx
"use client"

import { OpenCookieSettingsButton } from "@opencookie/react"

export function Footer() {
  return (
    <footer>
      <a href="/privacy">Privacy</a>
      <OpenCookieSettingsButton>
        Cookie settings
      </OpenCookieSettingsButton>
    </footer>
  )
}
```

Keep `OpenCookieBanner` mounted in your layout. When the settings button opens preferences, the banner switches to the preferences view.

```tsx
// app/layout.tsx
import { OpenCookieBanner, OpenCookieProvider } from "@opencookie/react"
import { Footer } from "../components/footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider>
          {children}
          <Footer />
          <OpenCookieBanner />
        </OpenCookieProvider>
      </body>
    </html>
  )
}
```

## Custom Footer Link

If your footer design needs an anchor-style control, use a button styled like a link. That keeps the action accessible without pretending to navigate.

```tsx
// components/cookie-settings-link.tsx
"use client"

import { useOpenCookie } from "@opencookie/react"

export function CookieSettingsLink() {
  const consent = useOpenCookie()

  return (
    <button
      type="button"
      className="footer-link"
      onClick={consent.openSettings}
    >
      Cookie settings
    </button>
  )
}
```

Then render it in your footer:

```tsx
// components/footer.tsx
import { CookieSettingsLink } from "./cookie-settings-link"

export function Footer() {
  return (
    <footer>
      <a href="/privacy">Privacy</a>
      <CookieSettingsLink />
    </footer>
  )
}
```

## Resetting Consent For Demos

For demos and local testing, you can expose `resetConsent`. Avoid showing this as a normal production footer action unless you want visitors to clear their saved choice.

```tsx
"use client"

import { useOpenCookie } from "@opencookie/react"

export function ResetConsentButton() {
  const consent = useOpenCookie()

  return (
    <button type="button" onClick={consent.resetConsent}>
      Reset consent
    </button>
  )
}
```

## Common Mistakes

Do not render a settings button outside `OpenCookieProvider`:

```tsx
// Wrong: OpenCookieSettingsButton needs OpenCookieProvider above it.
<OpenCookieSettingsButton />
```

Do not use a normal link with an empty `href`:

```tsx
// Wrong: this is an action, not navigation.
<a href="">Cookie settings</a>
```

Use a button for the action, then style it to match your footer.
