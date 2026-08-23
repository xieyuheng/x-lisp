const BLANKS =
  " \t\n\r\f\v\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\ufeff"

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

export const MARK_CHARS: Set<string> = new Set(lexerMarks())

export const BLANK_CHARS: Set<string> = new Set(BLANKS.split(""))

export function charIsBlank(char: string | undefined): boolean {
  if (char === undefined) return false
  return BLANK_CHARS.has(char)
}

export function lexerMatchBrackets(start: string, end: string): boolean {
  const found = lexerBrackets().find((entry) => entry.start === start)
  if (found === undefined) {
    return false
  }

  return found.end === end
}
