import React from "react"

import { BorderRadius, Display, ResponsiveProp, TextAlign } from "./types"
import { geAllFromProps } from "./utils"

export interface DivProps {
  divKey?: string

  display?: ResponsiveProp<Display>
  borderRadius?: ResponsiveProp<BorderRadius>

  flexDirection?: ResponsiveProp<"row" | "column">
  alignItems?: ResponsiveProp<"center" | "flex-start" | "flex-end" | "stretch">
  alignContent?: ResponsiveProp<"center" | "flex-start" | "flex-end" | "space-between" | "space-around">
  alignSelf?: ResponsiveProp<"center" | "flex-start" | "flex-end" | "stretch">
  justifyContent?: ResponsiveProp<"center" | "flex-start" | "flex-end" | "space-between" | "space-around">
  flexWrap?: ResponsiveProp<"wrap" | "nowrap" | "wrap-reverse">
  flex?: ResponsiveProp<"none" | "0 1 auto" | "1 1 auto" | "1 1 0%">
  textAlign?: ResponsiveProp<TextAlign>

  divRef?: any

  className?: string
  children?: any
  style?: any
}

export function Div(props: DivProps) {
  const className = geAllFromProps(props)
  const { style } = props

  return (
    <div key={props.divKey} ref={props.divRef} className={className} style={style}>
      {props.children}
    </div>
  )
}
