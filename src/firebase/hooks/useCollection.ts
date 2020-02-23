import { useState, useEffect, useCallback } from "react"

import { toQuery, getPathOrQueryDeps } from "./utils"
import { fetchCollection, Query } from "../firestore"
import { PathOrQuery } from "./types"

export interface CollectionHook<T> {
  path: string
  documents: T[]
  loading: boolean
  error: string | undefined
  hasMore: boolean
  fetchMore(count: number)
  pathOrQuery: PathOrQuery
  options: UseCollectionOptions<T>
  refresh(): Promise<void>
}

export interface UseCollectionOptions<T> {
  limit?: number
  documents?: T[]
}

export function useCollection<T>(pathOrQuery: PathOrQuery, options: UseCollectionOptions<T> = {}): CollectionHook<T> {
  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(options.limit || (options.documents && options.documents.length) || 20)
  const [documents, setDocuments] = useState<T[]>(options.documents || [])
  const [fetchedCount, setFetchedCount] = useState<number>(
    options.documents ? options.limit || options.documents.length : 0
  )
  const [loading, setLoading] = useState<boolean>(!options.documents)
  const [error, setError] = useState<string>(undefined)

  const { path, conditions, orderBy } = toQuery(pathOrQuery)
  const hasMore = documents.length === fetchedCount

  const deps = getPathOrQueryDeps(pathOrQuery, [offset, limit])
  const fetchStuff = useCallback(async () => {
    if (fetchedCount === offset + limit) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      const firestoreQuery: Query = {
        offset,
        limit,
        conditions,
        orderBy,
      }
      const docs = await fetchCollection<T>(path, firestoreQuery)
      setDocuments(documents.concat(docs))
      setFetchedCount(fetchedCount + limit)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(err.message || err)
    }
  }, deps)
  useEffect(() => {
    fetchStuff()
  }, deps)

  return {
    path,
    documents,
    loading,
    error,
    hasMore,
    fetchMore(count: number) {
      if (!hasMore) return
      setOffset(fetchedCount)
      setLimit(count)
    },
    pathOrQuery,
    options,
    refresh() {
      return fetchStuff()
    },
  }
}
