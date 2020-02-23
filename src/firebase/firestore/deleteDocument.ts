import { fetchFirestore, getUrl } from "./utils"

export async function deleteDocument(path: string): Promise<void> {
  await fetchFirestore(getUrl(path), { method: "delete" })
}
