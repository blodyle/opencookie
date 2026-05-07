"use client"

import { useOpenCookie } from "@opencookie/react"

export function ResetConsentButton() {
  const consent = useOpenCookie()

  return (
    <button
      className="reset-button"
      type="button"
      onClick={consent.resetConsent}
    >
      Clear everything
    </button>
  )
}
