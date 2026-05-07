import { OpenCookieGate, OpenCookieSettingsButton } from "@opencookie/react"
import { ResetConsentButton } from "../components/reset-consent-button"

export default function Page() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">OpenCookie example</p>
        <h1>Consent-gated loading for Next.js.</h1>
        <p>
          The analytics placeholder below only renders after the visitor grants
          analytics consent.
        </p>
        <div className="actions">
          <OpenCookieSettingsButton className="settings-button" />
          <ResetConsentButton />
        </div>
      </section>

      <section className="demo">
        <h2>Analytics gate</h2>
        <OpenCookieGate
          category="analytics"
          fallback={<p className="blocked">Analytics is blocked.</p>}
        >
          <p className="loaded">Analytics can load now.</p>
          <script
            async
            data-example="analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
          />
        </OpenCookieGate>
      </section>
    </main>
  )
}
