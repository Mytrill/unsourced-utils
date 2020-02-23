import firebase from "firebase/app"
import "firebase/storage"

import { guid } from "../utils"

export function getRef(path) {
  return firebase.storage().ref(path)
}

/**
 * Gets the extension of the given file.
 */
function getExtension(file: File): string | null {
  const segments = file.name.split(".")
  if (segments.length <= 1) return null
  return segments[segments.length - 1]
}

/**
 * Generate a name for the given file in the storage.
 */
function getPath(file: File, options: UploadFileOptions): string {
  const { preserve, folder } = options
  const fileName = preserve ? file.name : guid() + "." + getExtension(file)
  const folderName = folder ? (folder.endsWith("/") ? folder : folder + "/") : ""

  return folderName + fileName
}

export interface UploadFileResult {
  url: string
  path: string
}

export interface UploadFileOptions {
  preserve?: boolean
  folder?: string
}

/**
 * upload a file and returns the download URL & path in firebase storage.
 */
export async function uploadFile(file: File, options: UploadFileOptions): Promise<UploadFileResult> {
  const path = getPath(file, options)
  const ref = getRef(path)

  await ref.put(file, {
    cacheControl: "public,max-age=31536000",
  })
  return ref.getDownloadURL().then(url => ({ url, path }))
}

/**
 * Delete the file at the given path.
 */
export async function deleteFile(path: string) {
  const ref = getRef(path)
  await ref.delete()
}
