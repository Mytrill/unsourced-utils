import cc from "classnames"
import React from "react"

import { FieldOneToManyHook } from "../form"
import { useOutsideClick } from "../utils/useOutsideClick"
import { FormFieldLabel } from "./FormFieldLabel"
import { Icon } from "./Icon"
import { useTheme } from "./ThemeProvider"

interface _TagProps {
  field: FieldOneToManyHook<Tag, any>
  index: number
  tag: Tag
}

function _Tag(props: _TagProps) {
  const { field, index, tag } = props
  return (
    <div className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      {tag.label}
      <button className="inline-block ml-2 hover:text-red-700" onClick={() => field.remove(index)} type="button">
        <Icon name="close" size="xsmall" className="fill-current" />
      </button>
    </div>
  )
}

interface SearchResultProps {
  field: FieldOneToManyHook<Tag, any>
  setFocused(focused: boolean)
  result: Tag
}

function SearchResult(props: SearchResultProps) {
  const { field, result, setFocused } = props
  return (
    <button
      className="block h-12 hover:bg-gray-200 px-2 py-3 w-full text-left"
      type="button"
      onClick={() => {
        field.push(result)
        setFocused(false)
      }}
    >
      {result.label}
    </button>
  )
}

export interface Tag {
  label: string
  // color?: string
}

export interface TagListInputProps {
  field: FieldOneToManyHook<Tag, any>
  label?: string
}

export function TagListInput(props: TagListInputProps) {
  const { field, label } = props
  const [focused, setFocused] = React.useState<boolean>(false)
  const menuRef = useOutsideClick(() => setFocused(false))
  const theme = useTheme()
  const disabled = field.form.isSubmitting
  const controlClass = cc(
    theme.form.control.raw,
    disabled && theme.form.control.disabled,
    focused && theme.form.control.focused
  )

  function onFocus(e) {
    setFocused(true)
    field.search(e.target.value)
  }

  return (
    <div className={theme.form.field.wrapper}>
      <FormFieldLabel label={label} />
      <div ref={menuRef} className="relative">
        <div className={controlClass}>
          {field.values.map((v, i) => (
            <_Tag field={field} index={i} tag={v} key={i} />
          ))}
          <input
            type="text"
            style={{ minWidth: "10rem" }}
            className="flex-auto py-1"
            onFocus={onFocus}
            disabled={disabled}
          />
        </div>
        <div
          style={{ display: focused ? "block" : "none" }}
          className="border rounded w-full text-gray-700 leading-tight mt-1 z-10 absolute bg-white"
        >
          {field.searching && field.searchResults.length === 0 && <div className="h-12 px-2 py-3">Searching...</div>}
          {field.searchResults.map((r, i) => (
            <SearchResult field={field} result={r} setFocused={setFocused} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
