import type { CSSProperties } from "react";

interface CookieIconProps {
  isMobile: boolean;
}

export function CookieIcon(props: CookieIconProps) {
  return (
    <span aria-hidden="true" style={getIconFrameStyle(props.isMobile)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="40 35 390 390"
        width="100%"
        height="100%"
      >
        <defs>
          <radialGradient id="cookieGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fad696" />
            <stop offset="40%" stopColor="#e3ab59" />
            <stop offset="85%" stopColor="#c4832b" />
            <stop offset="100%" stopColor="#9c641c" />
          </radialGradient>

          <linearGradient id="chipGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#5a3515" />
            <stop offset="50%" stopColor="#381e08" />
            <stop offset="100%" stopColor="#241103" />
          </linearGradient>

          <filter id="dropShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow
              dx="8"
              dy="12"
              stdDeviation="8"
              floodColor="#2a1604"
              floodOpacity="0.35"
            />
          </filter>

          <mask id="biteMask">
            <rect x="0" y="0" width="500" height="500" fill="white" />
            <g fill="black">
              <circle cx="430" cy="60" r="80" />
              <circle cx="360" cy="110" r="45" />
              <circle cx="320" cy="70" r="35" />
              <circle cx="390" cy="160" r="35" />
              <circle cx="310" cy="110" r="30" />
              <circle cx="340" cy="150" r="30" />
              <circle cx="280" cy="80" r="25" />
              <circle cx="390" cy="200" r="25" />
            </g>
          </mask>

          <g id="chip1">
            <path
              d="M -9,-11 C 1,-15 11,-9 13,-1 C 15,7 9,15 -1,13 C -11,11 -15,3 -9,-11 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -5,-7 C -3,-9 1,-9 3,-5 C 3,-3 -3,-3 -5,-7 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-3" cy="-6" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
          <g id="chip2">
            <path
              d="M 0,-13 C 11,-13 15,-3 11,7 C 7,15 -7,15 -13,7 C -17,-1 -11,-13 0,-13 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -3,-9 C 1,-9 3,-5 1,-3 C -3,-5 -5,-7 -3,-9 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-1" cy="-7" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
          <g id="chip3">
            <path
              d="M -11,-6 C -6,-13 4,-16 13,-9 C 17,-3 15,7 9,11 C 1,17 -13,11 -11,-6 Z"
              fill="url(#chipGrad)"
            />
            <path
              d="M -7,-7 C -3,-9 3,-7 1,-3 C -3,-5 -5,-5 -7,-7 Z"
              fill="#8a562b"
              opacity="0.6"
            />
            <circle cx="-4" cy="-5" r="1.5" fill="#ffffff" opacity="0.3" />
          </g>
        </defs>

        <g mask="url(#biteMask)" filter="url(#dropShadow)">
          <path
            d="M 230, 70
             C 280, 65  330, 90  360, 140
             C 390, 190 395, 260 360, 320
             C 320, 380 260, 400 190, 380
             C 120, 360 70,  310 60,  240
             C 50,  170 110, 90  170, 75
             C 190, 70  210, 75  230, 70 Z"
            fill="url(#cookieGrad)"
          />

          <g
            stroke="#b0782d"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          >
            <path d="M 140,180 Q 155,190 150,210" />
            <path d="M 260,150 Q 240,140 230,160" />
            <path d="M 190,260 Q 210,270 200,290" />
            <path d="M 290,280 Q 310,270 320,290" />
            <path d="M 170,110 Q 185,120 180,140" />
            <path d="M 220,340 Q 200,350 210,370" />
            <path d="M 330,230 Q 310,220 300,240" />
          </g>

          <g
            stroke="#fae0ad"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          >
            <path d="M 135,175 Q 150,185 145,205" />
            <path d="M 255,145 Q 235,135 225,155" />
            <path d="M 185,255 Q 205,265 195,285" />
            <path d="M 285,275 Q 305,265 315,285" />
          </g>

          <g fill="#9c641c" opacity="0.35">
            <circle cx="150" cy="150" r="2.5" />
            <circle cx="160" cy="140" r="1.5" />
            <circle cx="210" cy="280" r="2" />
            <circle cx="220" cy="290" r="1.5" />
            <circle cx="120" cy="250" r="2.5" />
            <circle cx="310" cy="200" r="1.5" />
            <circle cx="320" cy="210" r="2.5" />
            <circle cx="280" cy="330" r="2" />
            <circle cx="250" cy="110" r="2.5" />
            <circle cx="180" cy="350" r="2" />
          </g>

          <g fill="#ffffff" opacity="0.25">
            <circle cx="153" cy="153" r="2.5" />
            <circle cx="213" cy="283" r="2" />
            <circle cx="123" cy="253" r="2.5" />
            <circle cx="313" cy="203" r="1.5" />
            <circle cx="283" cy="333" r="2" />
          </g>

          <use
            href="#chip1"
            transform="translate(140, 180) scale(1.4) rotate(15)"
          />
          <use
            href="#chip2"
            transform="translate(260, 150) scale(1.6) rotate(-20)"
          />
          <use
            href="#chip3"
            transform="translate(190, 260) scale(1.8) rotate(45)"
          />
          <use
            href="#chip1"
            transform="translate(290, 280) scale(1.3) rotate(80)"
          />
          <use
            href="#chip2"
            transform="translate(130, 290) scale(1.5) rotate(-60)"
          />
          <use
            href="#chip3"
            transform="translate(220, 340) scale(1.2) rotate(110)"
          />

          <use
            href="#chip1"
            transform="translate(100, 230) scale(1) rotate(5)"
          />
          <use
            href="#chip2"
            transform="translate(330, 230) scale(1.4) rotate(90)"
          />
          <use
            href="#chip3"
            transform="translate(320, 320) scale(1.1) rotate(30)"
          />
          <use
            href="#chip1"
            transform="translate(170, 110) scale(1.5) rotate(140)"
          />
          <use
            href="#chip2"
            transform="translate(220, 190) scale(1) rotate(-15)"
          />

          <use
            href="#chip3"
            transform="translate(300, 90) scale(1.3) rotate(25)"
          />
          <use
            href="#chip1"
            transform="translate(370, 270) scale(1.2) rotate(60)"
          />
          <use
            href="#chip2"
            transform="translate(140, 340) scale(1.1) rotate(-45)"
          />
          <use
            href="#chip3"
            transform="translate(80, 280) scale(1) rotate(10)"
          />
          <use
            href="#chip1"
            transform="translate(260, 370) scale(1.4) rotate(85)"
          />
        </g>
      </svg>
    </span>
  );
}

function getIconFrameStyle(isMobile: boolean): CSSProperties {
  const size = isMobile ? 44 : 40;

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
    width: size,
    height: size,
  };
}
