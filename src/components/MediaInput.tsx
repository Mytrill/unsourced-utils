import React from "react"

import { useFieldProps, useFormFromContext } from "../form"
import { Div } from "./Div"
import { FileInput } from "./FileInput"
import { Image } from "./Image"
import { Input } from "./Input"
import { MediaDef } from "./Media"
import { isVideo } from "./utils/isVideo"

const Media = ({ file, responsive }) => {
  let actual = file || responsive
  if (!actual) {
    return null
  }

  if (isVideo(actual)) {
    return (
      <video autoPlay loop muted height="160" className="ml-2">
        <source src={file.url} type={file.contentType} />
      </video>
    )
  }

  return <Image height="160" src={file.url} objectFit="scale-down" className="ml-2" />
}

export interface MediaInputProps {
  name: string
  label?: string
  folder?: string
  preserve?: boolean
}

export function MediaInput(props: MediaInputProps) {
  const { name, label, folder, preserve } = props
  const form = useFormFromContext()
  const { value } = useFieldProps<MediaDef>(form, props)

  return (
    <Div display="flex">
      <Div className="flex-auto">
        <FileInput label={label ? label : "Image"} name={name + ".file"} folder={folder} preserve={preserve} />
        <Input label={label ? label + " Alt Text" : "Image Alt Text"} name={name + ".alt"} />
        <FileInput
          label={label ? label + " (mobile only)" : "Image (mobile only)"}
          name={name + ".responsive"}
          folder={folder}
          preserve={preserve}
        />
      </Div>
      <Div className="flex-initial max-w-lg" style={{ height: "160px" }}>
        <Media file={value && value.file} responsive={value && value.responsive} />
      </Div>
    </Div>
  )
}
