import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it } from "vitest"
import { OpenCookieBanner } from "../banner"
import { OpenCookieProvider } from "../provider"
import type { OpenCookieConfig } from "../types"

const config: OpenCookieConfig = {
  version: "1",
  categories: [
    {
      id: "necessary",
      label: "Necessary",
      description: "Required for the site to work.",
      required: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Helps us understand traffic without loading before consent.",
    },
  ],
  googleConsent: false,
}

function renderBanner(banner: ReactNode) {
  render(<OpenCookieProvider config={config}>{banner}</OpenCookieProvider>)
}

describe("OpenCookieBanner", () => {
  it("uses playful copy without changing the preferences copy", async () => {
    renderBanner(<OpenCookieBanner tone="playful" />)

    expect(await screen.findByRole("heading", { name: "Cookie checkpoint" }))
      .toBeInTheDocument()
    expect(
      screen.getByText(/Unfortunately, they are the browser kind/),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Customize" }))

    expect(
      screen.getByRole("heading", { name: "Cookie preferences" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Choose which optional tools can load. Necessary cookies are always on.",
      ),
    ).toBeInTheDocument()
  })

  it("keeps custom copy when the user opens preferences", async () => {
    renderBanner(
      <OpenCookieBanner
        title="Your cookie choices"
        description="Pick the optional tools this site can use."
      />,
    )

    expect(
      await screen.findByRole("heading", { name: "Your cookie choices" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Pick the optional tools this site can use."),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Customize" }))

    expect(
      screen.getByRole("heading", { name: "Your cookie choices" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Pick the optional tools this site can use."),
    ).toBeInTheDocument()
    expect(screen.queryByText("Cookie preferences")).not.toBeInTheDocument()
  })

  it("honors custom action labels while preserving reject and accept behavior", async () => {
    renderBanner(
      <OpenCookieBanner
        acceptLabel="Allow cookies"
        rejectLabel="No thanks"
        customizeLabel="Pick options"
        saveLabel="Keep selection"
      />,
    )

    fireEvent.click(await screen.findByRole("button", { name: "Pick options" }))
    expect(screen.getByRole("button", { name: "No thanks" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Allow cookies" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Keep selection" }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "No thanks" }))

    expect(screen.queryByLabelText("Cookie consent")).not.toBeInTheDocument()
    expect(
      JSON.parse(localStorage.getItem("opencookie.consent") ?? "null"),
    ).toMatchObject({
      choices: {
        necessary: true,
        analytics: false,
      },
    })
  })

  it("always keeps required categories enabled when saving customized choices", async () => {
    renderBanner(<OpenCookieBanner />)

    fireEvent.click(await screen.findByRole("button", { name: "Customize" }))

    expect(screen.getByLabelText(/Necessary/)).toBeDisabled()
    expect(screen.getByLabelText(/Necessary/)).toBeChecked()

    fireEvent.click(screen.getByRole("button", { name: "Save choices" }))

    expect(
      JSON.parse(localStorage.getItem("opencookie.consent") ?? "null"),
    ).toMatchObject({
      choices: {
        necessary: true,
        analytics: false,
      },
    })
  })
})
