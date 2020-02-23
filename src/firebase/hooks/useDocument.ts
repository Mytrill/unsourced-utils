import { useState, useEffect, useRef } from "react"

import * as firestore from "common/firebase/firestore"
import { asyncEffect } from "common/effectUtils"
import { getPathOrQueryDeps, fetchDocument } from "./utils"
import { PathOrQuery } from "./types"

function defaultOnNotFound(_: PathOrQuery, __: boolean): OnNotFoundResult<any> {
  return { error: "No document found!" }
}

function isReady(loading: boolean, error: string | undefined, form: DocumentFormHook | undefined) {
  if (loading || error) return false
  if (!form) return true
  if (!form.values || typeof form.values !== "object") return false
  return Object.keys(form.values).length > 0
}

export interface DocumentFormHook {
  setValues(values: any)
  values: any
}

export interface DocumentHook<T> {
  path: string | undefined
  pathOrQuery: PathOrQuery
  values: T | undefined
  loading: boolean
  error: string | undefined
  ready: boolean
  exists: boolean
  set(document: T): Promise<void>
  update(document: Partial<T>): Promise<void>
  options: UseDocumentOptions<T>
  setForm(form: DocumentFormHook): void
}

export interface OnNotFoundResult<T> {
  path?: string
  values?: T
  error?: string
}

export interface SetDocumentPayload<T> {
  path: string
  values: T
  exists: boolean
}

export interface SetDocument<T> {
  (values: T): Promise<void>
}

export interface UpdatePayload<T> {
  path: string
  existing: T
  update: Partial<T>
}

export interface UpdateDocument<T> {
  (values: Partial<T>): Promise<void>
}

export interface UseDocumentOptions<T> {
  onNotFound?(pathOrQuery: PathOrQuery, createNew: boolean): OnNotFoundResult<T>
  set?(payload: SetDocumentPayload<T>, doSet: SetDocument<T>): Promise<void>
  update?(payload: UpdatePayload<T>, doUpdate: UpdateDocument<T>): Promise<void>
}

export function useDocument<T>(
  pathOrQuery: PathOrQuery,
  options: UseDocumentOptions<T> = {},
  createNew: boolean = false
): DocumentHook<T> {
  const [path, setPath] = useState<string>(undefined)
  const [values, setValues] = useState<T>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>(undefined)
  const [exists, setExists] = useState<boolean>(false)
  const [ready, setReady] = useState<boolean>(false)
  const formHook = useRef<DocumentFormHook>(null)

  useEffect(
    asyncEffect(async () => {
      if (createNew) {
        const onNew = options.onNotFound || defaultOnNotFound
        const result = onNew(pathOrQuery, createNew)
        setError(result.error || (result.path ? undefined : "The path should be provided when creating a document!"))
        setValues(result.values || undefined)
        setPath(result.path || undefined)
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
        const values = await fetchDocument<T>(pathOrQuery)
        if (!values) {
          const onNotFound = options.onNotFound || defaultOnNotFound
          const result = onNotFound(pathOrQuery, createNew)
          setLoading(false)
          setPath(result.path || undefined)
          setError(result.error || undefined)
          setValues(result.values || undefined)
          setExists(false)
          if (formHook.current && result.values) {
            formHook.current.setValues(result.values)
          }
        } else {
          setValues(values)
          setLoading(false)
          setExists(true)
          setPath(values.___doc___.path)
          if (formHook.current) {
            formHook.current.setValues(values)
          }
        }
      } catch (err) {
        setLoading(false)
        setError(err.message || err)
        console.log(`Error while fetching document ${JSON.stringify(pathOrQuery)}`, err)
      }
    }),
    getPathOrQueryDeps(pathOrQuery)
  )

  const newReady = isReady(loading, error, formHook.current)
  if (ready !== newReady) {
    setReady(newReady)
  }
  return {
    path,
    pathOrQuery,
    values,
    loading,
    error,
    exists,
    options,
    ready,
    set: async (values: T) => {
      if (loading || error || !path) {
        throw new Error("Document not ready yet!")
      }
      let actualValues = values
      if (options.set) {
        await options.set({ path, values, exists }, values => {
          actualValues = values
          return firestore.setDocument(path, values)
        })
      } else {
        await firestore.setDocument(path, values)
      }
      setValues(actualValues)
      if (formHook.current) {
        formHook.current.setValues(actualValues)
      }
      setExists(true)
    },
    update: async (update: Partial<T>) => {
      if (loading || error || !path) {
        throw new Error("Document not ready yet!")
      }

      let actualUpdate = update
      if (options.update) {
        await options.update({ existing: values, path, update }, values => {
          actualUpdate = values
          return firestore.updateDocument(path, values)
        })
      } else {
        await firestore.updateDocument(path, update)
      }
      const updated = { ...values, ...actualUpdate }
      setValues(updated)
      if (formHook.current) {
        formHook.current.setValues(updated)
      }
    },
    setForm(form) {
      formHook.current = form
    },
  }
}
