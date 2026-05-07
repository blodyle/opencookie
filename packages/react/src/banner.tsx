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
        {title}
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
        {description}
      </p>

      {isCustomizing || consent.isSettingsOpen ? (
        <form onSubmit={save}>
          <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
            {consent.categories.map((category) => (
              <label
                key={category.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 14,
                  alignItems: "center",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  borderRadius: 16,
                  background: "rgba(247, 247, 248, 0.86)",
                  padding: "12px 12px 12px 14px",
                  fontSize: 14,
                }}
              >
                <span>
                  <strong style={{ fontWeight: 600 }}>{category.label}</strong>
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
            <button type="button" style={secondaryButtonStyle} onClick={consent.rejectAll}>
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
          <button type="button" style={secondaryButtonStyle} onClick={consent.rejectAll}>
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

function getSwitchTrackStyle(
  checked: boolean,
  disabled: boolean,
): React.CSSProperties {
  return {
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
    width: 46,
    height: 28,
    borderRadius: 999,
    background: checked ? "#007aff" : "rgba(120, 120, 128, 0.22)",
    boxShadow: checked
      ? "inset 0 0 0 1px rgba(0, 122, 255, 0.08)"
      : "inset 0 0 0 1px rgba(0, 0, 0, 0.04)",
    opacity: disabled ? 0.52 : 1,
    transition: "background 160ms ease, opacity 160ms ease",
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
