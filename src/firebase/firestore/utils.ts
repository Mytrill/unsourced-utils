import unfetch from "isomorphic-unfetch"

import { Query, QueryCondition, QueryOrderBy, FetchedDocument } from "./types"
import { getAuthHeaders } from "../functions"
import { env } from "config"

export const DEFAULT_LIMIT = 20

function getQueryUrl(query?: any): string {
  if (!query) return ""
  let result = ""
  Object.keys(query).forEach(key => {
    const value = query[key]
    if (Array.isArray(value)) {
      value.forEach(val => {
        result += `&${key}=${encodeURI(String(val))}`
      })
    } else {
      result += `&${key}=${encodeURI(String(query[key]))}`
    }
  })

  return result
}

export function getUrl(path: string, action: string = "", query?: any) {
  const normalized = path.startsWith("/") ? path : "/" + path
  const projectId = env.FIREBASE_CONFIG.projectId
  const apiKey = env.FIREBASE_CONFIG.apiKey
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents${normalized}${action}?key=${apiKey}${getQueryUrl(
    query
  )}`
}

function getDetailsMessage(details: any) {
  const error = details && details[0] && details[0].error
  if (!error) return null

  return `Error ${error.code}: ${error.message}`
}

export async function fetchFirestore(url: string, init: RequestInit = {}): Promise<Response> {
  if (!init.headers) {
    init.headers = await getAuthHeaders(true)
  }

  const result = await unfetch(url, init)
  if (!result.ok) {
    try {
      const details = await result.json()

      const message = result.statusText
      const error: any = new Error(`Error ${result.status}: ${message}`)
      error.details = getDetailsMessage(details)
      error.code = result.status
      throw error
    } catch (err) {
      if (err.details) {
        throw err
      }
      err.message = err.message || `Error ${result.status}: ${result.statusText}`
      throw err
    }
  }
  return result
}

export async function fetchFirestoreJSON<T = any>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetchFirestore(url, init)
  return res.json()
}

function canBeConvertedToValue(data: any): boolean {
  switch (typeof data) {
    case "undefined":
    case "function":
    case "symbol":
      return false
    default:
      return true
  }
}

/**
 * Converts the given javascript value (string, boolean, object, array...) to a value that can be sent to Firestore's REST API.
 *
 * @param value The javascript value to convert
 *
 * @see https://cloud.google.com/firestore/docs/reference/rest/v1/Value
 */
function convertDocumentFieldToValue(data: any): any {
  switch (typeof data) {
    case "bigint":
      return { integerValue: data.toString() }
    case "boolean":
      return { booleanValue: data }
    case "function":
      throw new Error("Got a function to convert")
    case "number":
      if (Number.isInteger(data)) {
        return { integerValue: data.toString() }
      }
      return { doubleValue: data }
    case "object":
      if (data === null) {
        return { nullValue: null }
      }
      if (Array.isArray(data)) {
        return {
          arrayValue: { values: data.filter(canBeConvertedToValue).map(convertDocumentFieldToValue) },
        }
      }
      const fields: any = {}
      Object.keys(data).forEach(key => {
        fields[key] = convertDocumentFieldToValue(data[key])
      })
      return { mapValue: { fields } }
    case "string":
      return { stringValue: data }
    case "symbol":
      throw new Error("Got a symbol to convert")
    case "undefined":
      throw new Error("Got an undefined value to convert")
  }
}

/**
 * Converts the content of the given document to be sendable to Firestore's PATCH REST API.
 *
 * @param document The document to convert
 *
 * @see https://cloud.google.com/firestore/docs/reference/rest/v1/projects.databases.documents#Document
 */
export function convertDocumentToValue(document: any): any {
  const result: any = {}
  Object.keys(document).forEach(key => {
    if (key === "___doc___") {
      return
    }
    result[key] = convertDocumentFieldToValue(document[key])
  })
  return result
}

const OPERAND_MAP = {
  "<": "LESS_THAN",
  "<=": "LESS_THAN_OR_EQUAL",
  "==": "EQUAL",
  ">=": "GREATER_THAN_OR_EQUAL",
  ">": "GREATER_THAN",
  in: "IN",
  "array-contains": "ARRAY_CONTAINS",
  "array-contains-any": "ARRAY_CONTAINS_ANY",
  "is-nan": "IS_NAN",
  "is-null": "IS_NULL",
}

function getBiggerThanValue(value: string) {
  const next = value.charCodeAt(value.length - 1) + 1
  return value.substr(0, value.length - 1) + String.fromCharCode(next)
}

/**
 * Converts a condition to Firebase's REST API's format.
 *
 * @param condition The condition to convert
 *
 * @returns The condition in Firebase's REST API's format
 *
 * @see https://firebase.google.com/docs/firestore/reference/rest/v1beta1/StructuredQuery#filter
 * @see https://firebase.google.com/docs/firestore/reference/rest/v1beta1/StructuredQuery#fieldfilter
 */
function convertToBodyCondition(condition: QueryCondition): any[] {
  switch (condition.operand) {
    case "is-nan":
    case "is-null":
      return [
        {
          unaryFilter: {
            field: { fieldPath: condition.field },
            op: OPERAND_MAP[condition.operand],
          },
        },
      ]
    case "starts-with":
      if (!condition.value || typeof condition.value !== "string") return []
      const next = getBiggerThanValue(condition.value)
      return [
        [
          {
            fieldFilter: {
              field: { fieldPath: condition.field },
              op: OPERAND_MAP[">="],
              value: convertDocumentFieldToValue(condition.value),
            },
          },
          {
            fieldFilter: {
              field: { fieldPath: condition.field },
              op: OPERAND_MAP["<"],
              value: convertDocumentFieldToValue(next),
            },
          },
        ],
      ]
    default:
      return [
        {
          fieldFilter: {
            field: { fieldPath: condition.field },
            op: OPERAND_MAP[condition.operand],
            value: convertDocumentFieldToValue(condition.value),
          },
        },
      ]
  }
}

const DIRECTIONS = {
  asc: "ASCENDING",
  desc: "DESCENDING",
}

function convertToBodyOrderBy(orderBy: QueryOrderBy): any {
  return {
    field: { fieldPath: orderBy.field },
    direction: DIRECTIONS[orderBy.direction],
  }
}

function getFilters(conditions: QueryCondition[] | undefined): any[] {
  const result = []
  ;(conditions || []).forEach(c => {
    result.push(...convertToBodyCondition(c))
  })

  return result
}

/**
 *
 * Converts a Query to a body ready to be sent to Firestore's REST API.
 *
 * @param collection The path of the collection to query from
 * @param query The query to execute
 *
 * @returns The body to send to Firestore's REST API
 *
 * @see https://cloud.google.com/firestore/docs/reference/rest/v1/projects.databases.documents/runQuery
 * @see https://developers.google.com/apis-explorer/#search/firestore/firestore/v1/firestore.projects.databases.documents.runQuery
 */
export function convertQueryToBody(collection: string, query: Query): any {
  return {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: {
        compositeFilter: {
          op: "AND",
          // this should be done with a flatMap, but next 9 doesn't transpile properly on the server, and Array.flatmap doesn't exists on Node 10...
          // filters: (query.conditions || []).flatMap(convertToBodyCondition),
          filters: getFilters(query.conditions),
        },
      },
      orderBy: (query.orderBy || []).map(convertToBodyOrderBy),
      offset: query.offset || 0,
      limit: query.limit || DEFAULT_LIMIT,
    },
  }
}

/**
 * Converts the given value from Firestore's REST API Value to a regular javascript object/value.
 *
 * @param value The javascript value to convert
 *
 * @see https://cloud.google.com/firestore/docs/reference/rest/v1/Value
 */
export function convertFromValue(value: any): any {
  if (value == null || typeof value !== "object") {
    return value
  }

  if ("nullValue" in value) return null
  if ("stringValue" in value) return value.stringValue
  if ("doubleValue" in value) return value.doubleValue
  if ("integerValue" in value) return Number.parseInt(value.integerValue)
  if ("booleanValue" in value) return value.booleanValue
  if ("timestampValue" in value) return new Date(value.timestampValue)
  if ("mapValue" in value) return convertFromValue(value.mapValue.fields || {})
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(convertFromValue)

  // plain object
  const result: any = {}
  Object.keys(value).forEach(key => {
    result[key] = convertFromValue(value[key])
  })
  return result
}

const DOCS_PATH_SEPARATOR = "/databases/(default)/documents/"

export function convertRestToDocument<T>(body: any): FetchedDocument & T {
  const { name, fields, createTime, updateTime } = body
  const result: FetchedDocument & T = convertFromValue(fields)

  if (!result) {
    return result
  }
  // console.log("Document: ", JSON.stringify(d))
  // ___doc___.name: projects/<FIREBASE_PROJECT>/databases/(default)/documents/<DOCUMENT_PATH>
  const paths: string[] = name.split(DOCS_PATH_SEPARATOR)
  paths.shift()
  const path = paths.join("/")
  const segments = path.split("/")
  const id = segments[segments.length - 1]
  segments.pop()
  const collection = segments.join("/")

  result.___doc___ = {
    id,
    path,
    collection,
    createTime: new Date(createTime),
    updateTime: new Date(updateTime),
  }
  return result
}

export async function patch<T = any>(path: string, values: Partial<T>, docExists?: boolean, fields?: string[]) {
  const query: any = { "mask.fieldPaths": "__name__" }
  if (typeof docExists === "boolean") {
    query["currentDocument.exists"] = docExists
  }
  if (Array.isArray(fields)) {
    query["updateMask.fieldPaths"] = fields
  }
  const url = getUrl(path, "", query)

  await fetchFirestoreJSON(url, {
    method: "PATCH",
    body: JSON.stringify({ fields: convertDocumentToValue(values) }),
  })
}
