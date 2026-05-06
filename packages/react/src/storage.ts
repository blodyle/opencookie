import {
  getOptionalCategoryIds,
  getRequiredCategoryIds,
  getStorageKey,
} from "./config"
import type {
  ConsentChoices,
  OpenCookieConfig,
  OpenCookieStoredConsent,
} from "./types"

export function createAcceptAllChoices(config: OpenCookieConfig): ConsentChoices {
  return Object.fromEntries(
    config.categories.map((category) => [category.id, true]),
  )
}

export function createRejectAllChoices(config: OpenCookieConfig): ConsentChoices {
  return Object.fromEntries([
    ...getRequiredCategoryIds(config).map((categoryId) => [categoryId, true]),
    ...getOptionalCategoryIds(config).map((categoryId) => [categoryId, false]),
  ])
}

export function normalizeChoices(
  config: OpenCookieConfig,
  choices: ConsentChoices,
): ConsentChoices {
  return Object.fromEntries(
    config.categories.map((category) => [
      category.id,
      category.required ? true : choices[category.id] === true,
    ]),
  )
}

export function createConsentRecord(
  config: OpenCookieConfig,
  choices: ConsentChoices,
): OpenCookieStoredConsent {
  return {
    version: config.version,
    choices: normalizeChoices(config, choices),
    updatedAt: new Date().toISOString(),
  }
}

export function readStoredConsent(
  config: OpenCookieConfig,
): OpenCookieStoredConsent | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(getStorageKey(config))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<OpenCookieStoredConsent>

    if (parsed.version !== config.version || !parsed.choices) {
      window.localStorage.removeItem(getStorageKey(config))
      return null
    }

    return createConsentRecord(config, parsed.choices)
  } catch {
    window.localStorage.removeItem(getStorageKey(config))
    return null
  }
}

export function writeStoredConsent(
  config: OpenCookieConfig,
  choices: ConsentChoices,
): OpenCookieStoredConsent {
  const record = createConsentRecord(config, choices)

  window.localStorage.setItem(getStorageKey(config), JSON.stringify(record))

  return record
}

export function clearStoredConsent(config: OpenCookieConfig): void {
  if (typeof window === "undefined") return

  window.localStorage.removeItem(getStorageKey(config))
}
