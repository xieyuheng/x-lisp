import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"

export function assertNoDuplicatedKey(entries: Array<[string, S.Sexp]>): void {
  for (const [key, group] of Object.entries(
    Object.groupBy(entries, ([key, sexp]) => key),
  )) {
    if (group && group.length > 1) {
      const [_, firstSexp] = group[1]
      assert(firstSexp.meta)
      let message = `[assertNoDuplicatedKey] fail`
      message += `\n  key: ${key}`
      throw new S.ErrorWithMeta(message, firstSexp.meta)
    }
  }
}
