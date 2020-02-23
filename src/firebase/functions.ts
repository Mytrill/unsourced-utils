import firebase from "firebase/app"

import { StringMap } from "../types"

/**
 *
 * @param fn the function name, may or may not start with "/" (don't care)
 */
export function getFunctionUrl(fn: string): string {
  return fn.startsWith("/") ? fn : "/" + fn
}

export type Method = "GET" | "POST" | "PUT" | "DELETE"

export async function getAuthHeaders(json?: boolean, headers: StringMap<string> = {}): Promise<StringMap<string>> {
  // check firebase is initialized
  if (firebase.apps.length) {
    const user = firebase.auth().currentUser
    if (user) {
      const idToken = await user.getIdToken()
      headers.Authorization = "Bearer " + idToken
    }
  }
  if (json) {
    headers.Accept = "application/json"
    headers["Content-Type"] = "application/json"
  }

  return headers
}

/**
 *
 * @param fn The server function
 * @param method "GET" by default, possible: "GET" | "POST" | "PUT" | "DELETE"
 * @param body the body, if method is "POST" | "PUT"
 */
export async function invokeFn(fn: string, method: Method = "GET", body?: any): Promise<Response> {
  const headers = await getAuthHeaders(body)
  const res = await fetch(getFunctionUrl(fn), { method, headers, body: body && JSON.stringify(body) })
  if (res.status !== 200) throw new Error(`Error ${res.status}: ${res.statusText}`)
  return res
}

/**
 *
 * @param fn The server function
 * @param method "GET" by default, possible: "GET" | "POST" | "PUT" | "DELETE"
 * @param body the body, if method is "POST" | "PUT"
 */
export async function invokeFnJson<T>(fn: string, method: Method = "GET", body?: any): Promise<T> {
  const res = await invokeFn(fn, method, body)
  return res.json()
}
/**
 *
 * @param fn The server function
 * @param method "GET" by default, possible: "GET" | "POST" | "PUT" | "DELETE"
 * @param body the body, if method is "POST" | "PUT"
 */
export async function invokeFnVoid(fn: string, method: Method = "GET", body?: any): Promise<void> {
  await invokeFn(fn, method, body)
}
