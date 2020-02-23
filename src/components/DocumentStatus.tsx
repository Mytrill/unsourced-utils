import React from "react"

import { DocumentHook, DocumentsHook } from "../firebase/hooks"
import { Div } from "./Div"
import { Heading } from "./Heading"
import { Paragraph } from "./Paragraph"

export interface DocumentStatusProps {
  document: DocumentHook<any> | DocumentsHook<any>
}

export function DocumentStatus(props: DocumentStatusProps) {
  const { document } = props

  if (document.error) {
    return (
      <Div>
        <Heading level="1">Error!</Heading>
        <Paragraph>{document.error}</Paragraph>
      </Div>
    )
  }

  return <Div>Loading...</Div>
}
