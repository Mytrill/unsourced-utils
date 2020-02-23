import { useState, useEffect, useCallback, useRef } from "react"

import { StringMap } from "common/types"
import { Paths, PathsOrQueries } from "./types"
import { asyncEffect } from "common/effectUtils"
import { getPathsOrQueriesDeps, fetchDocument } from "./utils"
import { setDocument } from "../firestore"

function defaultOnNotFound(_: PathsOrQueries, __: boolean): OnNotFoundResults<any> {
  return { error: "No document found!" }
}

async function fetchDocuments<T>(pathsOrQueries: PathsOrQueries): Promise<{ values: T; paths: StringMap<string> }> {
  const values: any = {}
  const paths: StringMap<string> = {}
  let notFound = false
  await Promise.all(
    Object.keys(pathsOrQueries).map(async key => {
      const doc = await fetchDocument<T>(pathsOrQueries[key])
      values[key] = doc
      if (typeof doc === "undefined") {
        notFound = true
      } else {
        paths[key] = doc.___doc___.path
      }
    })
  )

  return notFound ? undefined : { values, paths }
}

function isReady(loading: boolean, error: string | undefined, form: DocumentsFormHook | undefined) {
  if (loading || error) return false
  if (!form) return true

  if (!form.values || typeof form.values !== "object") return false
  return Object.keys(form.values).length > 0
}

export interface OnNotFoundResults<T> {
  paths?: Paths
  values?: T
  error?: string
}

export interface SetDocumentsPayload<T> {
  paths: Paths
  values: Partial<T>
  exists: boolean
}

export interface SetDocuments<T> {
  (values: Partial<T>): Promise<void>
}

export interface UseDocumentsOptions<T> {
  onNotFound?(pathsOrQueries: PathsOrQueries, createNew: boolean): OnNotFoundResults<T>
  set?(payload: SetDocumentsPayload<T>, doSet: SetDocuments<T>): Promise<void>
}

export interface DocumentsFormHook {
  setValues(values: any)
  values: any
}

export interface DocumentsHook<T> {
  paths: Paths | undefined
  values: T | undefined
  loading: boolean
  error: string | undefined
  exists: boolean
  ready: boolean
  options: UseDocumentsOptions<T>
  set(values: Partial<T>): Promise<void>
  setForm(form: DocumentsFormHook): void
}

export function useDocuments<T>(
  pathsOrQueries: PathsOrQueries,
  options: UseDocumentsOptions<T> = {},
  createNew: boolean = false
): DocumentsHook<T> {
  const [paths, setPaths] = useState<Paths>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>(undefined)
  const [exists, setExists] = useState<boolean>(false)
  const [values, setValues] = useState<T>(undefined)
  const [ready, setReady] = useState<boolean>(false)
  const formHook = useRef<DocumentsFormHook>(null)

  useEffect(
    asyncEffect(async () => {
      if (createNew) {
        const onNew = options.onNotFound || defaultOnNotFound
        const result = onNew(pathsOrQueries, createNew)
        setError(result.error || (result.paths ? undefined : "The path should be provided when creating a document!"))
        setValues(result.values || undefined)
        setPaths(result.paths || undefined)
        setLoading(false)
        setExists(false)
        if (formHook.current && result.values) {
          formHook.current.setValues(result.values)
        }
        return
      }

      setError(null)
      setLoading(true)
      try {
        const result = await fetchDocuments<T>(pathsOrQueries)
        if (!result) {
          const onNotFound = options.onNotFound || defaultOnNotFound
          const res = onNotFound(pathsOrQueries, createNew)
          setValues(res.values || undefined)
          setPaths(res.paths || undefined)
          setError(res.error || undefined)
          setLoading(false)
          setExists(false)
          if (formHook.current && res.values) {
            formHook.current.setValues(res.values)
          }
        } else {
          setValues(result.values)
          setPaths(result.paths)
          setLoading(false)
          setExists(true)
          if (formHook.current) {
            formHook.current.setValues(result.values)
          }
        }
      } catch (err) {
        setError(err.message || err)
        setLoading(false)
        console.log(`Error while fetching documents ${JSON.stringify(pathsOrQueries)}`, err)
      }
    }),
    getPathsOrQueriesDeps(pathsOrQueries)
  )

  const doSet = async (data: Partial<T>) => {
    await Promise.all(
      Object.keys(paths).map(key => {
        const updated = data[key]
        const vals = values[key]
        if (updated && (updated !== vals || !exists)) {
          return setDocument(paths[key], updated)
        }
        return Promise.resolve()
      })
    )
  }

  const newReady = isReady(loading, error, formHook.current)
  if (ready !== newReady) {
    setReady(newReady)
  }
  return {
    paths,
    values,
    loading,
    error,
    exists,
    options,
    ready,
    set: async (data: Partial<T>) => {
      if (loading || error || !paths) {
        throw new Error("Document not ready yet!")
      }

      let actualValues = data
      if (options.set) {
        await options.set({ values: data, paths, exists }, values => {
          actualValues = values
          return doSet(values)
        })
      } else {
        await doSet(data)
      }

      const newValues = { ...values, ...actualValues }

      setValues(newValues)
      if (formHook.current) {
        formHook.current.setValues(newValues)
      }
      setExists(true)
    },
    setForm(form) {
      formHook.current = form
    },
  }
}
