import { isJsonArray, isJsonObject } from "../../helpers/json/Json.ts"
import * as S from "../sexp/index.ts"

// Can not handle null and undefined,
// when found in a record, they will be ignored.

export function sexpFromJson(json: any): S.Sexp {
  if (typeof json === "string") {
    return S.String(json)
  }

  if (json instanceof URL) {
    return S.String(json.href)
  }

  if (typeof json === "number") {
    if (Number.isInteger(json)) {
      return S.Int(json)
    } else {
      return S.Float(json)
    }
  }

  if (typeof json === "boolean") {
    if (json === true) {
      return S.Hashtag("#t")
    } else {
      return S.Hashtag("#f")
    }
  }

  if (isJsonArray(json)) {
    return S.Tael(json.map(sexpFromJson), {})
  }

  if (isJsonObject(json)) {
    return S.Record(
      Object.fromEntries(
        Object.entries(json)
          .filter(([key, value]) => value !== null && value !== undefined)
          .map(([key, value]) => [key, sexpFromJson(value)]),
      ),
    )
  }

  throw new Error(`[sexpFromJson] can not handle json: ${JSON.stringify(json)}`)
}
