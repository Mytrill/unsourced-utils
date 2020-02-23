import React from "react"

import { Button, ButtonProps } from "./Button"

export interface ModalProps {
  onClose()
}

export interface ModalButtonProps extends ButtonProps {
  modal: React.ComponentType<ModalProps>
  modalProps?: any
}

export function ModalButton(props: ModalButtonProps) {
  const { modal: Modal, modalProps, ...rest } = props
  const [open, setOpen] = React.useState<boolean>(false)

  return (
    <React.Fragment>
      <Button {...rest} onClick={() => setOpen(true)} />
      {open && <Modal {...modalProps} onClose={() => setOpen(false)} />}
    </React.Fragment>
  )
}
