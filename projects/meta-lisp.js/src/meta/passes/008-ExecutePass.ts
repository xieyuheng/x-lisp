import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"

export function ExecutePass(project: M.Project): void {
  for (const [path, fragment] of project.fragments) {
    let mod =
      M.projectLookupMod(project, fragment.modName) ||
      M.createMod(fragment.modName, project)

    M.projectAddMod(project, mod)

    if (fragment.isTypeErrorModule) {
      mod.isTypeErrorModule = true
    }

    for (const stmt of fragment.stmts) {
      executeStmt(mod, stmt)
    }
  }
}

function executeStmt(mod: M.Mod, stmt: M.Stmt): void {
  if (stmt.kind === "Exempt") {
    for (const name of stmt.names) {
      mod.exempted.add(name)
    }
  }

  if (stmt.kind === "Claim") {
    M.modClaim(mod, stmt.name, stmt.type)
  }

  if (stmt.kind === "DeclarePrimitiveFunction") {
    const definition = M.modLookupDefinition(mod, stmt.name)
    if (definition && definition.kind === "PrimitiveFunctionDefinition") {
      if (definition.arity !== stmt.arity) {
        let message = `[executeDefine] arity mismatch`
        message += `\n  definition name: ${definition.name}`
        message += `\n  definition arity: ${definition.arity}`
        message += `\n  declared arity: ${stmt.arity}`
        throw new Error(message)
      }
    } else {
      M.modDefine(
        mod,
        stmt.name,
        M.PrimitiveFunctionDeclaration(
          mod,
          stmt.name,
          stmt.arity,
          stmt.location,
        ),
      )
    }
  }

  if (stmt.kind === "DeclarePrimitiveVariable") {
    const definition = M.modLookupDefinition(mod, stmt.name)
    if (definition && definition.kind === "PrimitiveVariableDefinition") {
      return
    } else {
      M.modDefine(
        mod,
        stmt.name,
        M.PrimitiveVariableDeclaration(mod, stmt.name, stmt.location),
      )
    }
  }

  if (stmt.kind === "DefineFunction") {
    M.modDefine(
      mod,
      stmt.name,
      M.FunctionDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.location,
      ),
    )
  }

  if (stmt.kind === "DefineVariable") {
    M.modDefine(
      mod,
      stmt.name,
      M.VariableDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineTest") {
    M.modDefine(
      mod,
      stmt.name,
      M.TestDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineType") {
    if (stmt.parameters.length === 0) {
      M.modClaim(mod, stmt.name, M.QualifiedVar("builtin", "type-t"))
    } else {
      M.modClaim(
        mod,
        stmt.name,
        M.Arrow(
          range(stmt.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t"),
          ),
          M.QualifiedVar("builtin", "type-t"),
        ),
      )
    }

    M.modDefine(
      mod,
      stmt.name,
      M.TypeDefinition(
        mod,
        stmt.name,
        stmt.parameters,
        stmt.body,
        stmt.location,
      ),
    )
  }

  if (stmt.kind === "DefineData") {
    const name = stmt.dataTypeConstructor.name
    const dataTypeConstructor =
      stmt.dataTypeConstructor as unknown as M.DataTypeConstructor
    const dataConstructors =
      stmt.dataConstructors as unknown as Array<M.DataConstructor>

    const definition = M.DataDefinition(
      mod,
      name,
      dataTypeConstructor,
      dataConstructors,
      stmt.location,
    )

    dataTypeConstructor.definition = definition

    for (const dataConstructor of dataConstructors) {
      dataConstructor.definition = definition
      dataConstructor.fields = dataConstructor.fields.map((field) => ({
        name: field.name,
        type: field.type,
      }))
    }

    M.modDefine(mod, name, definition)

    if (dataTypeConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.QualifiedVar("builtin", "type-t"))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(dataTypeConstructor.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t"),
          ),
          M.QualifiedVar("builtin", "type-t"),
        ),
      )
    }

    for (const dataConstructor of dataConstructors) {
      mod.dataConstructors.set(dataConstructor.name, dataConstructor)
    }
  }

  if (stmt.kind === "DefineInterface") {
    const name = stmt.interfaceConstructor.name
    const interfaceConstructor =
      stmt.interfaceConstructor as unknown as M.InterfaceConstructor
    const definition = M.InterfaceDefinition(
      mod,
      name,
      interfaceConstructor,
      stmt.attributeTypes,
      stmt.location,
    )
    interfaceConstructor.definition = definition
    M.modDefine(mod, name, definition)

    if (interfaceConstructor.parameters.length === 0) {
      M.modClaim(mod, name, M.QualifiedVar("builtin", "type-t"))
    } else {
      M.modClaim(
        mod,
        name,
        M.Arrow(
          range(interfaceConstructor.parameters.length).map((_) =>
            M.QualifiedVar("builtin", "type-t"),
          ),
          M.QualifiedVar("builtin", "type-t"),
        ),
      )
    }
  }
}
