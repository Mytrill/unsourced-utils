import { Query, FetchedDocument } from "./types"
import { fetchFirestoreJSON, getUrl, convertQueryToBody, convertRestToDocument } from "./utils"

export async function fetchCollection<T>(path: string, query: Query = {}): Promise<Array<FetchedDocument & T>> {
  const pathArr = path.split("/")
  const last = pathArr.pop()
  const result = await fetchFirestoreJSON(getUrl(pathArr.join("/"), ":runQuery"), {
    method: "post",
    body: JSON.stringify(convertQueryToBody(last, query)),
  })

  return result
    .map(item => {
      // document not set if no results
      const { document } = item
      const result = document && convertRestToDocument<T>(document)
      return result
    })
    .filter(doc => !!doc)
}
