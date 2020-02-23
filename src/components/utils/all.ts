import cc from "classnames"

import { getResponsiveFromPropName } from "./responsive"
import { getUnresponsiveFromPropName } from "./unresponsive"

export function geAllFromProps(props: any, extra: string = ""): string {
  return cc(
    Object.keys(props).map(prop => getResponsiveFromPropName(props, prop) || getUnresponsiveFromPropName(props, prop)),
    extra,
    props.className
  )
}
