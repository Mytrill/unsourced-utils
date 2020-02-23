import app from "firebase/app"

import { env } from "config"

export function initialize() {
  if (app.apps.length === 0) {
    try {
      app.initializeApp(env.FIREBASE_CONFIG)
    } catch (err) {
      console.error("Error while initializing firebase: ", err)
    }
  }
}
