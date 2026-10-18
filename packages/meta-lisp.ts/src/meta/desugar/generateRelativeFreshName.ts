export function generateRelativeFreshName(
  usedNames: Set<string>,
  name: string,
): string {
  if (!usedNames.has(name)) return name

  let n = 1
  while (usedNames.has(`${name}.${n}`)) {
    n++
  }

  return `${name}.${n}`
}
