import React from "react"

import { useErrorMessage, useFormFromContext } from "../form"
import { Div } from "./Div"
import { FileRawInput } from "./FileRawInput"
import { FormFieldError } from "./FormFieldError"
import { FormFieldHint } from "./FormFieldHint"
import { FormFieldLabel } from "./FormFieldLabel"
import { useTheme } from "./ThemeProvider"

export interface FileDef {
  name?: string
  url?: string
  path?: string
  contentType?: string
  loading?: boolean
  deleting?: boolean
}

export interface FileInputProps {
  name?: string
  label?: string
  error?: string
  value?: FileDef
  setValue?(value: FileDef)
  disabled?: boolean
  accept?: string
  validate?(file: File): string | null
  folder?: string
  preserve?: boolean
  className?: string
  hint?: string
}

export function FileInput(props: FileInputProps) {
  const { name, label, error, className, hint } = props
  const form = useFormFromContext()
  const errorMessage = useErrorMessage({ form, name, error })
  const theme = useTheme()

  return (
    <Div className={className || theme.form.field.wrapper}>
      <FormFieldLabel label={label} htmlFor={name} />
      <FileRawInput {...props} form={form} errorMessage={errorMessage} />
      <FormFieldError error={errorMessage} />
      <FormFieldHint hint={hint} error={errorMessage} />
    </Div>
  )
}
