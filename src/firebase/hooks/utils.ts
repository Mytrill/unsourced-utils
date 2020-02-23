import * as firestore from "../firestore"
import { PathOrQuery, PathsOrQueries, DocumentHookQuery } from "./types"

export function getPathOrQueryDeps(pathOrQuery: PathOrQuery, deps: any[] = []): any[] {
  if (typeof pathOrQuery === "string") {
    deps.push(pathOrQuery)
    return deps
  }

  const { path, conditions, orderBy } = pathOrQuery
  deps.push(path)

  if (conditions) {
    conditions.forEach(c => {
      deps.push(c.field, c.operand, c.value)
    })
  }
  if (orderBy) {
    orderBy.forEach(o => {
      deps.push(o.field, o.direction)
    })
  }

  return deps
}

export function getPathsOrQueriesDeps(pathsOrQueries: PathsOrQueries, deps: any[] = []): any[] {
  Object.keys(pathsOrQueries).forEach(key => {
    deps.push(key)
    getPathOrQueryDeps(pathsOrQueries[key], deps)
  })

  return deps
}

export async function fetchDocument<T>(pathOrQuery: PathOrQuery): Promise<(firestore.FetchedDocument & T) | undefined> {
  const path = typeof pathOrQuery === "string" ? pathOrQuery : pathOrQuery.path
  const conditions = typeof pathOrQuery === "string" ? undefined : pathOrQuery.conditions
  if (!conditions) {
    return firestore.fetchDocument<T>(path)
  }

  const docs = await firestore.fetchCollection<T>(path, { conditions, limit: 1 })
  return docs.length ? docs[0] : undefined
}

export function toQuery(pathOrQuery: PathOrQuery): DocumentHookQuery {
  if (typeof pathOrQuery === "string") {
    return { path: pathOrQuery }
  }

  const { path, conditions, orderBy } = pathOrQuery
  return { path, conditions, orderBy }
}
