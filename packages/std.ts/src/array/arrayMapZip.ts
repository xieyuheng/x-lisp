export function arrayMapZip<A, B, C>(
  left: Array<A>,
  right: Array<B>,
  f: (x: A, y: B) => C,
): Array<C> {
  const array: Array<C> = []
  for (const i of left.keys()) {
    const x = left[i]
    const y = right[i]
    array.push(f(x, y))
  }

  return array
}
