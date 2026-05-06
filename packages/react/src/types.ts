export type ConsentCategoryId = string

export type ConsentStatus = "loading" | "pending" | "saved"

export type ConsentChoices = Record<ConsentCategoryId, boolean>

export interface OpenCookieCategory {
  id: ConsentCategoryId
  label: string
  description?: string
  required?: boolean
}

export type GoogleConsentSignal =
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage"
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage"

export type GoogleConsentSignalMapping = Partial<
  Record<GoogleConsentSignal, ConsentCategoryId | true>
>

export interface GoogleConsentModeConfig {
  enabled?: boolean
  waitForUpdate?: number
  signals?: GoogleConsentSignalMapping
}

export interface OpenCookieConfig {
  version: string
  categories: OpenCookieCategory[]
  storageKey?: string
  googleConsent?: GoogleConsentModeConfig | false
}

export type OpenCookieConfigInput = Partial<OpenCookieConfig>

export interface OpenCookieStoredConsent {
  version: string
  choices: ConsentChoices
  updatedAt: string
}

export interface OpenCookieContextValue {
  categories: OpenCookieCategory[]
  choices: ConsentChoices
  status: ConsentStatus
  isLoaded: boolean
  isSettingsOpen: boolean
  shouldShowBanner: boolean
  acceptAll: () => void
  rejectAll: () => void
  saveChoices: (choices: ConsentChoices) => void
  resetConsent: () => void
  openSettings: () => void
  closeSettings: () => void
  hasConsent: (categoryId: ConsentCategoryId) => boolean
}

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}
