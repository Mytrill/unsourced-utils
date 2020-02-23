export function isElementInViewport(element: HTMLElement) {
  if (element.style.display === "none") return false
  const rect = element.getBoundingClientRect()
  console.log(
    rect,
    window.innerHeight,
    window.document.documentElement.clientHeight,
    window.innerWidth,
    document.documentElement.clientWidth
  )
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
