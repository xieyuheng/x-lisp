export function generateRelativeFreshName(
  name: string,
  usedNames: Set<string>,
): string {
  if (!usedNames.has(name)) return name

  let n = 1
  while (usedNames.has(`${name}.${n}`)) {
    n++
  }

  return `${name}.${n}`
}
