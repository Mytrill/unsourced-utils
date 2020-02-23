import React from "react"

import { Display, FontSize, FontWeight, ResponsiveProp } from "./types"
import { geAllFromProps } from "./utils"

export interface SpanProps {
  display?: ResponsiveProp<Display>
  fontSize?: ResponsiveProp<FontSize>
  fontWeight?: FontWeight
  italic?: boolean
  className?: string
  children?: any
}

export function Span(props: SpanProps) {
  const className = geAllFromProps(props)
  return <span className={className}>{props.children}</span>
}
