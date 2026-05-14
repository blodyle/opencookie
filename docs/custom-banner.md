# Custom Banner With `useOpenCookie`

Use this recipe when you want OpenCookie's consent state, storage, version invalidation, required categories, and Google Consent Mode updates, but you want to render your own banner.

The default `OpenCookieBanner` is optional. Your UI can be as small or as branded as your app needs.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

## 1. Add The Provider

```tsx
// app/layout.tsx
import { OpenCookieProvider } from "@opencookie/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider>{children}</OpenCookieProvider>
      </body>
    </html>
  )
}
```

## 2. Create A Minimal Banner

```tsx
// components/cookie-banner.tsx
"use client"

import { useOpenCookie } from "@opencookie/react"

export function CookieBanner() {
  const consent = useOpenCookie()

  if (!consent.shouldShowBanner) return null

  return (
    <section aria-label="Cookie consent">
      <h2>Cookie choices</h2>
      <p>
        We use optional cookies for analytics. You can accept them, reject them,
        or choose by category.
      </p>

      <button type="button" onClick={consent.rejectAll}>
        Reject optional
      </button>
      <button type="button" onClick={consent.acceptAll}>
        Accept all
      </button>
    </section>
  )
}
```

Render it inside the provider:

```tsx
// app/layout.tsx
import { OpenCookieProvider } from "@opencookie/react"
import { CookieBanner } from "../components/cookie-banner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider>
          {children}
          <CookieBanner />
        </OpenCookieProvider>
      </body>
    </html>
  )
}
```

## 3. Add A Preferences View

Add a customize button when you want users to choose by category. `openSettings` sets `consent.isSettingsOpen` to `true`, and `consent.categories` gives you the configured category list.

```tsx
// components/cookie-banner.tsx
"use client"

import { useEffect, useState } from "react"
import { useOpenCookie, type ConsentChoices } from "@opencookie/react"

export function CookieBanner() {
  const consent = useOpenCookie()
  const [draftChoices, setDraftChoices] = useState<ConsentChoices>(
    consent.choices,
  )

  useEffect(() => {
    setDraftChoices(consent.choices)
  }, [consent.choices])

  if (!consent.shouldShowBanner && !consent.isSettingsOpen) return null

  function updateChoice(categoryId: string, checked: boolean) {
    setDraftChoices((current) => ({
      ...current,
      [categoryId]: checked,
    }))
  }

  return (
    <section aria-label="Cookie consent">
      <h2>Cookie choices</h2>
      <p>Choose which optional tools can load.</p>

      {consent.isSettingsOpen ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            consent.saveChoices(draftChoices)
          }}
        >
          {consent.categories.map((category) => (
            <label key={category.id}>
              <input
                type="checkbox"
                checked={category.required || draftChoices[category.id] === true}
                disabled={category.required}
                onChange={(event) =>
                  updateChoice(category.id, event.currentTarget.checked)
                }
              />
              {category.label}
            </label>
          ))}

          <button type="submit">Save choices</button>
        </form>
      ) : (
        <>
          <button type="button" onClick={consent.rejectAll}>
            Reject optional
          </button>
          <button type="button" onClick={consent.openSettings}>
            Customize
          </button>
          <button type="button" onClick={consent.acceptAll}>
            Accept all
          </button>
        </>
      )}
    </section>
  )
}
```

## What To Keep

- Keep `OpenCookieProvider` above your banner and gated components.
- Keep optional scripts and widgets inside `OpenCookieGate`.
- Keep required categories disabled in your preferences UI.
- Use `consent.saveChoices` instead of writing to storage directly.
- Use your own CSS, layout, and copy.

## Common Mistakes

Do not show your custom banner outside the provider:

```tsx
// Wrong: useOpenCookie needs OpenCookieProvider above it.
<CookieBanner />
<OpenCookieProvider>{children}</OpenCookieProvider>
```

Do not store consent yourself:

```tsx
// Wrong: this bypasses OpenCookie storage, versioning, and integrations.
localStorage.setItem("cookie-consent", "accepted")
```

Do not call `acceptAll` from a close button unless that is really the choice you want to save. If the visitor closes the banner without choosing, keep `consent.shouldShowBanner` true or make your own decision explicit.
