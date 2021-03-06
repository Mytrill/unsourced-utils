import React from "react"

import { useTheme } from "./ThemeProvider"

export interface FormFieldErrorProps {
  error: string
}

export function FormFieldError(props: FormFieldErrorProps) {
  const { error } = props
  const theme = useTheme()
  if (!error) {
    return <div />
  }
  return <div className={theme.form.field.error}>{String(error)}</div>
}
