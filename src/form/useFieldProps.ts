import { getIn } from "formik"

import { FormHook } from "./useForm"

export interface GetFieldPropsPayload<Value> {
  name?: string
  value?: Value
  setValue?(value: Value)
  disabled?: boolean
}

export interface FieldProps<Value> {
  name?: string
  value?: Value
  checked?: boolean
  onChange?(e: any)
  onBlur?(e: any)
  disabled?: boolean
}

export function useFieldProps<Value = any>(
  form: FormHook<any>,
  options: GetFieldPropsPayload<Value>
): FieldProps<Value> {
  const { name, disabled } = options

  if (form && name) {
    const value = getIn(form.values, name)

    const result: FieldProps<Value> = {
      name,
      value,
      onChange: form.handleChange,
      onBlur: form.handleBlur,
      disabled: disabled || form.isSubmitting,
    }

    if (typeof value === "boolean") {
      result.checked = value
    }

    return result
  }

  const { value, setValue } = options
  return {
    name,
    value,
    disabled,
    onChange: setValue && ((e: any) => setValue(e.target.value)),
  }
}
