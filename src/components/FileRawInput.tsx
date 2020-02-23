import cc from "classnames"
import React from "react"

import { FormHook } from "../form"
import { useFieldFile } from "../form/useFieldFile"
import { FileDef } from "./FileInput"
import { RawInputWithIcon } from "./RawInputWithIcon"
import { useTheme } from "./ThemeProvider"

export interface FileRawInputProps {
  form?: FormHook<any>
  errorMessage?: string
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
}

export function FileRawInput(props: FileRawInputProps) {
  const { form, accept, errorMessage } = props
  const { value, name, status, disabled, onChange, deleteFile } = useFieldFile(form, props)
  const theme = useTheme()
  const className = cc(theme.form.control.raw, errorMessage && theme.form.control.error)

  switch (status) {
    case "loading":
    case "deleting":
      return (
        <RawInputWithIcon
          icon="loading"
          className={className}
          value={value.deleting ? `Deleting ${value.name || "file"}...` : `Uploading ${value.name || "file"}...`}
          name={name}
          type="text"
          disabled
        />
      )
    case "file":
      return (
        <RawInputWithIcon
          icon="trash"
          onClick={deleteFile}
          className={className}
          value={value.name || value.url}
          name={name}
          type="text"
          disabled
        />
      )
    case "empty":
      return (
        <input
          className={className}
          type="file"
          disabled={disabled}
          name={name}
          autoComplete="off"
          accept={accept || "image/*, video/*"}
          onChange={onChange}
        />
      )
  }
}
