import React from "react"

import { Icon, IconName } from "./Icon"

export interface MenuItemProps {
  label: string
  icon?: IconName
  onClick?()
  className?: string
}

export function MenuItem(props: MenuItemProps) {
  const { label, icon, onClick, className = "" } = props

  return (
    <button className={"block h-12 hover:bg-gray-200 px-2 py-3 w-full text-left " + className} onClick={onClick}>
      {icon && <Icon name={icon} size="small" />}
      {label}
    </button>
  )
}
