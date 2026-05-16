"use client"

import { useState } from "react"
import { OpenCookieBanner } from "@opencookie/react"

export function BannerDemoControls() {
  const [isDialog, setIsDialog] = useState(true)
  const [isPlayful, setIsPlayful] = useState(true)

  return (
    <>
      <div className="demo-controls" aria-label="Cookie banner demo options">
        <label className="switch-field">
          <span>
            <strong>Prominent dialog</strong>
            <small>Center the banner with a darker backdrop.</small>
          </span>
          <span className="switch">
            <input
              type="checkbox"
              checked={isDialog}
              onChange={(event) => setIsDialog(event.target.checked)}
            />
            <span className="switch-track" aria-hidden="true">
              <span className="switch-thumb" />
            </span>
          </span>
        </label>

        <label className="switch-field">
          <span>
            <strong>Playful tone</strong>
            <small>Use the lighter default copy.</small>
          </span>
          <span className="switch">
            <input
              type="checkbox"
              checked={isPlayful}
              onChange={(event) => setIsPlayful(event.target.checked)}
            />
            <span className="switch-track" aria-hidden="true">
              <span className="switch-thumb" />
            </span>
          </span>
        </label>
      </div>

      <OpenCookieBanner
        layout={isDialog ? "dialog" : "banner"}
        tone={isPlayful ? "playful" : "default"}
      />
    </>
  )
}
