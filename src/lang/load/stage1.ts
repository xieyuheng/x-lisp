import { defineValue, provide } from "../define/index.ts"
import { emptyEnv } from "../env/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import * as Values from "../value/index.ts"

export function stage1(mod: Mod, stmt: Stmt): void {
  if (stmt.kind === "Define") {
    const value = Values.Lazy(mod, emptyEnv(), stmt.exp)
    defineValue(mod, stmt.name, value)
  }

  if (stmt.kind === "Export") {
    provide(mod, stmt.names)
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

    defineValue(mod, stmt.predicate.name, spec.predicate)

    for (const constructor of Object.values(spec.constructors)) {
      defineValue(
        mod,
        constructor.name,
        constructor.fields.length === 0
          ? Values.Hashtag(constructor.name)
          : constructor,
      )

      defineValue(
        mod,
        `${constructor.name}?`,
        Values.DataConstructorPredicate(constructor),
      )

      for (const [index, field] of constructor.fields.entries()) {
        defineValue(
          mod,
          `${constructor.name}-${field.name}`,
          Values.DataGetter(constructor, field.name, index),
        )
      }

      for (const [index, field] of constructor.fields.entries()) {
        defineValue(
          mod,
          `put-${constructor.name}-${field.name}!`,
          Values.DataPutter(constructor, field.name, index),
        )
      }
    }
  }
}
