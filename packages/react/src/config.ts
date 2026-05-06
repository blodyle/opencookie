import type {
  ConsentCategoryId,
  OpenCookieConfig,
  OpenCookieConfigInput,
} from "./types"

export const defaultOpenCookieConfig: OpenCookieConfig = {
  version: "1",
  categories: [
    {
      id: "necessary",
      label: "Necessary",
      description: "Required for the site to work.",
      required: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Helps the site owner understand traffic and improve the site.",
    },
    {
      id: "marketing",
      label: "Marketing",
      description: "Used for pixels, embeds, and similar optional tools.",
    },
    {
      id: "preferences",
      label: "Preferences",
      description: "Remembers optional choices that improve your experience.",
    },
  ],
  googleConsent: {
    enabled: true,
  },
}

export function defineOpenCookieConfig(
  config: OpenCookieConfigInput = {},
): OpenCookieConfig {
  return resolveOpenCookieConfig(config)
}

export function resolveOpenCookieConfig(
  config: OpenCookieConfigInput = {},
): OpenCookieConfig {
  return {
    ...defaultOpenCookieConfig,
    ...config,
    categories: config.categories ?? defaultOpenCookieConfig.categories,
    googleConsent: config.googleConsent ?? defaultOpenCookieConfig.googleConsent,
  }
}

export function getStorageKey(config: OpenCookieConfig): string {
  return config.storageKey ?? "opencookie.consent"
}

export function getRequiredCategoryIds(config: OpenCookieConfig): ConsentCategoryId[] {
  return config.categories
    .filter((category) => category.required)
    .map((category) => category.id)
}

export function getOptionalCategoryIds(config: OpenCookieConfig): ConsentCategoryId[] {
  return config.categories
    .filter((category) => !category.required)
    .map((category) => category.id)
}

export function resolveGateCategory(
  config: OpenCookieConfig,
  categoryId: ConsentCategoryId,
): ConsentCategoryId | undefined {
  return categoryId
}

export function isRequiredCategory(
  config: OpenCookieConfig,
  categoryId: ConsentCategoryId,
): boolean {
  return config.categories.some(
    (category) => category.id === categoryId && category.required,
  )
}
