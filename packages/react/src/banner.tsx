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

const defaultTitle = "We value your privacy"
const defaultDescription =
  "We use optional cookies to improve the site. You can accept, reject, or customize your choices."
const preferencesTitle = "Cookie preferences"
const preferencesDescription =
  "Choose which optional tools can load. Necessary cookies are always on."

export function OpenCookieBanner({
  title = defaultTitle,
  description = defaultDescription,
  acceptLabel = "Accept all",
  rejectLabel = "Reject all",
  customizeLabel = "Customize",
  saveLabel = "Save choices",
}: OpenCookieBannerProps) {
  const consent = useOpenCookie()
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [draftChoices, setDraftChoices] = useState<ConsentChoices>(consent.choices)
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(null)
  const isPreferencesView = isCustomizing || consent.isSettingsOpen
  const heading =
    isPreferencesView && title === defaultTitle ? preferencesTitle : title
  const body =
    isPreferencesView && description === defaultDescription
      ? preferencesDescription
      : description

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
        right: 20,
        bottom: 20,
        left: 20,
        zIndex: 2147483647,
        width: "min(100% - 40px, 460px)",
        marginLeft: "auto",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 24,
        background: "rgba(255, 255, 255, 0.92)",
        color: "#1d1d1f",
        boxShadow:
          "0 24px 70px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06)",
        padding: 20,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        backdropFilter: "saturate(180%) blur(22px)",
        WebkitBackdropFilter: "saturate(180%) blur(22px)",
      }}
    >
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 19,
          fontWeight: 650,
          letterSpacing: 0,
          lineHeight: 1.2,
        }}
      >
        {heading}
      </h2>
      <p
        style={{
          margin: "0 0 18px",
          color: "#55555a",
          fontSize: 14,
          letterSpacing: 0,
          lineHeight: 1.45,
        }}
      >
        {body}
      </p>

      {isPreferencesView ? (
        <form onSubmit={save}>
          <div
            style={{
              margin: "0 0 10px",
              color: "#86868b",
              fontSize: 12,
              fontWeight: 650,
              letterSpacing: 0.2,
              textTransform: "uppercase",
            }}
          >
            Consent categories
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
            {consent.categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "grid",
                  position: "relative",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  alignItems: "center",
                  border: "1px solid rgba(0, 0, 0, 0.045)",
                  borderRadius: 18,
                  background: "rgba(247, 247, 248, 0.62)",
                  padding: "12px 12px 12px 15px",
                  fontSize: 14,
                }}
              >
                <span>
                  <span
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 7,
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontWeight: 620 }}>{category.label}</strong>
                    {category.required ? (
                      <span
                        style={{
                          borderRadius: 999,
                          background: "rgba(0, 0, 0, 0.055)",
                          color: "#6e6e73",
                          padding: "2px 7px",
                          fontSize: 11,
                          fontWeight: 620,
                          lineHeight: 1.35,
                        }}
                      >
                        Always on
                      </span>
                    ) : null}
                  </span>
                  {category.description ? (
                    <span
                      style={{
                        display: "block",
                        marginTop: 2,
                        color: "#6e6e73",
                        fontSize: 13,
                        lineHeight: 1.35,
                      }}
                    >
                      {category.description}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden="true"
                  style={getSwitchTrackStyle(
                    category.required || draftChoices[category.id] === true,
                    category.required === true,
                    focusedCategoryId === category.id,
                  )}
                >
                  <span
                    style={getSwitchThumbStyle(
                      category.required || draftChoices[category.id] === true,
                    )}
                  />
                </span>
                <input
                  type="checkbox"
                  checked={category.required || draftChoices[category.id] === true}
                  disabled={category.required}
                  onFocus={() => setFocusedCategoryId(category.id)}
                  onBlur={() => setFocusedCategoryId(null)}
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 1,
                    margin: -1,
                    overflow: "hidden",
                    clip: "rect(0 0 0 0)",
                    whiteSpace: "nowrap",
                    border: 0,
                  }}
                  onChange={(event) =>
                    setDraftChoices((current) => ({
                      ...current,
                      [category.id]: event.target.checked,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <div style={actionRowStyle}>
            <button type="button" style={ghostButtonStyle} onClick={consent.rejectAll}>
              {rejectLabel}
            </button>
            <button type="button" style={secondaryButtonStyle} onClick={consent.acceptAll}>
              {acceptLabel}
            </button>
            <button type="submit" style={primaryButtonStyle}>
              {saveLabel}
            </button>
          </div>
        </form>
      ) : (
        <div style={actionRowStyle}>
          <button type="button" style={ghostButtonStyle} onClick={consent.rejectAll}>
            {rejectLabel}
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => setIsCustomizing(true)}
          >
            {customizeLabel}
          </button>
          <button type="button" style={primaryButtonStyle} onClick={consent.acceptAll}>
            {acceptLabel}
          </button>
        </div>
      )}
    </section>
  )
}

const actionRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: 8,
} satisfies React.CSSProperties

const baseButtonStyle = {
  minHeight: 38,
  border: 0,
  borderRadius: 999,
  padding: "9px 15px",
  font: "inherit",
  fontSize: 14,
  fontWeight: 560,
  letterSpacing: 0,
  cursor: "pointer",
} satisfies React.CSSProperties

const primaryButtonStyle = {
  ...baseButtonStyle,
  background: "#007aff",
  color: "#fff",
  boxShadow: "0 1px 2px rgba(0, 122, 255, 0.24)",
} satisfies React.CSSProperties

const secondaryButtonStyle = {
  ...baseButtonStyle,
  background: "rgba(0, 0, 0, 0.06)",
  color: "#1d1d1f",
} satisfies React.CSSProperties

const ghostButtonStyle = {
  ...baseButtonStyle,
  background: "transparent",
  color: "#424245",
  paddingInline: 10,
} satisfies React.CSSProperties

function getSwitchTrackStyle(
  checked: boolean,
  disabled: boolean,
  focused: boolean,
): React.CSSProperties {
  const checkedBackground = disabled ? "rgba(120, 120, 128, 0.34)" : "#007aff"

  return {
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
    width: 46,
    height: 28,
    borderRadius: 999,
    background: checked ? checkedBackground : "rgba(120, 120, 128, 0.22)",
    boxShadow: focused
      ? "0 0 0 4px rgba(0, 122, 255, 0.18), inset 0 0 0 1px rgba(0, 122, 255, 0.14)"
      : "inset 0 0 0 1px rgba(0, 0, 0, 0.04)",
    cursor: disabled ? "default" : "pointer",
    transition: "background 160ms ease, box-shadow 160ms ease",
  }
}

function getSwitchThumbStyle(checked: boolean): React.CSSProperties {
  return {
    position: "absolute",
    top: 3,
    left: checked ? 21 : 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#fff",
    boxShadow:
      "0 2px 5px rgba(0, 0, 0, 0.24), 0 1px 1px rgba(0, 0, 0, 0.08)",
    transition: "left 160ms ease",
  }
}
