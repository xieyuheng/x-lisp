import * as X from "@xieyuheng/x-sexp.js"

export function sexpKeywordMeta(sexp: X.Sexp): X.TokenMeta {
  const keyword = X.asTael(sexp).elements[1]
  return X.tokenMetaFromSexpMeta(keyword.meta)
}
