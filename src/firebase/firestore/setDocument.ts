import { patch } from "./utils"

export function setDocument<T = any>(path: string, doc: T) {
  return patch<T>(path, doc)
}
