export function lexerBrackets() {
  return [
    { start: "(", end: ")" },
    { start: "[", end: "]" },
    { start: "{", end: "}" },
  ]
}

export function lexerQuotes() {
  return ["'", ",", "`"]
}

export function lexerMarks() {
  return [
    ...lexerQuotes(),
    ...lexerBrackets().flatMap(({ start, end }) => [start, end]),
  ]
}

export function lexerMatchBrackets(start: string, end: string): boolean {
  const found = lexerBrackets().find((entry) => entry.start === start)
  if (found === undefined) {
    return false
  }

  return found.end === end
}
