import assert from "node:assert"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import * as S from "../sexp/index.ts"
import { type TokenMeta } from "./Token.ts"

export function tokenMetaToSexpMeta(meta: TokenMeta): S.Attributes {
  return S.asTael(S.sexpFromJson(meta)).attributes
}

export function tokenMetaFromSexpMeta(meta: S.Attributes): TokenMeta {
  const json: any = recordMapValue(meta, S.sexpToJson)

  try {
    assert(json)
    assert(json.span)
    assert(json.span.start)
    assert(json.span.end)
    assert(json.text)
    if (json.url) {
      json.url = new URL(json.url)
    }

    return json
  } catch (error) {
    console.dir(
      {
        who: "tokenMetaFromSexp",
        json,
        meta,
        error,
      },
      { depth: null },
    )

    throw error
  }
}
