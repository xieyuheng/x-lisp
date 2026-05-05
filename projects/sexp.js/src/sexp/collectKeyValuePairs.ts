import * as S from "../index.ts"

export function collectKeyValuePairs(
  sexps: Array<S.Sexp>,
): Array<[string, S.Sexp]> {
  const entries: Array<[string, S.Sexp]> = []
  let i = 0
  while (i < sexps.length) {
    const keyword = sexps[i]
    if (S.isKeyword(keyword)) {
      if (i + 1 < sexps.length) {
        const value = sexps[i + 1]
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
