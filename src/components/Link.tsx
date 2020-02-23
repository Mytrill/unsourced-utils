import NextLink from "next/link"
import React from "react"

import { useTheme } from "./ThemeProvider"
import { getLinkOrButtonClassName } from "./utils"

export type LinkStyle = "primary" | "secondary" | "link" | "icon" | "unstyled"

export interface LinkProps {
  href: string
  as?: string
  style?: "primary" | "secondary" | "link" | "icon" | "unstyled"
  ariaLabel?: string
  disabled?: boolean
  children?: any
  className?: string
  target?: string
}

export function Link(props: LinkProps) {
  const { href, as, style = "link", target, disabled, children } = props
  const theme = useTheme()
  const className = getLinkOrButtonClassName(theme, style, disabled, props.className)
  if (target) {
    return (
      <a href={href} className={className} target={target}>
        {children}
      </a>
    )
  }
  return (
    <NextLink href={href} as={as}>
      <a className={className}>{children}</a>
    </NextLink>
  )
}
