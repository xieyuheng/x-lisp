import { type Json } from "@xieyuheng/helpers.js/json"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "../sexp/index.ts"

// Only translate those sexp that can be translated to JSON,
// i.e. only pure list and pure record,
// not non-empty list or atom mixed with attributes.

export function sexpToJson(sexp: S.Sexp): Json {
  if (S.isInt(sexp)) {
    return Number(sexp.content)
  }

  if (S.isAtom(sexp)) {
    return sexp.content
  }

  if (sexp.kind === "Tael") {
    if (sexp.elements.length === 0) {
      return recordMapValue(sexp.attributes, sexpToJson)
    } else {
      return sexp.elements.map(sexpToJson)
    }
  }
}

export function symbolContent(sexp: S.Sexp): string {
  if (sexp.kind !== "Symbol") {
    throw new Error(`[symbolContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function hashtagContent(sexp: S.Sexp): string {
  if (sexp.kind !== "Hashtag") {
    throw new Error(`[hashtagContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function stringContent(sexp: S.Sexp): string {
  if (sexp.kind !== "String") {
    throw new Error(`[stringContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function intContent(sexp: S.Sexp): bigint {
  if (sexp.kind !== "Int") {
    throw new Error(`[intContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function floatContent(sexp: S.Sexp): number {
  if (sexp.kind !== "Float") {
    throw new Error(`[floatContent] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.content
}

export function listElements(sexp: S.Sexp): Array<S.Sexp> {
  if (sexp.kind !== "Tael") {
    throw new Error(`[listElements] wrong sexp kind: ${sexp.kind}`)
  }

  return sexp.elements
}
