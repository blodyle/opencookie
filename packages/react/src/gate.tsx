"use client"

import type { ReactNode } from "react"
import { useOpenCookie } from "./provider"

export interface OpenCookieGateProps {
  category: string
  fallback?: ReactNode
  children: ReactNode
}

export function OpenCookieGate({
  category,
  fallback = null,
  children,
}: OpenCookieGateProps) {
  const consent = useOpenCookie()

  if (!category) {
    warnMissingGateCategory()
    return fallback
  }

  if (!consent.hasConsent(category)) return fallback

  return children
}

function warnMissingGateCategory(): void {
  if (isProduction()) return

  console.warn(
    "OpenCookieGate requires a category prop.",
  )
}

function isProduction(): boolean {
  return getNodeEnv() === "production"
}

function getNodeEnv(): string | undefined {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } }
  }

  return globalWithProcess.process?.env?.NODE_ENV
}
