import * as S from "@xieyuheng/x-sexp.js"
import { formatIndent } from "../../helpers/format/formatIndent.ts"
import { type Definition } from "../definition/index.ts"
import { formatDefinition } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function stage2(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "ImportAll") {
    //
  }
}

function checkRedefine(
  mod: Mod,
  name: string,
  definition: Definition,
  meta: S.TokenMeta,
): void {
  const found = mod.definitions.get(name)
  if (found === undefined) return
  if (found === definition) return

  let message = `[checkRedefine] can not redefine name: ${name}`
  message += `\n  old definition:`
  message += formatIndent(4, formatDefinition(found))
  message += `\n  new definition:`
  message += formatIndent(4, formatDefinition(definition))
  throw new S.ErrorWithMeta(message, meta)
}
