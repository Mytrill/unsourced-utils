import fb from "firebase/app"
import "firebase/auth"

export function auth() {
  return fb.auth()
}
