import { patch } from "./utils"

export function updateDocument<T = any>(path: string, doc: Partial<T>) {
  const fields = Object.keys(doc)
  return patch(path, doc, true, fields)
}
