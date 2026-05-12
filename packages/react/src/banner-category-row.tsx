import { getSwitchThumbStyle, getSwitchTrackStyle } from "./banner-styles";
import type { OpenCookieCategory } from "./types";

interface BannerCategoryRowProps {
  category: OpenCookieCategory;
  checked: boolean;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onCheckedChange: (checked: boolean) => void;
}

export function BannerCategoryRow(props: BannerCategoryRowProps) {
  return (
    <label
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
          <strong style={{ fontWeight: 620 }}>{props.category.label}</strong>
          {props.category.required ? (
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
        {props.category.description ? (
          <span
            style={{
              display: "block",
              marginTop: 2,
              color: "#6e6e73",
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            {props.category.description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        style={getSwitchTrackStyle(
          props.checked,
          props.category.required === true,
          props.focused,
        )}
      >
        <span style={getSwitchThumbStyle(props.checked)} />
      </span>
      <input
        type="checkbox"
        checked={props.checked}
        disabled={props.category.required}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
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
        onChange={(event) => props.onCheckedChange(event.target.checked)}
      />
    </label>
  );
}
