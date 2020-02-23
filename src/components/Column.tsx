import cc from "classnames"
import React from "react"

import { ResponsiveProp } from "./types"
import { getResponsiveFromPropValue } from "./utils"

export type ColumnSize = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | number

export interface ColumnProps {
  size?: ResponsiveProp<ColumnSize>
  className?: string
  children?: any
}

export function Column(props: ColumnProps) {
  const className = cc(getResponsiveFromPropValue(props.size, "size"), props.className)
  return <div className={className}>{props.children}</div>
}
