import cc from "classnames"
import React from "react"

import { useErrorMessage, useFieldProps, useFormFromContext } from "../form"
import { FormFieldError } from "./FormFieldError"
import { FormFieldHint } from "./FormFieldHint"
import { useTheme } from "./ThemeProvider"

export interface CheckboxProps {
  value?: boolean
  name?: string
  label?: string
  disabled?: boolean
  setValue?(value: boolean)
  error?: string
  className?: string
  hint?: string
}

export function Checkbox(props: CheckboxProps) {
  const { label, name, error, disabled, setValue, value, className, hint } = props
  const form = useFormFromContext()
  const errorMessage = useErrorMessage({ form, name, error })
  const inputProps = useFieldProps<any>(form, { name, disabled, setValue, value })
  const theme = useTheme()

  return (
    <label className={cc(theme.form.field.wrapper, theme.form.field.label, className)}>
      <input className="mr-2" type="checkbox" {...inputProps} />
      {label && <span>{label}</span>}
      <FormFieldError error={errorMessage} />
      <FormFieldHint hint={hint} error={errorMessage} />
    </label>
  )
}
