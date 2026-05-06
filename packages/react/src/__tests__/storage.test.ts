import { describe, expect, it } from "vitest"
import {
  createAcceptAllChoices,
  createRejectAllChoices,
  normalizeChoices,
} from "../storage"
import type { OpenCookieConfig } from "../types"

const config: OpenCookieConfig = {
  version: "1",
  categories: [
    { id: "necessary", label: "Necessary", required: true },
    { id: "analytics", label: "Analytics" },
    { id: "marketing", label: "Marketing" },
  ],
}

describe("consent choice normalization", () => {
  it("keeps required categories granted when the user rejects optional categories", () => {
    expect(createRejectAllChoices(config)).toEqual({
      necessary: true,
      analytics: false,
      marketing: false,
    })
  })

  it("grants every configured category for accept all", () => {
    expect(createAcceptAllChoices(config)).toEqual({
      necessary: true,
      analytics: true,
      marketing: true,
    })
  })

  it("ignores unknown categories and fills missing optional categories as denied", () => {
    expect(
      normalizeChoices(config, {
        necessary: false,
        marketing: true,
        unknown: true,
      }),
    ).toEqual({
      necessary: true,
      analytics: false,
      marketing: true,
    })
  })
})
