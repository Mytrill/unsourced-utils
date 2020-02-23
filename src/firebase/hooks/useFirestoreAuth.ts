import { useState, useEffect, useRef } from "react"
import * as fb from "firebase/app"

import { initialize, convertAuthError } from "common/firebase"
import { useLogger } from "modules/logger/useLogger"
import { auth } from "common/firebase/auth"

export interface AuthHook<T> {
  user?: T
  signIn(payload: SignInPayload): Promise<SignInResult>
  signUp(payload: SignUpPayload): Promise<SignUpResult>
  signOut(): Promise<void>
  sendPasswordResetEmail(email: string): Promise<void>
  confirmPasswordReset(code: string, password: string): Promise<void>
}

export interface SignInPayload {
  email: string
  password: string
  keepMeSignedIn: boolean
}

export interface SignInResult {
  error?: string
  errors?: {
    email?: string
    password?: string
  }
}

export interface SignUpPayload {
  email: string
  password: string
  // acceptsPromotionalEmails: boolean
  keepMeSignedIn: boolean
}

export interface SignUpResult {
  error?: string
  errors?: {
    email?: string
    password?: string
  }
}

export interface UseFirestoreAuthPayload<T> {
  createUser?(user: fb.User): Promise<void>
  getUser(user: fb.User): Promise<T>
  onAuthStateChange?(user: T | undefined): void
}

interface Cache {
  user: any
}

const CACHE: Cache = { user: null }

function setUserInCache(user: any) {
  // only cache on client
  if (typeof window === "undefined") return
  CACHE.user = user
}

export function useFirestoreAuth<U>(options: UseFirestoreAuthPayload<U>): AuthHook<U> {
  const [user, setUser] = useState<U>(CACHE.user)
  const logger = useLogger()

  useEffect(() => {
    logger.setLoading(true)
    initialize()
    const unsubscribe = auth().onAuthStateChanged(async u => {
      const user = u ? await options.getUser(u) : null
      setUser(user)
      setUserInCache(user)
      if (options.onAuthStateChange) {
        options.onAuthStateChange(user)
      }
      logger.setLoading(false)
    })
    setTimeout(() => logger.setLoading(false), 1000)

    return () => unsubscribe()
  }, [])

  async function signIn(payload: SignInPayload): Promise<SignInResult> {
    const { email, password, keepMeSignedIn } = payload

    await logger.setLoading(true)
    try {
      await auth().setPersistence(keepMeSignedIn ? fb.auth.Auth.Persistence.LOCAL : fb.auth.Auth.Persistence.NONE)
      await auth().signInWithEmailAndPassword(email, password)
      await logger.setLoading(false)
      return {}
    } catch (err) {
      await logger.setLoading(false)
      return convertAuthError(err)
    }
  }

  async function signUp(payload: SignUpPayload): Promise<SignUpResult> {
    const { email, password, keepMeSignedIn } = payload

    logger.setLoading(true)

    let credentials: any = null
    try {
      await auth().setPersistence(keepMeSignedIn ? fb.auth.Auth.Persistence.LOCAL : fb.auth.Auth.Persistence.NONE)
      credentials = await auth().createUserWithEmailAndPassword(email, password)
    } catch (err) {
      await logger.setLoading(false)
      return convertAuthError(err)
    }

    try {
      if (options.createUser) {
        await options.createUser(credentials.user)
      }
      await logger.setLoading(false)
      return {}
    } catch (err) {
      console.error("Error while creating user documents: ", err, err.details)

      logger.setLoading(false)
      try {
        await fb.auth().currentUser.delete()
      } catch (err2) {
        // ignore
      }

      return convertAuthError(err)
    }
  }

  function signOut() {
    return auth().signOut()
  }

  function sendPasswordResetEmail(email: string) {
    // TODO handle errors?
    return auth().sendPasswordResetEmail(email)
  }

  function confirmPasswordReset(code: string, password: string) {
    // TODO handle errors?
    return auth().confirmPasswordReset(code, password)
  }

  return {
    user,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    confirmPasswordReset,
  }
}
