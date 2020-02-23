import React from "react"

import { useTheme } from "./ThemeProvider"
import { Display, ResponsiveProp } from "./types"
import { getLinkOrButtonClassName } from "./utils"

export type ButtonStyle = "primary" | "secondary" | "link" | "icon" | "unstyled" | "danger"

export interface ButtonProps {
  display?: ResponsiveProp<Display>
  style?: ButtonStyle
  disabled?: boolean
  loading?: boolean
  active?: boolean
  small?: boolean
  className?: string
  onClick?(e: React.MouseEvent): Promise<any> | void
  type?: "button" | "submit" | "reset"
  ariaLabel?: string
  tabIndex?: number
  children?: any
  buttonRef?: React.LegacyRef<HTMLButtonElement>
  buttonStyle?: any
}

export function Button(props: ButtonProps) {
  const {
    style = "secondary",
    disabled,
    className,
    display,
    loading,
    active,
    small,
    type = "button",
    buttonRef,
    buttonStyle,
    ...rest
  } = props
  const theme = useTheme()

  return (
    <button
      className={getLinkOrButtonClassName(theme, style, disabled, className)}
      disabled={disabled}
      type={type}
      ref={buttonRef}
      {...rest}
      style={buttonStyle}
    />
  )
}
