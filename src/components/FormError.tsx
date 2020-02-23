import cc from "classnames"
import React from "react"

import { useFormFromContext } from "../form"
import { useTheme } from "./ThemeProvider"

export interface FormErrorProps {
  className?: string
}

export function FormError(props: FormErrorProps) {
  const form = useFormFromContext()
  const error = form && form.status
  const theme = useTheme()
  if (!error) {
    return <span />
  }

  const className = cc(theme.form.error, props.className)
  return <span className={className}>{String(error)}</span>
}
