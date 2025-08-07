import { emptyEnv } from "../env/index.ts"
import { modGet, modSet, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export async function handleDefine(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Define") {
    if (modGet(mod, stmt.name)) {
      throw new Error(`[handleDefine] I can not redefine name: ${stmt.name}\n`)
    }

    const { name, exp } = stmt
    const value = Values.Lazy(mod, emptyEnv(), exp)
    modSet(mod, name, { mod, name, value })
    return
  }

  if (stmt.kind === "DefineData") {
    const spec = { mod, constructors: {} } as Values.DataSpec

    spec.predicate = Values.DataPredicate(
      spec,
      stmt.predicate.name,
      stmt.predicate.parameters,
    )

    for (const { name, fields } of stmt.constructors) {
      spec.constructors[name] = Values.DataConstructor(spec, name, fields)
    }
  }
}
