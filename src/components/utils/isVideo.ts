import { FileDef } from "../FileInput"

const VIDEOS = {
  mp4: true,
  webm: true,
}

export function isVideo(file: FileDef) {
  if (!file) return false

  if (file.contentType) {
    return file.contentType.startsWith("video/")
  }

  if (!file.name) return false
  const segments = file.name.split(".")
  const ext = segments[segments.length - 1]

  return !!VIDEOS[ext]
}
