import type {
  CSSProperties,
  FormEventHandler,
  MouseEventHandler,
  ReactNode,
} from "react";
import {
  getActionRowStyle,
  getDescriptionStyle,
  getGhostButtonStyle,
  getHeaderStyle,
  getHeadingStyle,
  getPanelStyle,
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
} from "./banner-styles";

interface BannerPanelProps {
  isMobile: boolean;
  children: ReactNode;
}

export function BannerPanel(props: BannerPanelProps) {
  return (
    <section
      aria-label="Cookie consent"
      style={getPanelStyle(props.isMobile)}
    >
      {props.children}
    </section>
  );
}

interface BannerHeaderProps {
  isMobile: boolean;
  children: ReactNode;
}

export function BannerHeader(props: BannerHeaderProps) {
  return (
    <div style={getHeaderStyle(props.isMobile)}>
      {props.children}
    </div>
  );
}

interface BannerTitleProps {
  isMobile: boolean;
  children: ReactNode;
}

export function BannerTitle(props: BannerTitleProps) {
  return (
    <h2 style={getHeadingStyle(props.isMobile)}>
      {props.children}
    </h2>
  );
}

interface BannerDescriptionProps {
  isMobile: boolean;
  children: ReactNode;
}

export function BannerDescription(props: BannerDescriptionProps) {
  return (
    <p style={getDescriptionStyle(props.isMobile)}>
      {props.children}
    </p>
  );
}

interface BannerFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

export function BannerForm(props: BannerFormProps) {
  return <form onSubmit={props.onSubmit}>{props.children}</form>;
}

interface BannerSectionLabelProps {
  children: ReactNode;
}

export function BannerSectionLabel(props: BannerSectionLabelProps) {
  return (
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
      {props.children}
    </div>
  );
}

interface BannerStackProps {
  children: ReactNode;
}

export function BannerStack(props: BannerStackProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: 10,
        marginBottom: 18,
      }}
    >
      {props.children}
    </div>
  );
}

interface BannerActionsProps {
  isMobile: boolean;
  children: ReactNode;
}

export function BannerActions(props: BannerActionsProps) {
  return (
    <div style={getActionRowStyle(props.isMobile)}>
      {props.children}
    </div>
  );
}

type BannerButtonVariant = "primary" | "secondary" | "ghost";

interface BannerButtonProps {
  isMobile: boolean;
  variant: BannerButtonVariant;
  order?: number;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  children: ReactNode;
}

export function BannerButton(props: BannerButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      style={{
        ...getButtonStyle(props),
        ...props.style,
      }}
    >
      {props.children}
    </button>
  );
}

function getButtonStyle(props: BannerButtonProps) {
  if (props.variant === "primary") {
    return getPrimaryButtonStyle(props.isMobile, props.order);
  }

  if (props.variant === "secondary") {
    return getSecondaryButtonStyle(props.isMobile, props.order);
  }

  return getGhostButtonStyle(props.isMobile, props.order);
}
