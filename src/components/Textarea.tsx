import cc from "classnames"
import React from "react"

import { useErrorMessage, useFieldProps, useFormFromContext } from "../form"
import { FormFieldError } from "./FormFieldError"
import { FormFieldHint } from "./FormFieldHint"
import { FormFieldLabel } from "./FormFieldLabel"
import { useTheme } from "./ThemeProvider"

export interface TextareaProps {
  name?: string
  value?: string
  disabled?: boolean
  setValue?(value: string)
  label?: string
  error?: string
  hint?: string
  className?: string
  rows?: number
}

export function Textarea(props: TextareaProps) {
  const { label, name, error, disabled, setValue, value, hint, rows = 5 } = props
  const form = useFormFromContext()
  const errorMessage = useErrorMessage({ form, name, error })
  const textareaProps = useFieldProps(form, { name, disabled, setValue, value })

  const theme = useTheme()
  const className = cc("resize-none block", theme.form.control.raw, errorMessage && theme.form.control.error)

  return (
    <div className={props.className || theme.form.field.wrapper}>
      <FormFieldLabel label={label} htmlFor={name} />
      <textarea {...textareaProps} rows={rows} className={className} />
      <FormFieldError error={errorMessage} />
      <FormFieldHint hint={hint} error={errorMessage} />
    </div>
  )
}
