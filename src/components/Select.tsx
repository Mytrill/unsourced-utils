import cc from "classnames"
import React from "react"

import { useErrorMessage, useFieldProps, useFormFromContext } from "../form"
import { FormFieldError } from "./FormFieldError"
import { FormFieldHint } from "./FormFieldHint"
import { FormFieldLabel } from "./FormFieldLabel"
import { useTheme } from "./ThemeProvider"

export interface SelectOption<T = any> {
  value: T
  label?: string
}

export interface SelectProps {
  options: Array<string | SelectOption>
  name?: string
  value?: string
  disabled?: boolean
  setValue?(value: string)
  label?: string
  error?: string
  hint?: string
  className?: string
}

function renderOption(option: any, i: number) {
  const label = option.label || option.value || option
  const value = option.value || option

  return (
    <option value={value} key={i}>
      {label}
    </option>
  )
}

export function Select(props: SelectProps) {
  const { label, name, error, disabled, setValue, value, options, hint } = props
  const form = useFormFromContext()
  const errorMessage = useErrorMessage({ form, name, error })
  const selectProps = useFieldProps(form, { name, disabled, setValue, value })

  const theme = useTheme()
  const className = cc("block", theme.form.control.raw, errorMessage && theme.form.control.error)

  return (
    <div className={props.className || theme.form.field.wrapper}>
      <FormFieldLabel label={label} htmlFor={name} />
      <div className="relative">
        <select {...selectProps} className={className}>
          {options.map(renderOption)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <FormFieldError error={errorMessage} />
      <FormFieldHint hint={hint} error={errorMessage} />
    </div>
  )
}
