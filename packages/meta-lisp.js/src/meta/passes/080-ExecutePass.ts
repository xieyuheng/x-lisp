import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"

export function ExecutePass(
  rootPkg: M.Package,
  options: Map<string, string>,
): void {
  for (const pkg of M.packageAndAllDependencies(rootPkg)) {
    for (const [path, fragment] of pkg.fragments) {
      let mod =
        M.packageLookupMod(pkg, "self", fragment.modName) ||
        M.createMod(fragment.modName, pkg)

      M.packageAddMod(pkg, mod)

      for (const stmt of fragment.desugaredStmts) {
        executeStmt(mod, stmt)
      }
    }
  }

  if (options.has("dump")) M.packageDumpMods(rootPkg, "080-execute")
}

function executeStmt(mod: M.Mod, stmt: M.Stmt<M.Term>): void {
  if (stmt.kind === "CommentStmt") {
    return
  }

  if (stmt.kind === "ExemptStmt") {
    for (const name of stmt.names) {
      mod.admitted.add(name)
    }
  }

  if (stmt.kind === "ClaimStmt") {
    M.modClaim(mod, stmt.name, stmt.type)
  }

  if (stmt.kind === "ClaimTypeStmt") {
    mod.claimed.set(stmt.name, {
      exp: M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
      type: M.TypeType(),
    })
  }

  if (stmt.kind === "AdmitStmt") {
    M.modClaim(mod, stmt.name, stmt.type)
    mod.admitted.add(stmt.name)
  }

  if (stmt.kind === "DeclarePrimitiveFunctionStmt") {
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

  if (stmt.kind === "DeclarePrimitiveVariableStmt") {
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

  if (stmt.kind === "DefineFunctionStmt") {
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

  if (stmt.kind === "DefineVariableStmt") {
    M.modDefine(
      mod,
      stmt.name,
      M.VariableDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineTestStmt") {
    M.modDefine(
      mod,
      stmt.name,
      M.TestDefinition(mod, stmt.name, stmt.body, stmt.location),
    )
  }

  if (stmt.kind === "DefineTypeStmt") {
    if (stmt.parameters.length === 0) {
      M.modClaim(
        mod,
        stmt.name,
        M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
      )
    } else {
      M.modClaim(
        mod,
        stmt.name,
        M.ArrowTerm(
          range(stmt.parameters.length).map((_) =>
            M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          ),
          M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          stmt.location,
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

  if (stmt.kind === "DefineAlgebraicTypeStmt") {
    const name = stmt.typeConstructor.name
    const typeConstructor: M.TypeConstructor = {
      mod,
      name: stmt.typeConstructor.name,
      parameters: stmt.typeConstructor.parameters,
      location: stmt.typeConstructor.location,
    }

    const dataConstructors = stmt.dataConstructors.map(
      (ctor): M.DataConstructor => ({
        mod,
        typeName: name,
        name: ctor.name,
        fields: ctor.fields.map((field) => ({
          name: field.name,
          type: field.type,
          location: field.location,
        })),
        location: ctor.location,
      }),
    )

    const definition = M.AlgebraicTypeDefinition(
      mod,
      name,
      typeConstructor,
      dataConstructors,
      stmt.location,
    )

    M.modDefine(mod, name, definition)
    for (const dataConstructor of dataConstructors) {
      mod.dataConstructors.set(dataConstructor.name, dataConstructor)
    }

    if (typeConstructor.parameters.length === 0) {
      M.modClaim(
        mod,
        name,
        M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
      )
    } else {
      M.modClaim(
        mod,
        name,
        M.ArrowTerm(
          range(typeConstructor.parameters.length).map((_) =>
            M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          ),
          M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          stmt.location,
        ),
      )
    }
  }

  if (stmt.kind === "DefineOpaqueTypeStmt") {
    const name = stmt.name
    const typeConstructor: M.TypeConstructor = {
      mod,
      name: stmt.name,
      parameters: stmt.parameters,
      location: stmt.location,
    }

    const definition = M.OpaqueTypeDefinition(
      mod,
      name,
      typeConstructor,
      stmt.representationType,
      stmt.interfaceEntries.map((f) => ({
        name: f.name,
        type: f.type,
        location: f.location,
      })),
      stmt.location,
    )

    M.modDefine(mod, name, definition)

    if (stmt.parameters.length === 0) {
      M.modClaim(
        mod,
        name,
        M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
      )
    } else {
      M.modClaim(
        mod,
        name,
        M.ArrowTerm(
          range(stmt.parameters.length).map((_) =>
            M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          ),
          M.QualifiedVarTerm("meta-builtin", "builtin", "type-t", stmt.location),
          stmt.location,
        ),
      )
    }

    for (const iface of stmt.interfaceEntries) {
      const wrappedType = M.PolymorphicTerm(
        stmt.parameters,
        iface.type,
        iface.location,
      )
      M.modClaim(mod, iface.name, wrappedType)
      mod.opaqueClaimed.set(iface.name, wrappedType)
    }
  }
}
