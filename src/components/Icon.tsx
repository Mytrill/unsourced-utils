import React from "react"

import { StringMap } from "../types"
import { Svg } from "./Svg"

//
// Note: this is a big work in progress, let's discuss once we actually use this...
//

// list of free icons:
// https://leungwensen.github.io/svg-icon/ - collection of all big libraries as icon svgs
// http://www.zondicons.com/icons.html - lots of high quality icons
// https://github.com/adamwathan/entypo-optimized - random icons, may be needed for weird things
// https://feathericons.com/ - lots of icons with simplish styling
// https://github.com/sschoger/heroicons-ui - very simple icons
// https://simpleicons.org/ - a ton of popular brand icons, very detailed

// taken from zondicons - the ones that I am not sure we'll need are commented out
const ICONS = {
  "arrow-down": <path d="M9 16.172l-6.071-6.071-1.414 1.414L10 20l.707-.707 7.778-7.778-1.414-1.414L11 16.172V0H9z" />,
  "arrow-up": <path d="M9 3.828L2.929 9.899 1.515 8.485 10 0l.707.707 7.778 7.778-1.414 1.414L11 3.828V20H9V3.828z" />,
  // "arrow-left": (
  //   <path d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z" />
  // ),
  // "arrow-right": <path d="M16.172 9l-6.071-6.071 1.414-1.414L20 10l-.707.707-7.778 7.778-1.414-1.414L16.172 11H0V9z" />,
  calendar: (
    <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" />
  ),
  "chart-bar": <path d="M1 10h3v10H1V10zM6 0h3v20H6V0zm5 8h3v12h-3V8zm5-4h3v16h-3V4z" />,
  "chevron-down": <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />,
  "chevron-left": <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />,
  "chevron-right": <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />,
  "chevron-up": <path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" />,
  close: (
    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
  ),
  cog: (
    <path d="M3.94 6.5L2.22 3.64l1.42-1.42L6.5 3.94c.52-.3 1.1-.54 1.7-.7L9 0h2l.8 3.24c.6.16 1.18.4 1.7.7l2.86-1.72 1.42 1.42-1.72 2.86c.3.52.54 1.1.7 1.7L20 9v2l-3.24.8c-.16.6-.4 1.18-.7 1.7l1.72 2.86-1.42 1.42-2.86-1.72c-.52.3-1.1.54-1.7.7L11 20H9l-.8-3.24c-.6-.16-1.18-.4-1.7-.7l-2.86 1.72-1.42-1.42 1.72-2.86c-.3-.52-.54-1.1-.7-1.7L0 11V9l3.24-.8c.16-.6.4-1.18.7-1.7zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  ),
  // download: <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />,
  edit: <path d="M2 4v14h14v-6l2-2v10H0V2h10L8 4H2zm10.3-.3l4 4L8 16H4v-4l8.3-8.3zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />,
  // "edit-pencil": <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />,
  "full-screen": (
    <path d="M2.8 15.8L0 13v7h7l-2.8-2.8 4.34-4.32-1.42-1.42L2.8 15.8zM17.2 4.2L20 7V0h-7l2.8 2.8-4.34 4.32 1.42 1.42L17.2 4.2zm-1.4 13L13 20h7v-7l-2.8 2.8-4.32-4.34-1.42 1.42 4.33 4.33zM4.2 2.8L7 0H0v7l2.8-2.8 4.32 4.34 1.42-1.42L4.2 2.8z" />
  ),
  menu: <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />,
  // refresh: (
  //   <path d="M10 3v2a5 5 0 0 0-3.54 8.54l-1.41 1.41A7 7 0 0 1 10 3zm4.95 2.05A7 7 0 0 1 10 17v-2a5 5 0 0 0 3.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z" />
  // ),
  // reload: <path d="M14.66 15.66A8 8 0 1 1 17 10h-2a6 6 0 1 0-1.76 4.24l1.42 1.42zM12 10h8l-4 4-4-4z" />,
  trash: <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />,
  // upload: <path d="M13 10v6H7v-6H2l8-8 8 8h-5zM0 18h20v2H0v-2z" />,
  user: (
    <path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
  ),
  "view-hide": (
    <path d="M12.81 4.36l-1.77 1.78a4 4 0 0 0-4.9 4.9l-2.76 2.75C2.06 12.79.96 11.49.2 10a11 11 0 0 1 12.6-5.64zm3.8 1.85c1.33 1 2.43 2.3 3.2 3.79a11 11 0 0 1-12.62 5.64l1.77-1.78a4 4 0 0 0 4.9-4.9l2.76-2.75zm-.25-3.99l1.42 1.42L3.64 17.78l-1.42-1.42L16.36 2.22z" />
  ),
  "view-show": (
    <path d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
  ),
  loading: (
    <path d="M10.02.56A9.46 9.46 0 00.59 10c0 5.2 4.23 9.45 9.43 9.45a1.32 1.32 0 001.32-1.33 1.32 1.32 0 00-1.32-1.32A6.77 6.77 0 013.23 10c0-3.77 3.02-6.8 6.79-6.8A6.77 6.77 0 0116.8 10a1.32 1.32 0 001.32 1.32A1.32 1.32 0 0019.45 10c0-5.2-4.24-9.44-9.43-9.44z">
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 10 10"
        to="360 10 10"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </path>
  ),
  bold: (
    <path d="M0 0v1c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1v1h5.5c1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.44-2.25.27-.34.44-.78.44-1.25 0-1.1-.89-2-2-2h-5zm3 1h1c.55 0 1 .45 1 1s-.45 1-1 1h-1v-2zm0 3h1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1.5v-3z" />
  ),
}

// the viewbox for all zondicon icons
const VIEWBOX = "0 0 20 20"

const VIEWBOXES: StringMap<string> = {
  bold: "0 0 8 8",
}

const SIZES = {
  xsmall: "12px",
  small: "16px",
  normal: "24px",
  large: "32px",
  xlarge: "48px",
  xxlarge: "64px",
}

export type IconName = keyof typeof ICONS

export type Size = keyof typeof SIZES

export interface IconProps {
  name: IconName
  size?: Size
  alt?: string
  className?: string
  style?: any
}

export function Icon(props: IconProps) {
  const size = SIZES[props.size || "normal"]
  const viewBox = VIEWBOXES[props.name] || VIEWBOX
  return (
    <Svg height={size} width={size} viewBox={viewBox} className={props.className} style={props.style} fillCurrent>
      {ICONS[props.name]}
    </Svg>
  )
}
