import React from "react"

import { geAllFromProps } from "./utils"

export interface ListItemProps {
  className?: string
  children?: any
}

export function ListItem(props: ListItemProps) {
  const { children } = props
  const className = geAllFromProps(props, "mb-2 list-inside")
  return <li className={className}>{children}</li>
}
