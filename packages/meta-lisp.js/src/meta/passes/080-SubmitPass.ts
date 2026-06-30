import * as S from "@xieyuheng/sexp.js"
import { range } from "@xieyuheng/std.js/range"
import * as M from "../index.ts"

export function SubmitPass(pkg: M.Package): void {
  for (const [path, fragment] of pkg.fragments) {
    const mod =
      M.packageLookupMod(pkg, pkg.id, fragment.modName) ||
      M.createMod(fragment.modName, pkg)

    M.packageAddMod(pkg, mod)

    for (const stmt of fragment.desugaredStmts) {
      submitStmt(mod, stmt)
    }
  }

  if (pkg.config.compiler.dump) M.packageDumpMods(pkg, "080-submit")
}

function submitStmt(mod: M.Mod, stmt: M.Stmt<M.Term>): void {
  switch (stmt.kind) {
    case "ExemptStmt": {
      for (const name of stmt.names) {
        M.modAdmit(mod, name)
      }

      return
    }

    case "ClaimStmt": {
      M.modClaim(mod, stmt.name, stmt.type)
      return
    }

    case "ClaimTypeStmt": {
      mod.claimed.set(stmt.name, {
        term: makeTypeTermFromParameters([], stmt.location),
        type: M.TypeType(),
      })
      return
    }

    case "AdmitStmt": {
      M.modClaim(mod, stmt.name, stmt.type)
      M.modAdmit(mod, stmt.name)
      return
    }

    case "DeclarePrimitiveFunctionStmt": {
      const definition = M.modLookupDefinition(mod, stmt.name)
      if (definition) {
        if (definition.kind !== "PrimitiveFunctionDefinition") {
          let message = `[submitStmt] expect PrimitiveFunctionDefinition`
          message += `\n  definition: ${M.formatDefinition(definition)}`
          throw new S.ErrorWithSourceLocation(message, stmt.location)
        }

        if (definition.arity !== stmt.arity) {
          let message = `[submitStmt] arity mismatch`
          message += `\n  definition name: ${definition.name}`
          message += `\n  definition arity: ${definition.arity}`
          message += `\n  declared arity: ${stmt.arity}`
          throw new S.ErrorWithSourceLocation(message, stmt.location)
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

      return
    }

    case "DeclarePrimitiveVariableStmt": {
      const definition = M.modLookupDefinition(mod, stmt.name)
      if (definition) {
        if (definition.kind !== "PrimitiveVariableDefinition") {
          let message = `[submitStmt] expect PrimitiveVariableDefinition`
          message += `\n  definition: ${M.formatDefinition(definition)}`
          throw new S.ErrorWithSourceLocation(message, stmt.location)
        }
      } else {
        M.modDefine(
          mod,
          stmt.name,
          M.PrimitiveVariableDeclaration(mod, stmt.name, stmt.location),
        )
      }

      return
    }

    case "DefineFunctionStmt": {
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
      return
    }

    case "DefineVariableStmt": {
      M.modDefine(
        mod,
        stmt.name,
        M.VariableDefinition(mod, stmt.name, stmt.body, stmt.location),
      )
      return
    }

    case "DefineTestStmt": {
      M.modDefine(
        mod,
        stmt.name,
        M.TestDefinition(mod, stmt.name, stmt.body, stmt.location),
      )
      return
    }

    case "DefineTypeStmt": {
      M.modClaim(
        mod,
        stmt.name,
        makeTypeTermFromParameters(stmt.parameters, stmt.location),
      )
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

      return
    }

    case "DefineAlgebraicTypeStmt": {
      const name = stmt.typeConstructor.name
      const typeConstructor = makeTypeConstructorFromPre(mod, stmt.typeConstructor)
      const parameters = typeConstructor.parameters
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

      M.modClaim(
        mod,
        name,
        makeTypeTermFromParameters(parameters, stmt.location),
      )
      M.modDefine(
        mod,
        name,
        M.AlgebraicTypeDefinition(
          mod,
          name,
          typeConstructor,
          dataConstructors,
          stmt.location,
        ),
      )

      for (const dataConstructor of dataConstructors) {
        mod.dataConstructors.set(dataConstructor.name, dataConstructor)
      }

      return
    }

    case "DefineOpaqueTypeStmt": {
      const name = stmt.typeConstructor.name
      const typeConstructor = makeTypeConstructorFromPre(mod, stmt.typeConstructor)
      const parameters = typeConstructor.parameters
      M.modClaim(
        mod,
        name,
        makeTypeTermFromParameters(parameters, stmt.location),
      )
      M.modDefine(
        mod,
        name,
        M.OpaqueTypeDefinition(
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
        ),
      )

      for (const iface of stmt.interfaceEntries) {
        const wrappedType = M.PolymorphicTerm(
          parameters,
          iface.type,
          iface.location,
        )
        M.modClaim(mod, iface.name, wrappedType)
        mod.opaqueClaimed.set(iface.name, wrappedType)
      }
      return
    }
  }
}

function makeTypeTermFromParameters(
  parameters: Array<string>,
  location: S.SourceLocation,
): M.Term {
  const typeTerm = M.QualifiedVarTerm(
    "meta-builtin",
    "builtin",
    "type-t",
    location,
  )
  if (parameters.length === 0) {
    return typeTerm
  } else {
    return M.ArrowTerm(
      range(parameters.length).map((_) => typeTerm),
      typeTerm,
      location,
    )
  }
}

function makeTypeConstructorFromPre(mod: M.Mod, pre: M.PreTypeConstructor): M.TypeConstructor {
  return {
    mod,
    name: pre.name,
    parameters: pre.parameters,
    location: pre.location,
  }
}
