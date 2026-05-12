import type { OpenCookieBannerTone } from "./banner-copy";

export interface OpenCookieBannerProps {
  tone?: OpenCookieBannerTone;
  title?: string;
  description?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  customizeLabel?: string;
  saveLabel?: string;
}
