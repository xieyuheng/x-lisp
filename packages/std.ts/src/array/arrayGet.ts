export function arrayGet<T>(array: Array<T>, index: number): T {
  const element = array[index]
  if (element === undefined) {
    let message = `[arrayGet] undefined element at index: ${index}`
    throw new Error(message)
  }

  return element
}
