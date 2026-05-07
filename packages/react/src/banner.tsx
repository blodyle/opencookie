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
  rejectLabel = "Reject optional",
  customizeLabel = "Customize",
  saveLabel = "Save choices",
}: OpenCookieBannerProps) {
  const consent = useOpenCookie()
  const isMobile = useMediaQuery("(max-width: 520px)")
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
      style={getPanelStyle(isMobile)}
    >
      <h2
        style={getHeadingStyle(isMobile)}
      >
        {heading}
      </h2>
      <p
        style={getDescriptionStyle(isMobile)}
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
          <div style={getActionRowStyle(isMobile)}>
            <button
              type="button"
              style={getGhostButtonStyle(isMobile)}
              onClick={consent.rejectAll}
            >
              {rejectLabel}
            </button>
            <button
              type="button"
              style={getSecondaryButtonStyle(isMobile)}
              onClick={consent.acceptAll}
            >
              {acceptLabel}
            </button>
            <button type="submit" style={getPrimaryButtonStyle(isMobile)}>
              {saveLabel}
            </button>
          </div>
        </form>
      ) : (
        <div style={getActionRowStyle(isMobile)}>
          <button
            type="button"
            style={getSecondaryButtonStyle(isMobile, 2)}
            onClick={() => setIsCustomizing(true)}
          >
            {customizeLabel}
          </button>
          <button
            type="button"
            style={getGhostButtonStyle(isMobile, 1)}
            onClick={consent.rejectAll}
          >
            {rejectLabel}
          </button>
          <button
            type="button"
            style={getPrimaryButtonStyle(isMobile, 3)}
            onClick={consent.acceptAll}
          >
            {acceptLabel}
          </button>
        </div>
      )}
    </section>
  )
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (typeof window.matchMedia !== "function") return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    function update() {
      setMatches(media.matches)
    }

    media.addEventListener("change", update)

    return () => media.removeEventListener("change", update)
  }, [query])

  return matches
}

function getPanelStyle(isMobile: boolean): React.CSSProperties {
  return {
    position: "fixed",
    right: isMobile ? 0 : 20,
    bottom: 0,
    left: isMobile ? 0 : 20,
    zIndex: 2147483647,
    width: isMobile ? "100%" : "min(100% - 40px, 460px)",
    maxHeight: isMobile ? "92dvh" : undefined,
    overflowY: isMobile ? "auto" : undefined,
    marginLeft: isMobile ? undefined : "auto",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderBottom: isMobile ? 0 : "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: isMobile ? "28px 28px 0 0" : 24,
    background: "rgba(255, 255, 255, 0.94)",
    color: "#1d1d1f",
    boxShadow: isMobile
      ? "0 -18px 55px rgba(0, 0, 0, 0.18), 0 -1px 0 rgba(0, 0, 0, 0.04)"
      : "0 24px 70px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06)",
    padding: isMobile
      ? "22px 20px calc(20px + env(safe-area-inset-bottom))"
      : 20,
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    backdropFilter: "saturate(180%) blur(22px)",
    WebkitBackdropFilter: "saturate(180%) blur(22px)",
  }
}

function getHeadingStyle(isMobile: boolean): React.CSSProperties {
  return {
    margin: "0 0 8px",
    fontSize: isMobile ? 22 : 19,
    fontWeight: 650,
    letterSpacing: 0,
    lineHeight: 1.18,
  }
}

function getDescriptionStyle(isMobile: boolean): React.CSSProperties {
  return {
    margin: isMobile ? "0 0 20px" : "0 0 18px",
    color: "#55555a",
    fontSize: isMobile ? 15 : 14,
    letterSpacing: 0,
    lineHeight: 1.45,
  }
}

function getActionRowStyle(isMobile: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    justifyContent: "flex-end",
    gap: isMobile ? 10 : 8,
  }
}

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

function getBaseButtonStyle(isMobile: boolean): React.CSSProperties {
  return {
    ...baseButtonStyle,
    width: isMobile ? "100%" : undefined,
    minHeight: isMobile ? 50 : baseButtonStyle.minHeight,
    fontSize: isMobile ? 15 : baseButtonStyle.fontSize,
  }
}

function getPrimaryButtonStyle(
  isMobile: boolean,
  order?: number,
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "#007aff",
    color: "#fff",
    boxShadow: "0 1px 2px rgba(0, 122, 255, 0.24)",
  }
}

function getSecondaryButtonStyle(
  isMobile: boolean,
  order?: number,
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "rgba(0, 0, 0, 0.06)",
    color: "#1d1d1f",
  }
}

function getGhostButtonStyle(
  isMobile: boolean,
  order?: number,
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "transparent",
    color: "#424245",
    paddingInline: isMobile ? 15 : 10,
  }
}

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
