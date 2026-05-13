# @opencookie/react

Tiny, frontend-only consent gating for React and Next.js apps.

OpenCookie helps developers block analytics, pixels, widgets, and optional components until the user gives consent. It has no backend, no dashboard, no telemetry, and no hosted API.

```bash
yarn add @opencookie/react
```

```tsx
import {
  OpenCookieBanner,
  OpenCookieGate,
  OpenCookieProvider,
} from "@opencookie/react"

export function App() {
  return (
    <OpenCookieProvider>
      <OpenCookieGate category="analytics">
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" />
      </OpenCookieGate>
      <OpenCookieBanner tone="playful" />
    </OpenCookieProvider>
  )
}
```

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

Recipes:

- [Custom banner with `useOpenCookie`](https://github.com/blodyle/opencookie/blob/main/docs/custom-banner.md)
- [Settings link in a footer](https://github.com/blodyle/opencookie/blob/main/docs/settings-link.md)
- [Google Analytics](https://github.com/blodyle/opencookie/blob/main/docs/google-analytics.md)
- [Plausible](https://github.com/blodyle/opencookie/blob/main/docs/plausible.md)

Full docs: [github.com/blodyle/opencookie](https://github.com/blodyle/opencookie)

Made by [Guidelamego](https://guidelamego.com).
