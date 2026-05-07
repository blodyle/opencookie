"use client"

import { OpenCookieGate } from "@opencookie/react"

export function AnalyticsGateDemo() {
  return (
    <OpenCookieGate
      category="analytics"
      fallback={<p className="blocked">Analytics is blocked.</p>}
    >
      <p className="loaded">Analytics can load now.</p>
      <script
        async
        data-example="analytics"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
      />
    </OpenCookieGate>
  )
}
