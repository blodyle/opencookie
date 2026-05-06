import { defineOpenCookieConfig } from "@opencookie/react/config"

export const openCookieConfig = defineOpenCookieConfig({
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
    {
      id: "marketing",
      label: "Marketing",
      description: "Used for pixels, embeds, and similar optional tools.",
    },
  ],
  googleConsent: {
    enabled: true,
    waitForUpdate: 500,
  },
})
