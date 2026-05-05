import * as S from "../index.ts"

export function listCollectKeyValuePairs(
  sexp: S.Sexp,
): Array<[string, S.Sexp]> {
  if (sexp.kind !== "List") {
    throw new Error(
      `[listCollectKeyValuePairs] wrong sexp: ${S.formatSexp(sexp)}`,
    )
  }

  const entries: Array<[string, S.Sexp]> = []
  let i = 0
  while (i < sexp.elements.length) {
    const keyword = sexp.elements[i]
    if (S.isKeyword(keyword)) {
      if (i + 1 < sexp.elements.length) {
        const value = sexp.elements[i + 1]
        entries.push([keyword.content, value])
        i += 2
      } else {
        i++
      }
    } else {
      i++
    }
  }

  return entries
}
