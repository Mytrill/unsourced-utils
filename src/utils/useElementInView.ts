import { useRef, useState, useEffect } from "react"
import { isElementInViewport } from "./isElementInViewport"

export function useElementInView() {
  const ref = useRef<any>(null)
  const [isInView, setIsInView] = useState<boolean>(false)

  useEffect(() => {
    const checkInView = () => {
      if (ref.current) {
        const inView = isElementInViewport(ref.current)
        setIsInView(inView)
      }
    }

    window.addEventListener("scroll", checkInView)

    return () => window.removeEventListener("scroll", checkInView)
  }, [ref.current])

  return { ref, isInView }
}
