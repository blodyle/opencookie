import type { CSSProperties } from "react";

export function getPanelStyle(isMobile: boolean): CSSProperties {
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

export function getHeaderStyle(isMobile: boolean): CSSProperties {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  };
}

export function getHeadingStyle(isMobile: boolean): CSSProperties {
  return {
    margin: 0,
    fontSize: isMobile ? 22 : 19,
    fontWeight: 650,
    letterSpacing: 0,
    lineHeight: 1.18,
  };
}

export function getDescriptionStyle(isMobile: boolean): CSSProperties {
  return {
    margin: isMobile ? "0 0 20px" : "0 0 18px",
    color: "#55555a",
    fontSize: isMobile ? 15 : 14,
    letterSpacing: 0,
    lineHeight: 1.45,
    whiteSpace: "pre-line",
  };
}

export function getActionRowStyle(isMobile: boolean): CSSProperties {
  return {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    alignItems: "center",
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
} satisfies CSSProperties;

function getBaseButtonStyle(isMobile: boolean): CSSProperties {
  return {
    ...baseButtonStyle,
    flexShrink: 0,
    width: isMobile ? "100%" : undefined,
    minHeight: isMobile ? 50 : baseButtonStyle.minHeight,
    fontSize: isMobile ? 15 : baseButtonStyle.fontSize,
    whiteSpace: "nowrap",
  };
}

export function getPrimaryButtonStyle(
  isMobile: boolean,
  order?: number,
): CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "#007aff",
    color: "#fff",
    boxShadow: "0 1px 2px rgba(0, 122, 255, 0.24)",
  };
}

export function getSecondaryButtonStyle(
  isMobile: boolean,
  order?: number,
): CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "rgba(0, 0, 0, 0.06)",
    color: "#1d1d1f",
  };
}

export function getGhostButtonStyle(
  isMobile: boolean,
  order?: number,
): CSSProperties {
  return {
    ...getBaseButtonStyle(isMobile),
    order,
    background: "transparent",
    color: "#424245",
    paddingInline: isMobile ? 15 : 10,
  };
}

export function getSwitchTrackStyle(
  checked: boolean,
  disabled: boolean,
  focused: boolean,
): CSSProperties {
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

export function getSwitchThumbStyle(checked: boolean): CSSProperties {
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
  };
}
