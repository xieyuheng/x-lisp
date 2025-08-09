import { define } from "../define/index.ts"
import { emptyEnv } from "../env/index.ts"
import { evaluate, resultValue } from "../evaluate/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export function handleDefine(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Define") {
    if (mod.defs.get(stmt.name)) {
      let message = `(define) I can not redefine name: ${stmt.name}\n`
      throw new Error(message)
    }

    define(mod, stmt.name, resultValue(evaluate(stmt.exp)(mod, emptyEnv())))
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

    define(mod, stmt.predicate.name, spec.predicate)

    for (const constructor of Object.values(spec.constructors)) {
      define(
        mod,
        constructor.name,
        constructor.fields.length === 0
          ? Values.Data(constructor, [])
          : constructor,
      )

      define(
        mod,
        `${constructor.name}?`,
        Values.DataConstructorPredicate(constructor),
      )

      for (const [index, field] of constructor.fields.entries()) {
        define(
          mod,
          `${constructor.name}-${field.name}`,
          Values.DataGetter(constructor, field.name, index),
        )
      }
    }
  }
}
