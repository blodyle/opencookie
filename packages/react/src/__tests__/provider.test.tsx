import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { OpenCookieBanner } from "../banner"
import { OpenCookieGate } from "../gate"
import { OpenCookieProvider, useOpenCookie } from "../provider"
import type { OpenCookieConfig } from "../types"

const config: OpenCookieConfig = {
  version: "1",
  categories: [
    { id: "necessary", label: "Necessary", required: true },
    { id: "analytics", label: "Analytics" },
    { id: "marketing", label: "Marketing" },
  ],
  googleConsent: {
    enabled: true,
    waitForUpdate: 500,
  },
}

function ConsentActions() {
  const consent = useOpenCookie()

  return (
    <>
      <button type="button" onClick={consent.acceptAll}>
        Accept all
      </button>
      <button
        type="button"
        onClick={() =>
          consent.saveChoices({
            necessary: true,
            analytics: false,
            marketing: true,
          })
        }
      >
        Marketing only
      </button>
    </>
  )
}

describe("OpenCookieProvider and OpenCookieGate", () => {
  it("does not render gated children until the category has consent", async () => {
    render(
      <OpenCookieProvider config={config}>
        <OpenCookieGate category="analytics" fallback={<span>Blocked</span>}>
          <script data-testid="analytics-script" src="/analytics.js" />
        </OpenCookieGate>
        <ConsentActions />
      </OpenCookieProvider>,
    )

    expect(screen.getByText("Blocked")).toBeInTheDocument()
    expect(screen.queryByTestId("analytics-script")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Accept all" }))

    expect(await screen.findByTestId("analytics-script")).toBeInTheDocument()
    expect(screen.queryByText("Blocked")).not.toBeInTheDocument()
  })

  it("checks the explicit category passed to OpenCookieGate", async () => {
    render(
      <OpenCookieProvider config={config}>
        <OpenCookieGate category="analytics" fallback={<span>Analytics blocked</span>}>
          <span>Analytics loaded</span>
        </OpenCookieGate>
        <OpenCookieGate category="marketing" fallback={<span>Marketing blocked</span>}>
          <span>Marketing loaded</span>
        </OpenCookieGate>
        <ConsentActions />
      </OpenCookieProvider>,
    )

    fireEvent.click(screen.getByRole("button", { name: "Marketing only" }))

    expect(await screen.findByText("Marketing loaded")).toBeInTheDocument()
    expect(screen.getByText("Analytics blocked")).toBeInTheDocument()
    expect(screen.queryByText("Analytics loaded")).not.toBeInTheDocument()
  })

  it("does not silently choose a category when OpenCookieGate has no category", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    render(
      <OpenCookieProvider config={config}>
        {/* @ts-expect-error exercises the runtime guard for JavaScript users. */}
        <OpenCookieGate fallback={<span>Missing category</span>}>
          <span>Unexpectedly loaded</span>
        </OpenCookieGate>
      </OpenCookieProvider>,
    )

    expect(screen.getByText("Missing category")).toBeInTheDocument()
    expect(screen.queryByText("Unexpectedly loaded")).not.toBeInTheDocument()
    expect(warnSpy).toHaveBeenCalledWith(
      "OpenCookieGate requires a category prop.",
    )

    warnSpy.mockRestore()
  })

  it("invalidates stored consent when the config version changes", async () => {
    localStorage.setItem(
      "opencookie.consent",
      JSON.stringify({
        version: "old",
        choices: {
          necessary: true,
          analytics: true,
          marketing: true,
        },
        updatedAt: "2026-05-06T00:00:00.000Z",
      }),
    )

    render(
      <OpenCookieProvider config={config}>
        <OpenCookieGate
          category="analytics"
          fallback={<span>Blocked after version change</span>}
        >
          <span>Loaded from stale consent</span>
        </OpenCookieGate>
      </OpenCookieProvider>,
    )

    expect(
      await screen.findByText("Blocked after version change"),
    ).toBeInTheDocument()
    expect(screen.queryByText("Loaded from stale consent")).not.toBeInTheDocument()
    expect(localStorage.getItem("opencookie.consent")).toBeNull()
  })

  it("ships a default banner that can save customized category choices", async () => {
    render(
      <OpenCookieProvider config={config}>
        <OpenCookieBanner />
        <OpenCookieGate category="analytics" fallback={<span>Analytics blocked</span>}>
          <span>Analytics loaded</span>
        </OpenCookieGate>
      </OpenCookieProvider>,
    )

    fireEvent.click(await screen.findByRole("button", { name: "Customize" }))
    fireEvent.click(screen.getByLabelText(/Analytics/))
    fireEvent.click(screen.getByRole("button", { name: "Save choices" }))

    expect(await screen.findByText("Analytics loaded")).toBeInTheDocument()
  })

  it("supports playful default banner copy", async () => {
    render(
      <OpenCookieProvider config={config}>
        <OpenCookieBanner tone="playful" />
      </OpenCookieProvider>,
    )

    expect(await screen.findByText("Cookie checkpoint")).toBeInTheDocument()
    expect(
      screen.getByText(/Unfortunately, they are the browser kind/),
    ).toBeInTheDocument()
  })

  it("sends denied Google Consent Mode defaults on boot and granted updates after consent", async () => {
    render(
      <OpenCookieProvider config={config}>
        <ConsentActions />
      </OpenCookieProvider>,
    )

    await waitFor(() => expect(window.dataLayer?.length).toBe(1))
    expect(window.dataLayer?.[0]).toEqual(
      expect.objectContaining({
        0: "consent",
        1: "default",
        2: expect.objectContaining({
          analytics_storage: "denied",
          ad_storage: "denied",
          wait_for_update: 500,
        }),
      }),
    )

    fireEvent.click(screen.getByRole("button", { name: "Accept all" }))

    await waitFor(() => expect(window.dataLayer?.length).toBe(2))
    expect(window.dataLayer?.[1]).toEqual(
      expect.objectContaining({
        0: "consent",
        1: "update",
        2: expect.objectContaining({
          analytics_storage: "granted",
          ad_storage: "granted",
        }),
      }),
    )
  })
})
