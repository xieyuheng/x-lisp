import { define } from "../define/index.ts"
import { emptyEnv } from "../env/index.ts"
import { modGet, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export async function handleDefine(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Define") {
    if (modGet(mod, stmt.name)) {
      throw new Error(`[handleDefine] I can not redefine name: ${stmt.name}\n`)
    }

    define(mod, stmt.name, Values.Lazy(mod, emptyEnv(), stmt.exp))
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

    for (const constructor of Object.values(spec.constructors)) {
      if (constructor.fields.length === 0) {
        define(mod, constructor.name, Values.Data(constructor, []))
      } else {
        define(mod, constructor.name, constructor)
      }

      define(
        mod,
        `${constructor.name}?`,
        Values.DataConstructorPredicate(constructor),
      )
    }
  }
}
