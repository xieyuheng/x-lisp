import * as S from "../index.ts"

export function symbolContent(sexp: S.Sexp): string {
  if (sexp.kind !== "Symbol") {
    throw new Error(`[symbolContent] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.content
}

export function keywordContent(sexp: S.Sexp): string {
  if (sexp.kind !== "Keyword") {
    throw new Error(`[keywordContent] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.content
}

export function stringContent(sexp: S.Sexp): string {
  if (sexp.kind !== "String") {
    throw new Error(`[stringContent] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.content
}

export function intContent(sexp: S.Sexp): bigint {
  if (sexp.kind !== "Int") {
    throw new Error(`[intContent] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.content
}

export function floatContent(sexp: S.Sexp): number {
  if (sexp.kind !== "Float") {
    throw new Error(`[floatContent] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.content
}

export function listElements(sexp: S.Sexp): Array<S.Sexp> {
  if (sexp.kind !== "List") {
    throw new Error(`[listElements] wrong sexp: ${S.formatSexp(sexp)}`)
  }

  return sexp.elements
}

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
