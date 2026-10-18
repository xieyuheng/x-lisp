export function numberAlign(n: number, alignment: number): number {
  const remainder = n % alignment
  if (remainder === 0) {
    return n
  } else {
    return n - remainder + alignment
  }
}
