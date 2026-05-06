"use client"

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  isRequiredCategory,
  resolveGateCategory,
  resolveOpenCookieConfig,
} from "./config"
import {
  applyGoogleConsentDefault,
  applyGoogleConsentUpdate,
} from "./google-consent"
import {
  clearStoredConsent,
  createAcceptAllChoices,
  createRejectAllChoices,
  readStoredConsent,
  writeStoredConsent,
} from "./storage"
import type {
  ConsentChoices,
  OpenCookieConfig,
  OpenCookieConfigInput,
  OpenCookieContextValue,
  OpenCookieStoredConsent,
} from "./types"

const OpenCookieContext = createContext<OpenCookieContextValue | null>(null)

export interface OpenCookieProviderProps extends PropsWithChildren {
  config?: OpenCookieConfigInput
}

export function OpenCookieProvider({
  children,
  config,
}: OpenCookieProviderProps) {
  const resolvedConfig = useMemo(() => resolveOpenCookieConfig(config), [config])
  const [record, setRecord] = useState<OpenCookieStoredConsent | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    applyGoogleConsentDefault(resolvedConfig)

    const storedRecord = readStoredConsent(resolvedConfig)
    setRecord(storedRecord)
    setIsLoaded(true)

    if (storedRecord) {
      applyGoogleConsentUpdate(resolvedConfig, storedRecord.choices)
    }
  }, [resolvedConfig])

  const persistChoices = useCallback(
    (choices: ConsentChoices) => {
      const nextRecord = writeStoredConsent(resolvedConfig, choices)
      setRecord(nextRecord)
      setIsSettingsOpen(false)
      applyGoogleConsentUpdate(resolvedConfig, nextRecord.choices)
    },
    [resolvedConfig],
  )

  const acceptAll = useCallback(() => {
    persistChoices(createAcceptAllChoices(resolvedConfig))
  }, [resolvedConfig, persistChoices])

  const rejectAll = useCallback(() => {
    persistChoices(createRejectAllChoices(resolvedConfig))
  }, [resolvedConfig, persistChoices])

  const resetConsent = useCallback(() => {
    clearStoredConsent(resolvedConfig)
    setRecord(null)
    setIsSettingsOpen(false)
    applyGoogleConsentDefault(resolvedConfig)
  }, [resolvedConfig])

  const choices = record?.choices ?? createRejectAllChoices(resolvedConfig)

  const hasConsent = useCallback(
    (categoryId: string) => {
      const resolvedCategory = resolveGateCategory(resolvedConfig, categoryId)

      if (!resolvedCategory) return false
      if (isRequiredCategory(resolvedConfig, resolvedCategory)) return true

      return record?.choices[resolvedCategory] === true
    },
    [resolvedConfig, record],
  )

  const value = useMemo<OpenCookieContextValue>(
    () => ({
      categories: resolvedConfig.categories,
      choices,
      status: !isLoaded ? "loading" : record ? "saved" : "pending",
      isLoaded,
      isSettingsOpen,
      shouldShowBanner: isLoaded && !record,
      acceptAll,
      rejectAll,
      saveChoices: persistChoices,
      resetConsent,
      openSettings: () => setIsSettingsOpen(true),
      closeSettings: () => setIsSettingsOpen(false),
      hasConsent,
    }),
    [
      acceptAll,
      choices,
      hasConsent,
      isLoaded,
      isSettingsOpen,
      persistChoices,
      record,
      rejectAll,
      resolvedConfig.categories,
      resetConsent,
    ],
  )

  return (
    <OpenCookieContext.Provider value={value}>
      {children}
    </OpenCookieContext.Provider>
  )
}

export function useOpenCookie(): OpenCookieContextValue {
  const context = useContext(OpenCookieContext)

  if (!context) {
    throw new Error("useOpenCookie must be used inside OpenCookieProvider.")
  }

  return context
}
