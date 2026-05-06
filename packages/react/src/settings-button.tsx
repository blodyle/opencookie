"use client"

import type { ButtonHTMLAttributes } from "react"
import { useOpenCookie } from "./provider"

export function OpenCookieSettingsButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const consent = useOpenCookie()

  return (
    <button type="button" {...props} onClick={consent.openSettings}>
      {props.children ?? "Cookie settings"}
    </button>
  )
}
