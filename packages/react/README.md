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

Use `<OpenCookieBanner layout="dialog" />` for a more prominent dialog with a darker backdrop.

OpenCookie helps implement consent-gated loading. It does not provide legal advice or guarantee compliance.

Full docs: https://github.com/blodyle/opencookie
