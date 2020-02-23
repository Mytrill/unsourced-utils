import React from "react"

import { Button, ButtonProps } from "./Button"
import { Div } from "./Div"
import { Modal } from "./Modal"
import { ModalButton } from "./ModalButton"
import { Paragraph } from "./Paragraph"

interface ConfirmModalProps {
  onClose()
  onClick?()
  irreversible?: boolean
}

function ConfirmModal(props: ConfirmModalProps) {
  const { onClose, onClick, irreversible } = props

  async function onConfirm() {
    if (onClick) {
      await onClick()
    }
    onClose()
  }

  return (
    <Modal onClose={onClose} header="Are you sure?">
      <Paragraph>Are you sure you want to perform this action?</Paragraph>
      {irreversible && <Paragraph fontWeight="700">This action is irreversible.</Paragraph>}
      <Div display="flex" justifyContent="flex-end" alignItems="center">
        <Button style="link" onClick={onClose}>
          Cancel
        </Button>
        <Button style="danger" onClick={onConfirm} className="ml-4">
          Delete
        </Button>
      </Div>
    </Modal>
  )
}

export interface ConfirmButtonProps extends ButtonProps {
  irreversible?: boolean
}

export function ConfirmButton(props: ConfirmButtonProps) {
  const { irreversible, onClick, ...rest } = props
  return <ModalButton {...rest} modal={ConfirmModal} modalProps={{ onClick, irreversible }} />
}
