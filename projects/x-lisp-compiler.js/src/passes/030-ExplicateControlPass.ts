import * as B from "../basic/index.ts"
import * as L from "../lisp/index.ts"

export function ExplicateControlPass(mod: L.Mod, basicMod: B.Mod): void {
  for (const stmt of mod.stmts) {
    if (L.isAboutModule(stmt)) {
      basicMod.stmts.push(stmt)
    }
  }

  for (const definition of L.modOwnDefinitions(mod)) {
    basicMod.stmts.push(...onDefinition(basicMod, definition))
  }
}

function onDefinition(
  basicMod: B.Mod,
  definition: L.Definition,
): Array<B.Stmt> {
  switch (definition.kind) {
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const blocks = new Map()
      return [B.DefineFunction(basicMod, definition.name, definition.parameters, blocks)]
    }

    case "VariableDefinition": {
      const blocks = new Map()
      return [B.DefineVariable(basicMod, definition.name, blocks)]
    }
  }
}
