"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useOpenCookie } from "./provider";
import type { ConsentChoices } from "./types";

export interface OpenCookieBannerProps {
  tone?: "default" | "playful";
  title?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  saveLabel?: string;
}

const defaultTitle = "We value your privacy";
const defaultDescription =
  "We use optional cookies to improve the site. You can accept, reject, or customize your choices.";
const playfulTitle = "Cookie checkpoint";
const playfulDescription =
  "We brought cookies!! \n\nUnfortunately, they are the browser kind. Optional tools only load if you say yes.";
const preferencesTitle = "Cookie preferences";
const preferencesDescription =
  "Choose which optional tools can load. Necessary cookies are always on.";

export function OpenCookieBanner({
  tone = "default",
  title,
  description,
  acceptLabel = "Accept all",
  rejectLabel = "Reject optional",
  customizeLabel = "Customize",
  saveLabel = "Save choices",
}: OpenCookieBannerProps) {
  const consent = useOpenCookie();
  const isMobile = useMediaQuery("(max-width: 520px)");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draftChoices, setDraftChoices] = useState<ConsentChoices>(
    consent.choices
  );
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(
    null
  );
  const defaultCopy =
    tone === "playful"
      ? { title: playfulTitle, description: playfulDescription }
      : { title: defaultTitle, description: defaultDescription };
  const resolvedTitle = title ?? defaultCopy.title;
  const resolvedDescription = description ?? defaultCopy.description;
  const isPreferencesView = isCustomizing || consent.isSettingsOpen;
  const heading =
    isPreferencesView && !title ? preferencesTitle : resolvedTitle;
  const body =
    isPreferencesView && !description
      ? preferencesDescription
      : resolvedDescription;

  useEffect(() => {
    setDraftChoices(consent.choices);
  }, [consent.choices]);

  if (!consent.shouldShowBanner && !consent.isSettingsOpen) return null;

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    consent.saveChoices(draftChoices);
    setIsCustomizing(false);
  }

  return (
    <section aria-label="Cookie consent" style={getPanelStyle(isMobile)}>
      <div style={getHeaderStyle(isMobile)}>
        <CookieIcon isMobile={isMobile} />
        <div>
          <h2 style={getHeadingStyle(isMobile)}>{heading}</h2>
        </div>
      </div>
      <p style={getDescriptionStyle(isMobile)}>{body}</p>

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
                    <strong style={{ fontWeight: 620 }}>
                      {category.label}
                    </strong>
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
                    focusedCategoryId === category.id
                  )}
                >
                  <span
                    style={getSwitchThumbStyle(
                      category.required || draftChoices[category.id] === true
                    )}
                  />
                </span>
                <input
                  type="checkbox"
                  checked={
                    category.required || draftChoices[category.id] === true
                  }
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
  );
}

function CookieIcon({ isMobile }: { isMobile: boolean }) {
  return (
    <span aria-hidden="true" style={getIconFrameStyle(isMobile)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="40 35 390 390"
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id="cookieGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fad696" />
            <stop offset="40%" stopColor="#e3ab59" />
            <stop offset="85%" stopColor="#c4832b" />
            <stop offset="100%" stopColor="#9c641c" />
          </radialGradient>

          <linearGradient id="chipGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#5a3515" />
            <stop offset="50%" stopColor="#381e08" />
            <stop offset="100%" stopColor="#241103" />
          </linearGradient>

          <filter id="dropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow
              dx="8"
              dy="12"
              stdDeviation="8"
              floodColor="#2a1604"
              floodOpacity="0.35"
            />
          </filter>

          <mask id="biteMask">
            <rect x="0" y="0" width="500" height="500" fill="white" />
            <g fill="black">
              <circle cx="430" cy="60" r="80" />
              <circle cx="360" cy="110" r="45" />
              <circle cx="320" cy="70" r="35" />
              <circle cx="390" cy="160" r="35" />
              <circle cx="310" cy="110" r="30" />
              <circle cx="340" cy="150" r="30" />
              <circle cx="280" cy="80" r="25" />
              <circle cx="390" cy="200" r="25" />
            </g>
          </mask>

          <g id="chip1">
            <path
              d="M -9,-11 C 1,-15 11,-9 13,-1 C 15,7 9,15 -1,13 C -11,11 -15,3 -9,-11 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -5,-7 C -3,-9 1,-9 3,-5 C 3,-3 -3,-3 -5,-7 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-3" cy="-6" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
          <g id="chip2">
            <path
              d="M 0,-13 C 11,-13 15,-3 11,7 C 7,15 -7,15 -13,7 C -17,-1 -11,-13 0,-13 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -3,-9 C 1,-9 3,-5 1,-3 C -3,-5 -5,-7 -3,-9 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-1" cy="-7" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
          <g id="chip3">
            <path
              d="M -11,-6 C -6,-13 4,-16 13,-9 C 17,-3 15,7 9,11 C 1,17 -13,11 -11,-6 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -7,-7 C -3,-9 3,-7 1,-3 C -3,-5 -5,-5 -7,-7 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-4" cy="-5" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
        </defs>

        <g mask="url(#biteMask)" filter="url(#dropShadow)">
          <path
            d="M 230, 70
             C 280, 65  330, 90  360, 140
             C 390, 190 395, 260 360, 320
             C 320, 380 260, 400 190, 380
             C 120, 360 70,  310 60,  240
             C 50,  170 110, 90  170, 75
             C 190, 70  210, 75  230, 70 Z"
            fill="url(#cookieGrad)"
          />

          <g
            stroke="#b0782d"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          >
            <path d="M 140,180 Q 155,190 150,210" />
            <path d="M 260,150 Q 240,140 230,160" />
            <path d="M 190,260 Q 210,270 200,290" />
            <path d="M 290,280 Q 310,270 320,290" />
            <path d="M 170,110 Q 185,120 180,140" />
            <path d="M 220,340 Q 200,350 210,370" />
            <path d="M 330,230 Q 310,220 300,240" />
          </g>

          <g
            stroke="#fae0ad"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <path d="M 135,175 Q 150,185 145,205" />
            <path d="M 255,145 Q 235,135 225,155" />
            <path d="M 185,255 Q 205,265 195,285" />
            <path d="M 285,275 Q 305,265 315,285" />
          </g>

          <g fill="#9c641c" opacity="0.35">
            <circle cx="150" cy="150" r="2.5" />
            <circle cx="160" cy="140" r="1.5" />
            <circle cx="210" cy="280" r="2" />
            <circle cx="220" cy="290" r="1.5" />
            <circle cx="120" cy="250" r="2.5" />
            <circle cx="310" cy="200" r="1.5" />
            <circle cx="320" cy="210" r="2.5" />
            <circle cx="280" cy="330" r="2" />
            <circle cx="250" cy="110" r="2.5" />
            <circle cx="180" cy="350" r="2" />
          </g>

          <g fill="#ffffff" opacity="0.25">
            <circle cx="153" cy="153" r="2.5" />
            <circle cx="213" cy="283" r="2" />
            <circle cx="123" cy="253" r="2.5" />
            <circle cx="313" cy="203" r="1.5" />
            <circle cx="283" cy="333" r="2" />
          </g>

          <use
            href="#chip1"
            transform="translate(140, 180) scale(1.4) rotate(15)"
          />
          <use
            href="#chip2"
            transform="translate(260, 150) scale(1.6) rotate(-20)"
          />
          <use
            href="#chip3"
            transform="translate(190, 260) scale(1.8) rotate(45)"
          />
          <use
            href="#chip1"
            transform="translate(290, 280) scale(1.3) rotate(80)"
          />
          <use
            href="#chip2"
            transform="translate(130, 290) scale(1.5) rotate(-60)"
          />
          <use
            href="#chip3"
            transform="translate(220, 340) scale(1.2) rotate(110)"
          />

          <use
            href="#chip1"
            transform="translate(100, 230) scale(1) rotate(5)"
          />
          <use
            href="#chip2"
            transform="translate(330, 230) scale(1.4) rotate(90)"
          />
          <use
            href="#chip3"
            transform="translate(320, 320) scale(1.1) rotate(30)"
          />
          <use
            href="#chip1"
            transform="translate(170, 110) scale(1.5) rotate(140)"
          />
          <use
            href="#chip2"
            transform="translate(220, 190) scale(1) rotate(-15)"
          />

          <use
            href="#chip3"
            transform="translate(300, 90) scale(1.3) rotate(25)"
          />
          <use
            href="#chip1"
            transform="translate(370, 270) scale(1.2) rotate(60)"
          />
          <use
            href="#chip2"
            transform="translate(140, 340) scale(1.1) rotate(-45)"
          />
          <use
            href="#chip3"
            transform="translate(80, 280) scale(1) rotate(10)"
          />
          <use
            href="#chip1"
            transform="translate(260, 370) scale(1.4) rotate(85)"
          />
        </g>
      </svg>
    </span>
  );
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    function update() {
      setMatches(media.matches);
    }

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function getPanelStyle(isMobile: boolean): React.CSSProperties {
  return {
    position: "fixed",
    right: isMobile ? 0 : 20,
    bottom: isMobile ? 0 : 20,
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
  };
}

function getHeaderStyle(isMobile: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  };
}

function getIconFrameStyle(isMobile: boolean): React.CSSProperties {
  const size = isMobile ? 44 : 40;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    width: size,
    height: size,
  };
}

function getHeadingStyle(isMobile: boolean): React.CSSProperties {
  return {
    margin: 0,
    fontSize: isMobile ? 22 : 19,
    fontWeight: 650,
    letterSpacing: 0,
    lineHeight: 1.18,
  };
}

function getDescriptionStyle(isMobile: boolean): React.CSSProperties {
  return {
    margin: isMobile ? "0 0 20px" : "0 0 18px",
    color: "#55555a",
    fontSize: isMobile ? 15 : 14,
    letterSpacing: 0,
    lineHeight: 1.45,
    whiteSpace: 'pre-line'
  };
}

function getActionRowStyle(isMobile: boolean): React.CSSProperties {
  return {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    justifyContent: "flex-end",
    gap: isMobile ? 10 : 8,
  };
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
} satisfies React.CSSProperties;

function getBaseButtonStyle(isMobile: boolean): React.CSSProperties {
  return {
    ...baseButtonStyle,
    width: isMobile ? "100%" : undefined,
    minHeight: isMobile ? 50 : baseButtonStyle.minHeight,
    fontSize: isMobile ? 15 : baseButtonStyle.fontSize,
  };
}

function getPrimaryButtonStyle(
  isMobile: boolean,
  order?: number
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "#007aff",
    color: "#fff",
    boxShadow: "0 1px 2px rgba(0, 122, 255, 0.24)",
  };
}

function getSecondaryButtonStyle(
  isMobile: boolean,
  order?: number
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "rgba(0, 0, 0, 0.06)",
    color: "#1d1d1f",
  };
}

function getGhostButtonStyle(
  isMobile: boolean,
  order?: number
): React.CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "transparent",
    color: "#424245",
    paddingInline: isMobile ? 15 : 10,
  };
}

function getSwitchTrackStyle(
  checked: boolean,
  disabled: boolean,
  focused: boolean
): React.CSSProperties {
  const checkedBackground = disabled ? "rgba(120, 120, 128, 0.34)" : "#007aff";

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
  };
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
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.24), 0 1px 1px rgba(0, 0, 0, 0.08)",
    transition: "left 160ms ease",
  };
}
