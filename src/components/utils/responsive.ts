// The following code is used to recognize this file in postcss.config.js, DO NOT CHANGE
// @postcss:add-responsive-prefixes

/** Mappings between our props and tailwindcss' classnames */
const MAPPINGS = {
  display: {
    none: "hidden",
    block: "block",
    inline: "inline",
    flex: "flex",
    "inline-block": "inline-block",
  },
  flexDirection: {
    row: "flex-row",
    column: "flex-col",
  },
  alignItems: {
    // DO NOT REMOVE, USED IN postcss.config.js
    center: "items-center",
    "flex-start": "items-start",
    "flex-end": "items-end",
    stretch: "items-stretch",
  },
  alignContent: {
    // DO NOT REMOVE, USED IN postcss.config.js
    center: "content-center",
    "flex-start": "content-start",
    "flex-end": "content-end",
    "space-between": "content-between",
    "space-around": "content-around",
  },
  justifyContent: {
    // DO NOT REMOVE, USED IN postcss.config.js
    center: "justify-center",
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
  },
  alignSelf: {
    center: "self-center",
    "flex-start": "self-start",
    "flex-end": "self-end",
    stretch: "self-stretch",
  },
  flexWrap: {
    wrap: "flex-wrap",
    nowrap: "flex-no-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  },
  flex: {
    none: "flex-none",
    "0 1 auto": "flex-initial",
    "1 1 0%": "flex-1",
    "1 1 auto": "flex-auto",
  },
  // DO NOT REMOVE, USED IN postcss.config.js
  size: {
    "1": "w-1/12",
    "2": "w-2/12",
    "3": "w-3/12",
    "4": "w-4/12",
    "5": "w-5/12",
    "6": "w-6/12",
    "7": "w-7/12",
    "8": "w-8/12",
    "9": "w-9/12",
    "10": "w-10/12",
    "11": "w-11/12",
    "12": "w-full",
  },
  fontSize: {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  },
  textAlign: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  },
  whitespace: {
    normal: "whitespace-normal",
    nowrap: "whitespace-no-wrap",
    pre: "whitespace-pre",
    "pre-line": "whitespace-pre-line",
    "pre-wrap": "whitespace-pre-wrap",
  },
  wordBreak: {
    // DO NOT REMOVE, USED IN postcss.config.js
    normal: "break-normal",
    word: "break-words",
    all: "break-all",
    truncate: "truncate",
  },
  lineHeight: {
    "1": "leading-none",
    "1.25": "leading-tight",
    "1.375": "leading-snug",
    "1.5": "leading-normal",
    "1.625": "leading-relaxed",
    "2": "leading-loose",
  },
}

const PREFIXES = ["", "sm:", "md:", "lg:", "xl:"]

export function getResponsiveFromPropName(props: any, propName: string): string {
  return getResponsiveFromPropValue(props[propName], propName)
}

export function getResponsiveFromPropValue(propValue: any | any[], propName: string) {
  const classNames = MAPPINGS[propName]
  if (!propValue || !classNames) {
    return ""
  }
  if (typeof propValue === "string" || typeof propValue === "number" || typeof propValue === "boolean") {
    return classNames[String(propValue || "")] || ""
  }

  return propValue.map((value, index) => (classNames[value] ? PREFIXES[index] + classNames[value] : "")).join(" ")
}
