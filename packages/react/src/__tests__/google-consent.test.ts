import { describe, expect, it } from "vitest"
import {
  buildDefaultGoogleConsentState,
  buildGoogleConsentState,
} from "../google-consent"
import type { OpenCookieConfig } from "../types"

const config: OpenCookieConfig = {
  version: "1",
  categories: [
    { id: "necessary", label: "Necessary", required: true },
    { id: "analytics", label: "Analytics" },
    { id: "marketing", label: "Marketing" },
    { id: "preferences", label: "Preferences" },
  ],
  googleConsent: {
    enabled: true,
  },
}

describe("Google Consent Mode mapping", () => {
  it("denies optional Google storage signals before a saved choice exists", () => {
    expect(buildDefaultGoogleConsentState(config)).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
    })
  })

  it("maps saved OpenCookie choices to Google Consent Mode signals", () => {
    expect(
      buildGoogleConsentState(config, {
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: true,
      }),
    ).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "granted",
      security_storage: "granted",
    })
  })

  it("supports custom signal category mapping", () => {
    expect(
      buildGoogleConsentState(
        {
          ...config,
          googleConsent: {
            enabled: true,
            signals: {
              analytics_storage: "marketing",
            },
          },
        },
        {
          necessary: true,
          analytics: true,
          marketing: false,
          preferences: false,
        },
      )?.analytics_storage,
    ).toBe("denied")
  })
})
