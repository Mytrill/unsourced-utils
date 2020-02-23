import { ChangeEvent } from "react"

import { FormHook } from "./useForm"
import { FileDef } from "common/components"
import { useFieldProps } from "./useFieldProps"
import { uploadFile, deleteFile as deleteFileFirebase } from "common/firebase/storage"

export type FileFieldHookStatus = "empty" | "loading" | "deleting" | "file"

export interface FieldFileHook {
  status: FileFieldHookStatus
  value: FileDef
  name: string
  upload(file: File): Promise<void>
  deleteFile(): Promise<void>
  onChange?(e: any)
  onBlur?(e: any)
  disabled?: boolean
}

export interface UseFieldFileOptions {
  name?: string
  value?: FileDef
  disabled?: boolean
  accept?: string
  validate?(file: File): string | null
  folder?: string
  preserve?: boolean
}

function getStatus(value: FileDef): FileFieldHookStatus {
  if (value && value.loading) return value.deleting ? "deleting" : "loading"
  if (value && value.url) return "file"
  return "empty"
}

export function useFieldFile(form: FormHook<any>, options: UseFieldFileOptions): FieldFileHook {
  const { validate } = options
  const fieldProps = useFieldProps(form, options)
  const { name, value } = fieldProps
  const status = getStatus(value)

  async function upload(file: File) {
    if (status !== "empty") {
      return
    }

    const errorMessage = validate ? validate(file) : null
    if (errorMessage) {
      form.setFieldError(name, errorMessage)
      return
    }
    form.setFieldValue(name, {
      name: file.name,
      loading: true,
    })

    try {
      const { url, path } = await uploadFile(file, options)
      const value: FileDef = {
        name: file.name,
        url,
        path,
        contentType: file.type,
      }
      // TODO add option to optimize or transform here (e.g. add dimensions for an image)
      form.setFieldValue(name, value)
    } catch (err) {
      console.log("Error while uploading file: ", err)
      form.setFieldError(name, err.message || err)
      form.setFieldValue(name, {})
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    return upload(e.target.files[0])
  }

  async function deleteFile() {
    if (status !== "file" || !value) {
      return
    }

    if (!value.path) {
      form.setFieldValue(name, {})
      return
    }

    try {
      form.setFieldValue(name, { name: value.name, loading: true, deleting: true })
      await deleteFileFirebase(value.path)
      form.setFieldValue(name, {})
    } catch (err) {
      console.log("Error while deleting file. ", err)
      form.setFieldError(name, err.message || err)
      form.setFieldValue(name, value)
    }
  }

  return {
    status,
    value,
    name,
    upload,
    onChange,
    deleteFile,
    onBlur: form.handleBlur,
    disabled: status !== "empty" || form.isSubmitting,
  }
}
