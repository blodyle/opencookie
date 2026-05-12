import { useEffect, useState } from "react";
import { getBannerCopy, preferencesCopy } from "./banner-copy";
import { useOpenCookie } from "./provider";
import type { OpenCookieBannerProps } from "./banner-types";
import type { ConsentChoices } from "./types";

export function useOpenCookieBannerState(props: OpenCookieBannerProps) {
  const consent = useOpenCookie();
  const isMobile = useMediaQuery("(max-width: 520px)");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draftChoices, setDraftChoices] = useState<ConsentChoices>(
    consent.choices,
  );
  const [focusedCategoryId, setFocusedCategoryId] = useState<string | null>(
    null,
  );

  const isPreferencesView = isCustomizing || consent.isSettingsOpen;
  const copy = resolveBannerCopy(props, isPreferencesView);

  useEffect(() => {
    setDraftChoices(consent.choices);
  }, [consent.choices]);

  return {
    consent,
    isMobile,
    isPreferencesView,
    draftChoices,
    setDraftChoices,
    focusedCategoryId,
    setFocusedCategoryId,
    setIsCustomizing,
    copy,
  };
}

function resolveBannerCopy(
  props: OpenCookieBannerProps,
  isPreferencesView: boolean,
) {
  const defaultCopy = getBannerCopy(props.tone ?? "default");
  const title = props.title ?? defaultCopy.title;
  const description = props.description ?? defaultCopy.description;

  return {
    title: isPreferencesView && !props.title ? preferencesCopy.title : title,
    description:
      isPreferencesView && !props.description
        ? preferencesCopy.description
        : description,
  };
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    function update() {
      setMatches(media.matches);
    }

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
