import React from "react"

import { Button } from "./Button"
import { Icon, IconName } from "./Icon"

// This component is used internally by FileInput to add an icon/icon button on the right, for a loading sign, for example
// This should be used by Input, when we need it...

export interface RawInputWithIconProps {
  icon: IconName
  onClick?(): void
  className: string
  value: any
  onChange?(event: any)
  onBlur?(event: any)
  name: string
  type: string
  disabled?: boolean
}

export function RawInputWithIcon(props: RawInputWithIconProps) {
  const { icon, onClick, ...rest } = props
  const iconElt = onClick ? (
    <Button style="icon" className="absolute inset-y-0" buttonStyle={{ right: "0.4rem" }} onClick={onClick}>
      <Icon name={icon} size="small" />
    </Button>
  ) : (
    <div className="absolute inset-y-0 flex items-center text-gray-700" style={{ right: "0.4rem" }}>
      <Icon name={icon} size="small" />
    </div>
  )
  return (
    <div className="relative">
      <input {...rest} />
      {iconElt}
    </div>
  )
}
