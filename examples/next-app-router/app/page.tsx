import { OpenCookieSettingsButton } from "@opencookie/react"
import { AnalyticsGateDemo } from "../components/analytics-gate-demo"
import { BannerDemoControls } from "../components/banner-demo-controls"
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
        <BannerDemoControls />
      </section>

      <section className="demo">
        <h2>Analytics gate</h2>
        <AnalyticsGateDemo />
      </section>
    </main>
  )
}
