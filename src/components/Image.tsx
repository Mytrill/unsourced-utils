import cc from "classnames"
import React from "react"

import { BorderRadius, ResponsiveProp } from "./types"
import { getResponsiveFromPropName, getUnresponsiveFromPropName } from "./utils"

export interface ImageProps {
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  borderRadius?: ResponsiveProp<BorderRadius>
  height?: string | number
  width?: string | number
  src: string
  alt?: string
  className?: string
}

export function Image(props: ImageProps) {
  const { height, width, src, alt } = props
  const className = cc(
    getUnresponsiveFromPropName(props, "objectFit"),
    getResponsiveFromPropName(props, "borderRadius"),
    props.className
  )

  if (!src) return <div />

  return <img className={className} src={src} alt={alt} height={height} width={width} style={{ height: "inherit" }} />
}
