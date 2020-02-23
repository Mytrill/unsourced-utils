import cc from "classnames"
import React from "react"

import { useErrorMessage, useFieldProps, useFormFromContext } from "../form"
import { FormFieldError } from "./FormFieldError"
import { FormFieldHint } from "./FormFieldHint"
import { FormFieldLabel } from "./FormFieldLabel"
import { useTheme } from "./ThemeProvider"

export interface InputProps {
  name?: string
  value?: string
  type?: "text" | "number" | "date" | "email" | "password"
  disabled?: boolean
  setValue?(value: string)
  label?: string
  error?: string
  hint?: string
  className?: string
}

export function Input(props: InputProps) {
  const { label, name, error, disabled, setValue, value, type, hint } = props
  const form = useFormFromContext()
  const errorMessage = useErrorMessage({ form, name, error })
  const inputProps = useFieldProps(form, { name, disabled, setValue, value })
  const theme = useTheme()
  const className = cc(theme.form.control.raw, errorMessage && theme.form.control.error)

  return (
    <div className={props.className || theme.form.field.wrapper}>
      <FormFieldLabel label={label} htmlFor={name} />
      <input {...inputProps} type={type} className={className} />
      <FormFieldError error={errorMessage} />
      <FormFieldHint hint={hint} error={errorMessage} />
    </div>
  )
}
