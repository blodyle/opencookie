"use client"

export {
  defineOpenCookieConfig,
  defaultOpenCookieConfig,
  getOptionalCategoryIds,
  getRequiredCategoryIds,
  resolveOpenCookieConfig,
} from "./config"
export {
  buildDefaultGoogleConsentState,
  buildGoogleConsentState,
} from "./google-consent"
export {
  clearStoredConsent,
  createAcceptAllChoices,
  createRejectAllChoices,
  normalizeChoices,
  readStoredConsent,
  writeStoredConsent,
} from "./storage"
export { OpenCookieBanner } from "./banner"
export { OpenCookieGate } from "./gate"
export { OpenCookieProvider, useOpenCookie } from "./provider"
export { OpenCookieSettingsButton } from "./settings-button"
export type { OpenCookieBannerLayout } from "./banner-types"
export type {
  ConsentCategoryId,
  ConsentChoices,
  ConsentStatus,
  GoogleConsentModeConfig,
  GoogleConsentSignal,
  GoogleConsentSignalMapping,
  OpenCookieCategory,
  OpenCookieConfig,
  OpenCookieConfigInput,
  OpenCookieContextValue,
  OpenCookieStoredConsent,
} from "./types"
