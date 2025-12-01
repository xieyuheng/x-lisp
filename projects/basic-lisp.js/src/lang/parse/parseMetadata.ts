import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import type { Metadata } from "../metadata/index.ts"

export function parseMetadata(sexp: S.Sexp): Metadata {
  if (S.isInt(sexp)) {
    return B.IntMetadata(BigInt(sexp.content))
  } else if (S.isFloat(sexp)) {
    return B.FloatMetadata(sexp.content)
  } else if (S.isString(sexp)) {
    return B.StringMetadata(sexp.content)
  } else if (S.isSymbol(sexp)) {
    return B.PointerMetadata(sexp.content)
  } else if (
    S.isTael(sexp) &&
    S.sexpEqual(S.asTael(sexp).elements[0], S.Symbol("@tael"))
  ) {
    if (Object.keys(sexp.attributes).length === 0) {
      const elements = S.asTael(sexp).elements.slice(1)
      return B.ListMetadata(elements.map(parseMetadata))
    } else {
      return B.RecordMetadata(recordMapValue(sexp.attributes, parseMetadata))
    }
  } else {
    let message = `[parseMetadata] unhandled sexp`
    message += `\n  sexp: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
}
