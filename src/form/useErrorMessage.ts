import { getIn } from "formik"

import { FormHook } from "common/form/useForm"

export interface UseErrorMessagePayload {
  form?: FormHook<any>
  name?: string
  error?: string
}

export function useErrorMessage(payload: UseErrorMessagePayload): string | undefined {
  if (payload.error) {
    return payload.error
  }

  const { form, name } = payload
  if (form && name) {
    const error = getIn(form.errors, name)

    return error && (error.message || error.type)
  }
}
