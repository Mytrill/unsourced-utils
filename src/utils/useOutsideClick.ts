import { useEffect, useCallback, useRef, MutableRefObject } from "react"

// See https://medium.com/p/25dbaa30abcd/responses/show
// See https://codesandbox.io/s/8484x6zpnj

/**
 * Use this to detect the click outside of a component.
 * Useful for all sorts of dropdowns or modals to close when clicked outside.
 *
 * See `common/components/TagListInput.tsx` for an example use.
 */
export function useOutsideClick(onClick: () => any): MutableRefObject<any> {
  const ref = useRef(null)

  const handleClick = useCallback(
    e => {
      const inside = ref.current && ref.current.contains(e.target)
      if (inside) return

      onClick()
    },
    [onClick, ref]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick)
  }, [handleClick])

  return ref
}
