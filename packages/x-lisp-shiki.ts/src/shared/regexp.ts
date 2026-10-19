export const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export const alternation = (values: string[]) =>
  values.map(escapeRegExp).join("|")

// Names may contain a wide range of punctuation, but not parentheses,
// quotes, semicolons, colons, slashes, or whitespace.  Qualified names
// are built from multiple names separated by slashes.
export const name = String.raw`[\p{L}\p{N}_$%&*+\-.<=>!?@#|]+`
export const qualifiedName = String.raw`${name}(?:/${name})*`

export const number = String.raw`(?:0[xX][0-9a-fA-F]+|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)`

export function commentRule(language: string) {
  return {
    match: ";.*$",
    name: `comment.line.semicolon.${language}`,
  }
}

export function stringRule(language: string) {
  return {
    begin: '"',
    end: '"',
    name: `string.quoted.double.${language}`,
    patterns: [
      {
        match: String.raw`\\.`,
        name: `constant.character.escape.${language}`,
      },
    ],
  }
}

export function numberRule(language: string) {
  return {
    match: String.raw`(?<!${name})${number}(?!${name})`,
    name: `constant.numeric.${language}`,
  }
}
