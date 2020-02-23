import { useFormik, FormikConfig, FormikState, FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik"
import { ChangeEvent, FormEvent, useMemo } from "react"

import { DocumentHook, DocumentsHook } from "common/firebase/hooks"
import { StringMap } from "common/types"

export interface SubmitError {
  message: string
  type?: string
}

export interface SubmitResult {
  error?: string
  errors?: StringMap<string>
}

export interface UseFormOptions<Values> extends Omit<FormikConfig<Values>, "onSubmit" | "initialValues"> {
  initialValues?: Values
  document?: DocumentHook<Values> | DocumentsHook<Values>
  onSubmit?(values: Values): void | SubmitResult | Promise<void | SubmitResult>
}

export interface NestedStringMap<T> {
  [key: string]: T | NestedStringMap<T>
}

export interface FormHook<Values = any> {
  initialValues: Values
  initialErrors: NestedStringMap<string>
  initialTouched: NestedStringMap<boolean>
  initialStatus: any
  handleBlur: (eventOrString: any) => void | ((e: any) => void)
  handleChange: (
    eventOrPath: string | ChangeEvent<any>
  ) => void | ((eventOrTextValue: string | ChangeEvent<any>) => void)
  handleReset: (e: any) => void
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void
  resetForm: (nextState?: Partial<FormikState<Values>> | undefined) => void
  setErrors: (errors: StringMap<any>) => void
  setFormikState: (stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>)) => void
  setFieldTouched: (field: string, touched?: boolean, shouldValidate?: boolean | undefined) => any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any
  setFieldError: (field: string, value: string | undefined) => void
  setStatus: (status: any) => void
  setSubmitting: (isSubmitting: boolean) => void
  setTouched: (touched: NestedStringMap<boolean>, shouldValidate?: boolean | undefined) => any
  setValues: (values: Values, shouldValidate?: boolean | undefined) => any
  submitForm: () => Promise<void | undefined>
  validateForm: (values?: Values) => Promise<NestedStringMap<string>>
  validateField: (name: string) => Promise<void> | Promise<string | undefined>
  isValid: boolean
  dirty: boolean
  unregisterField: (name: string) => void
  registerField: (name: string, { validate }: any) => void
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>
  getFieldMeta: (name: string) => FieldMetaProps<any>
  getFieldHelpers: (name: string) => FieldHelperProps<any>
  validateOnBlur: boolean
  validateOnChange: boolean
  validateOnMount: boolean
  values: Values
  errors: NestedStringMap<string>
  touched: NestedStringMap<boolean>
  isSubmitting: boolean
  isValidating: boolean
  status?: any
  submitCount: number
}

function getOnSubmit<Values>(options?: UseFormOptions<Values>) {
  const { onSubmit, document } = options || {}
  if (document) {
    return async (values: Values, form: FormHook<Values>) => {
      try {
        await document.set(values)
      } catch (err) {
        console.error("Error while setting document.", err)
        form.setStatus("An error occurred while saving!")
      }
    }
  }
  if (onSubmit) {
    return async (values: Values, form: FormHook<Values>) => {
      const result = await onSubmit(values)
      if (!result) {
        return
      }

      if (result.error) {
        form.setStatus(result.error)
      }
      if (result.errors) {
        form.setErrors(result.errors)
      }
    }
  }
}

export function useForm<Values = any>(options?: UseFormOptions<Values>): FormHook<Values> {
  const onSubmitDeps = [options && options.document, options && options.onSubmit]
  const onSubmit = useMemo<any>(() => getOnSubmit(options), onSubmitDeps)
  const initialValues: any = (options && options.initialValues) || {}
  const formik = useFormik({ ...options, onSubmit, initialValues })

  if (options.document) {
    options.document.setForm(formik)
  }

  return formik as any
}
