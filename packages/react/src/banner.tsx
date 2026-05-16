"use client";

import { type FormEvent } from "react";
import { BannerCategoryRow } from "./banner-category-row";
import { CookieIcon } from "./banner-cookie-icon";
import {
  BannerActions,
  BannerBackdrop,
  BannerButton,
  BannerDescription,
  BannerForm,
  BannerHeader,
  BannerPanel,
  BannerSectionLabel,
  BannerStack,
  BannerTitle,
} from "./banner-ui";
import { useOpenCookieBannerState } from "./banner-state";
import type { OpenCookieBannerProps } from "./banner-types";

export function OpenCookieBanner(props: OpenCookieBannerProps) {
  const state = useOpenCookieBannerState(props);
  const layout = props.layout ?? "banner";

  if (!state.consent.shouldShowBanner && !state.consent.isSettingsOpen) {
    return null;
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.consent.saveChoices(state.draftChoices);
    state.setIsCustomizing(false);
  }

  return (
    <>
      <BannerBackdrop layout={layout} />
      <BannerPanel isMobile={state.isMobile} layout={layout}>
        <BannerHeader isMobile={state.isMobile}>
          <CookieIcon isMobile={state.isMobile} />
          <BannerTitle isMobile={state.isMobile}>{state.copy.title}</BannerTitle>
        </BannerHeader>
        <BannerDescription isMobile={state.isMobile}>
          {state.copy.description}
        </BannerDescription>

        {state.isPreferencesView ? (
          <BannerForm onSubmit={save}>
            <BannerSectionLabel>Consent categories</BannerSectionLabel>
            <BannerStack>
              {state.consent.categories.map((category) => (
                <BannerCategoryRow
                  key={category.id}
                  category={category}
                  checked={
                    category.required ||
                    state.draftChoices[category.id] === true
                  }
                  focused={state.focusedCategoryId === category.id}
                  onFocus={() => state.setFocusedCategoryId(category.id)}
                  onBlur={() => state.setFocusedCategoryId(null)}
                  onCheckedChange={(checked) =>
                    state.setDraftChoices((current) => ({
                      ...current,
                      [category.id]: checked,
                    }))
                  }
                />
              ))}
            </BannerStack>
            <BannerActions isMobile={state.isMobile}>
              <BannerButton
                isMobile={state.isMobile}
                variant="ghost"
                onClick={state.consent.rejectAll}
              >
                {props.rejectLabel ?? "Reject optional"}
              </BannerButton>
              <BannerButton
                isMobile={state.isMobile}
                variant="secondary"
                onClick={state.consent.acceptAll}
              >
                {props.acceptLabel ?? "Accept all"}
              </BannerButton>
              <BannerButton
                isMobile={state.isMobile}
                variant="primary"
                type="submit"
              >
                {props.saveLabel ?? "Save choices"}
              </BannerButton>
            </BannerActions>
          </BannerForm>
        ) : (
          <BannerActions isMobile={state.isMobile}>
            <BannerButton
              isMobile={state.isMobile}
              variant="secondary"
              order={2}
              onClick={() => state.setIsCustomizing(true)}
            >
              {props.customizeLabel ?? "Customize"}
            </BannerButton>
            <BannerButton
              isMobile={state.isMobile}
              variant="ghost"
              order={1}
              onClick={state.consent.rejectAll}
            >
              {props.rejectLabel ?? "Reject optional"}
            </BannerButton>
            <BannerButton
              isMobile={state.isMobile}
              variant="primary"
              order={3}
              onClick={state.consent.acceptAll}
            >
              {props.acceptLabel ?? "Accept all"}
            </BannerButton>
          </BannerActions>
        )}
      </BannerPanel>
    </>
  );
}
