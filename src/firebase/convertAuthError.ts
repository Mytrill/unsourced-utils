export interface AuthError {
  error?: string
  errors?: {
    email?: string
    password?: string
  }
}

export function convertAuthError(error: any): AuthError {
  if (!error) {
    return null
  }

  if (typeof error === "string" || !error.code) {
    return { error: error.message || error }
  }

  switch (error.code) {
    // sign up
    case "auth/email-already-in-use":
      return {
        errors: {
          email: error.message,
        },
      }
    // sign up/sign in
    case "auth/invalid-email":
      return {
        errors: {
          email: error.message,
        },
      }
    // sign up
    case "auth/operation-not-allowed":
      return {
        error: "Technical error",
      }
    // sign up
    case "auth/weak-password":
      return {
        errors: {
          password: error.message,
        },
      }
    // sign in
    case "auth/user-disabled":
      return {
        errors: {
          email: error.message,
        },
      }
    // sign in
    case "auth/user-not-found":
      return {
        errors: {
          email: "No user found with this email address",
        },
      }
    // sign in
    case "auth/wrong-password":
      return {
        errors: {
          password: error.message,
        },
      }
    default:
      return {
        error: error.message,
      }
  }
}
