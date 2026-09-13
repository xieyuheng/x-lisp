export function parseFrontMatterKv(raw: string): Map<string, string> {
  const entries = new Map<string, string>()

  for (const line of raw.split("\n")) {
    if (line.startsWith(" ") || line.startsWith("\t")) continue

    const index = line.indexOf(":")
    if (index === -1) continue

    const key = line.slice(0, index).trim()
    if (key === "") continue

    const value = parseValue(line.slice(index + 1))
    entries.set(key, value)
  }

  return entries
}

function parseValue(text: string): string {
  const value = text.trim()
  const first = value[0]
  const last = value[value.length - 1]

  if (
    value.length >= 2 &&
    ((first === '"' && last === '"') || (first === "'" && last === "'"))
  ) {
    return value.slice(1, -1)
  }

  return value
}
