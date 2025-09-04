// random int between start (inclusive) and end (exclusive)

export function randomRange(start: number, end: number): number {
  return Math.random() * (end - start) + start
}
