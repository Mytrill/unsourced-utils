import React from "react"

import { useOutsideClick } from "../utils/useOutsideClick"
import { Button, ButtonStyle } from "./Button"
import { Icon, IconName } from "./Icon"

export interface DropdownMenuProps {
  label?: string
  icon?: IconName
  style?: ButtonStyle
  className?: string
  children?: any
  right?: boolean
  iconContainerClass?: string
  containerClassName?: string
  itemsClass?: string
  iconOpen?: IconName
}

export function DropdownMenu(props: DropdownMenuProps) {
  const { label, icon, style, className, right, iconContainerClass, containerClassName, itemsClass, children } = props
  const iconOpen = props.iconOpen ? props.iconOpen : props.icon
  const [open, setOpen] = React.useState<boolean>(false)
  const menuRef = useOutsideClick(() => setOpen(false))

  return (
    <div className={"relative " + containerClassName ? containerClassName : ""}>
      <Button
        style={style}
        onClick={() => setOpen(!open)}
        buttonRef={menuRef}
        className={"flex items-center " + (className || "")}
      >
        {label}
        <div className={iconContainerClass}>
          {icon && <Icon name={open ? iconOpen : icon} size="small" className="mx-2" />}
        </div>
      </Button>
      <div
        style={{ display: open ? "block" : "none", right: right ? 0 : undefined }}
        className={
          itemsClass ? itemsClass : "border rounded w-64 text-gray-700 leading-tight mt-1 z-10 absolute bg-white"
        }
      >
        {children}
      </div>
    </div>
  )
}
