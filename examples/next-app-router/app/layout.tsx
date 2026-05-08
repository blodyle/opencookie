import type { Metadata } from "next"
import { OpenCookieBanner, OpenCookieProvider } from "@opencookie/react"
import { openCookieConfig } from "../open-cookie.config"
import "./styles.css"

export const metadata: Metadata = {
  title: "OpenCookie Next.js Example",
  description: "Consent-gated loading with OpenCookie.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <OpenCookieProvider config={openCookieConfig}>
          {children}
          <OpenCookieBanner tone="playful" />
        </OpenCookieProvider>
      </body>
    </html>
  )
}
