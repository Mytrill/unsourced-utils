export function asyncEffect(fn: Function) {
  return () => {
    fn()
  }
}
