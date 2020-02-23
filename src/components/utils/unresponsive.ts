/** Mappings between our props and tailwindcss' classnames */
const MAPPINGS = {
  borderRadius: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  },
  objectFit: {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  },
  italic: {
    true: "italic",
    false: "not-italic",
  },
  fontWeight: {
    "100": "font-hairline",
    "200": "font-thin",
    "300": "font-light",
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    "800": "font-extrabold",
    "900": "font-black",
  },
}

export function getUnresponsiveFromPropName(props: any, propName: string): string {
  return getUnresponsiveFromPropValue(props[propName], propName)
}

export function getUnresponsiveFromPropValue(propValue: any, propName: string) {
  const classNames = MAPPINGS[propName]
  if (!propValue || !classNames) {
    return ""
  }
  return classNames[String(propValue || "")] || ""
}
