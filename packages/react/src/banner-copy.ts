export type OpenCookieBannerTone = "default" | "playful";

interface BannerCopy {
  title: string;
  description: string;
}

const defaultCopy: BannerCopy = {
  title: "We value your privacy",
  description:
    "We use optional cookies to improve the site. You can accept, reject, or customize your choices.",
};

const playfulCopy: BannerCopy = {
  title: "Cookie checkpoint",
  description:
    "We brought cookies!! \n\nUnfortunately, they are the browser kind. Optional tools only load if you say yes.",
};

export const preferencesCopy: BannerCopy = {
  title: "Cookie preferences",
  description:
    "Choose which optional tools can load. Necessary cookies are always on.",
};

export function getBannerCopy(tone: OpenCookieBannerTone): BannerCopy {
  return tone === "playful" ? playfulCopy : defaultCopy;
}
