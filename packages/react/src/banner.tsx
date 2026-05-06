"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useOpenCookie } from "./provider"
import type { ConsentChoices } from "./types"

export interface OpenCookieBannerProps {
  title?: string
  description?: string
  acceptLabel?: string
  rejectLabel?: string
  customizeLabel?: string
  saveLabel?: string
}

export function OpenCookieBanner({
  title = "We value your privacy",
  description = "We use optional cookies to improve the site. You can accept, reject, or customize your choices.",
  acceptLabel = "Accept all",
  rejectLabel = "Reject all",
  customizeLabel = "Customize",
  saveLabel = "Save choices",
}: OpenCookieBannerProps) {
  const consent = useOpenCookie()
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [draftChoices, setDraftChoices] = useState<ConsentChoices>(consent.choices)

  useEffect(() => {
    setDraftChoices(consent.choices)
  }, [consent.choices])

  if (!consent.shouldShowBanner && !consent.isSettingsOpen) return null

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    consent.saveChoices(draftChoices)
    setIsCustomizing(false)
  }

  return (
    <section
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 2147483647,
        maxWidth: 420,
        border: "1px solid #d4d4d4",
        borderRadius: 8,
        background: "#fff",
        color: "#171717",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
        padding: 16,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: 18, lineHeight: 1.25 }}>
        {title}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.5 }}>
        {description}
      </p>

      {isCustomizing || consent.isSettingsOpen ? (
        <form onSubmit={save}>
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {consent.categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 8,
                  alignItems: "start",
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={category.required || draftChoices[category.id] === true}
                  disabled={category.required}
                  onChange={(event) =>
                    setDraftChoices((current) => ({
                      ...current,
                      [category.id]: event.target.checked,
                    }))
                  }
                />
                <span>
                  <strong>{category.label}</strong>
                  {category.description ? (
                    <span style={{ display: "block", color: "#525252" }}>
                      {category.description}
                    </span>
                  ) : null}
                </span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="submit">{saveLabel}</button>
            <button type="button" onClick={consent.rejectAll}>
              {rejectLabel}
            </button>
            <button type="button" onClick={consent.acceptAll}>
              {acceptLabel}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" onClick={consent.rejectAll}>
            {rejectLabel}
          </button>
          <button type="button" onClick={() => setIsCustomizing(true)}>
            {customizeLabel}
          </button>
          <button type="button" onClick={consent.acceptAll}>
            {acceptLabel}
          </button>
        </div>
      )}
    </section>
  )
}
