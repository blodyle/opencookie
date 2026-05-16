import type { OpenCookieBannerTone } from "./banner-copy";

export type OpenCookieBannerLayout = "banner" | "dialog";

export interface OpenCookieBannerProps {
  layout?: OpenCookieBannerLayout;
  tone?: OpenCookieBannerTone;
  title?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  saveLabel?: string;
}
