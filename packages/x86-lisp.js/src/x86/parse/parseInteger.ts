import * as S from "@xieyuheng/sexp.js"

export function parseIntegerSexp(sexp: S.Sexp): bigint | undefined {
  if (sexp.kind === "IntSexp") {
    return sexp.content
  }

  if (sexp.kind === "SymbolSexp") {
    return parseIntegerString(sexp.content)
  }

  return undefined
}

function parseIntegerString(s: string): bigint | undefined {
  try {
    return BigInt(s)
  } catch {
    if (s.startsWith("-")) {
      try {
        return -BigInt(s.slice(1))
      } catch {
        return undefined
      }
    }
    if (s.startsWith("+")) {
      return BigInt(s.slice(1))
    }
    return undefined
  }
}
