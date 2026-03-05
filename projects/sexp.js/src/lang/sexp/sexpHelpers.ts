import { type Json } from "@xieyuheng/helpers.js/json"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
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
