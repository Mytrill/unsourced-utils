import React from "react"

import { useOutsideClick } from "../utils/useOutsideClick"
import { Button } from "./Button"
import { Heading } from "./Heading"
import { Icon } from "./Icon"

export interface ModalProps {
  onClose()
  header: string
  active?: boolean
  children?: any
}

export function Modal(props: ModalProps) {
  const { onClose, active = true, header, children } = props
  const ref = useOutsideClick(onClose)
  if (!active) {
    return <div />
  }

  return (
    <div
      className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div ref={ref} className="w-11/12 md:max-w-md bg-white rounded opacity-100 z-50 overflow-y-auto p-2">
        <div className="flex justify-between items-center pb-3">
          <Heading level="3">{header}</Heading>
          <Button style="icon" onClick={onClose}>
            <Icon name="close" size="xsmall" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
