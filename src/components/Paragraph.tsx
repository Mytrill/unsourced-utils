import React from "react"

import { FontSize, FontWeight, ResponsiveProp, TextAlign } from "./types"
import { geAllFromProps } from "./utils"

export interface ParagraphProps {
  fontSize?: ResponsiveProp<FontSize>
  fontWeight?: FontWeight
  textAlign?: ResponsiveProp<TextAlign>
  whitespace?: ResponsiveProp<"normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap">
  wordBreak?: ResponsiveProp<"normal" | "word" | "all" | "truncate">
  italic?: boolean
  lineHeight?: ResponsiveProp<"1" | "1.25" | "1.375" | "1.5" | "1.625" | "2">
  className?: string
  children?: any
}

export function Paragraph(props: ParagraphProps) {
  const className = geAllFromProps(props, "mb-4")
  return <p className={className}>{props.children}</p>
}
