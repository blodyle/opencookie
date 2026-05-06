import { createRejectAllChoices } from "./storage"
import type {
  ConsentChoices,
  GoogleConsentModeConfig,
  GoogleConsentSignal,
  GoogleConsentSignalMapping,
  OpenCookieConfig,
} from "./types"

type GoogleConsentValue = "granted" | "denied"

export type GoogleConsentState = Record<GoogleConsentSignal, GoogleConsentValue>

const defaultSignalMapping: Required<GoogleConsentSignalMapping> = {
  ad_storage: "marketing",
  ad_user_data: "marketing",
  ad_personalization: "marketing",
  analytics_storage: "analytics",
  functionality_storage: "preferences",
  personalization_storage: "preferences",
  security_storage: true,
}

function getGoogleConsentConfig(
  config: OpenCookieConfig,
): GoogleConsentModeConfig | null {
  if (config.googleConsent === false) return null

  return {
    enabled: true,
    ...config.googleConsent,
  }
}

export function buildGoogleConsentState(
  config: OpenCookieConfig,
  choices: ConsentChoices,
): GoogleConsentState | null {
  const googleConsent = getGoogleConsentConfig(config)

  if (!googleConsent?.enabled) return null

  const signals = {
    ...defaultSignalMapping,
    ...googleConsent.signals,
  }

  return Object.fromEntries(
    Object.entries(signals).map(([signal, categoryId]) => [
      signal,
      categoryId === true || choices[categoryId] === true ? "granted" : "denied",
    ]),
  ) as GoogleConsentState
}

export function buildDefaultGoogleConsentState(
  config: OpenCookieConfig,
): GoogleConsentState | null {
  return buildGoogleConsentState(config, createRejectAllChoices(config))
}

export function applyGoogleConsentDefault(config: OpenCookieConfig): void {
  const googleConsent = getGoogleConsentConfig(config)
  const state = buildDefaultGoogleConsentState(config)

  if (!googleConsent?.enabled || !state) return

  const defaultState =
    typeof googleConsent.waitForUpdate === "number"
      ? { ...state, wait_for_update: googleConsent.waitForUpdate }
      : state

  pushGoogleConsentCommand("default", defaultState)
}

export function applyGoogleConsentUpdate(
  config: OpenCookieConfig,
  choices: ConsentChoices,
): void {
  const state = buildGoogleConsentState(config, choices)

  if (!state) return

  pushGoogleConsentCommand("update", state)
}

function pushGoogleConsentCommand(
  command: "default" | "update",
  state: GoogleConsentState | (GoogleConsentState & { wait_for_update: number }),
): void {
  if (typeof window === "undefined") return

  window.dataLayer = window.dataLayer ?? []
  window.gtag =
    window.gtag ??
    function gtag() {
      window.dataLayer?.push(arguments)
    }

  window.gtag("consent", command, state)
}
