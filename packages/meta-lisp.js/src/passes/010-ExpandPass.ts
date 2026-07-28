import * as S from "@xieyuheng/sexp.js"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function ExpandPass(pkg: Pkg.Package): void {
  for (const fragment of pkg.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
  }

  if (pkg.config.compiler.dump) Pkg.packageDumpFragments(pkg, "010-expand")
}

function getDataType(stmt: M.DefineAlgebraicTypeStmt<M.Exp>): M.Exp {
  if (stmt.typeConstructor.parameters.length === 0) {
    return M.VarExp(stmt.typeConstructor.name, stmt.typeConstructor.location)
  } else {
    return M.ApplyExp(
      M.VarExp(stmt.typeConstructor.name, stmt.typeConstructor.location),
      stmt.typeConstructor.parameters.map((parameter) =>
        M.VarExp(parameter, stmt.typeConstructor.location),
      ),
      stmt.typeConstructor.location,
    )
  }
}

function admitWithParameters(
  name: string,
  parameters: Array<string>,
  type: M.Exp,
  location: S.SourceLocation,
): M.Stmt<M.Exp> {
  if (parameters.length === 0) {
    return M.AdmitStmt(name, type, location)
  } else {
    return M.AdmitStmt(
      name,
      M.PolymorphicExp(parameters, type, location),
      location,
    )
  }
}

function expandStmt(stmt: M.Stmt<M.Exp>): Array<M.Stmt<M.Exp>> {
  switch (stmt.kind) {
    case "DefineEnumStmt": {
      const algebraicType = desugarDefineEnum(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineStructStarStmt": {
      const algebraicType = desugarDefineStructStar(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineStructStmt": {
      const algebraicType = desugarDefineStruct(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineRecordTypeStmt": {
      const algebraicType = M.DefineAlgebraicTypeStmt(
        stmt.typeConstructor,
        [stmt.dataConstructor],
        stmt.location,
      )
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineAlgebraicTypeStmt": {
      return expandDefineAlgebraicType(stmt)
    }

    default: {
      return [stmt]
    }
  }
}

function desugarDefineEnum(
  stmt: M.DefineEnumStmt<M.Exp>,
): M.DefineAlgebraicTypeStmt<M.Exp> {
  const dataConstructors = stmt.dataConstructors.map((ctor) => {
    const fields = ctor.fields.map((field) => ({
      name: field.name,
      type: field.type,
      accessorName:
        stmt.lang === "zh"
          ? `${ctor.name}${field.name}`
          : `${ctor.name}-${field.name}`,
      modifierName:
        stmt.lang === "zh"
          ? `${ctor.name}置${field.name}`
          : `${ctor.name}-put-${field.name}`,
      location: field.location,
    }))

    return {
      name: ctor.name,
      fields,
      predicate: stmt.lang === "zh" ? `为${ctor.name}` : `is-${ctor.name}`,
      location: ctor.location,
    }
  })

  return M.DefineAlgebraicTypeStmt(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function parseTypeNameBase(name: string, lang: M.Lang): string {
  if (lang === "en" && name.endsWith("-t")) {
    return name.slice(0, -2)
  }
  if (lang === "zh" && name.endsWith("型")) {
    return name.slice(0, -1)
  }
  let message = `[desugarDefineStruct] type name must end with "${lang === "en" ? "-t" : "型"}"`
  message += `\n  type name: ${name}`
  message += `\n  hint: use the explicit (define-algebraic-type) syntax instead`
  throw new Error(message)
}

function desugarDefineStructStar(
  stmt: M.DefineStructStarStmt<M.Exp>,
): M.DefineAlgebraicTypeStmt<M.Exp> {
  const typeName = stmt.typeConstructor.name
  const base = parseTypeNameBase(typeName, stmt.lang)
  const ctor = stmt.dataConstructor

  const fields = ctor.fields.map((field) => ({
    name: field.name,
    type: field.type,
    accessorName:
      stmt.lang === "zh" ? `${base}${field.name}` : `${base}-${field.name}`,
    modifierName:
      stmt.lang === "zh"
        ? `${base}置${field.name}`
        : `${base}-put-${field.name}`,
    location: field.location,
  }))

  const dataConstructors = [
    {
      name: ctor.name,
      fields,
      predicate: stmt.lang === "zh" ? `为${base}` : `is-${base}`,
      location: ctor.location,
    },
  ]

  return M.DefineAlgebraicTypeStmt(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function desugarDefineStruct(
  stmt: M.DefineStructStmt<M.Exp>,
): M.DefineAlgebraicTypeStmt<M.Exp> {
  const typeName = stmt.typeConstructor.name
  const base = parseTypeNameBase(typeName, stmt.lang)

  const fields = stmt.fields.map((field) => ({
    name: field.name,
    type: field.type,
    accessorName:
      stmt.lang === "zh" ? `${base}${field.name}` : `${base}-${field.name}`,
    modifierName:
      stmt.lang === "zh"
        ? `${base}置${field.name}`
        : `${base}-put-${field.name}`,
    location: field.location,
  }))

  const dataConstructors = [
    {
      name: stmt.lang === "zh" ? `作${base}` : `make-${base}`,
      fields,
      predicate: stmt.lang === "zh" ? `为${base}` : `is-${base}`,
      location: stmt.location,
    },
  ]

  return M.DefineAlgebraicTypeStmt(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function expandDefineAlgebraicType(
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
): Array<M.Stmt<M.Exp>> {
  const stmts: Array<M.Stmt<M.Exp>> = [stmt]

  for (const ctor of stmt.dataConstructors) {
    stmts.push(...expandConstructor(stmt, ctor))
    stmts.push(...expandPredicate(stmt, ctor))

    for (const [index, field] of ctor.fields.entries()) {
      stmts.push(...expandAccessor(stmt, ctor, index, field))
      if (field.modifierName !== undefined) {
        stmts.push(...expandModifier(stmt, ctor, index, field))
      }
    }
  }

  return stmts
}

function expandConstructor(
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
  ctor: M.ExplicitDataConstructor<M.Exp>,
): Array<M.Stmt<M.Exp>> {
  const stmts: Array<M.Stmt<M.Exp>> = []

  const parameters = ctor.fields.map((field) => field.name)
  const args = ctor.fields.map((field) => M.VarExp(field.name, field.location))

  stmts.push(
    admitWithParameters(
      ctor.name,
      stmt.typeConstructor.parameters,
      M.ArrowExp(
        ctor.fields.map((field) => field.type),
        getDataType(stmt),
        ctor.location,
      ),
      ctor.location,
    ),
  )

  stmts.push(
    M.DefineFunctionStmt(
      ctor.name,
      parameters,
      M.ListExp(
        [M.SymbolExp(ctor.name, ctor.location), ...args],
        ctor.location,
      ),
      ctor.location,
    ),
  )

  return stmts
}

function expandPredicate(
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
  ctor: M.ExplicitDataConstructor<M.Exp>,
): Array<M.Stmt<M.Exp>> {
  const stmts: Array<M.Stmt<M.Exp>> = []

  stmts.push(
    admitWithParameters(
      ctor.predicate,
      stmt.typeConstructor.parameters,
      M.ArrowExp(
        [getDataType(stmt)],
        M.VarExp("bool-t", ctor.location),
        ctor.location,
      ),
      ctor.location,
    ),
  )

  stmts.push(
    M.DefineFunctionStmt(
      ctor.predicate,
      ["value"],
      M.AndExp(
        [
          M.ApplyExp(
            M.VarExp("is-list", ctor.location),
            [M.VarExp("value", ctor.location)],
            ctor.location,
          ),
          M.ApplyExp(
            M.VarExp("equal", ctor.location),
            [
              M.ApplyExp(
                M.VarExp("list-length", ctor.location),
                [M.VarExp("value", ctor.location)],
                ctor.location,
              ),
              M.IntExp(BigInt(ctor.fields.length + 1), ctor.location),
            ],
            ctor.location,
          ),
          M.ApplyExp(
            M.VarExp("equal", ctor.location),
            [
              M.ApplyExp(
                M.VarExp("list-head", ctor.location),
                [M.VarExp("value", ctor.location)],
                ctor.location,
              ),
              M.SymbolExp(ctor.name, ctor.location),
            ],
            ctor.location,
          ),
        ],
        ctor.location,
      ),
      ctor.location,
    ),
  )

  return stmts
}

function expandAccessor(
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
  ctor: M.ExplicitDataConstructor<M.Exp>,
  index: number,
  field: M.ExplicitDataField<M.Exp>,
): Array<M.Stmt<M.Exp>> {
  const stmts: Array<M.Stmt<M.Exp>> = []

  stmts.push(
    admitWithParameters(
      field.accessorName,
      stmt.typeConstructor.parameters,
      M.ArrowExp([getDataType(stmt)], field.type, field.location),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunctionStmt(
      field.accessorName,
      ["target"],
      M.ApplyExp(
        M.VarExp("list-get", field.location),
        [
          M.IntExp(BigInt(index + 1), field.location),
          M.VarExp("target", field.location),
        ],
        field.location,
      ),
      field.location,
    ),
  )

  return stmts
}

function expandModifier(
  stmt: M.DefineAlgebraicTypeStmt<M.Exp>,
  ctor: M.ExplicitDataConstructor<M.Exp>,
  index: number,
  field: M.ExplicitDataField<M.Exp>,
): Array<M.Stmt<M.Exp>> {
  const stmts: Array<M.Stmt<M.Exp>> = []

  if (field.modifierName === undefined) return stmts

  stmts.push(
    admitWithParameters(
      field.modifierName,
      stmt.typeConstructor.parameters,
      M.ArrowExp(
        [field.type, getDataType(stmt)],
        getDataType(stmt),
        field.location,
      ),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunctionStmt(
      field.modifierName,
      ["value", "target"],
      M.BeginExp(
        [
          M.ApplyExp(
            M.VarExp("list-put", field.location),
            [
              M.IntExp(BigInt(index + 1), field.location),
              M.VarExp("value", field.location),
              M.VarExp("target", field.location),
            ],
            field.location,
          ),
          M.VarExp("target", field.location),
        ],
        field.location,
      ),
      field.location,
    ),
  )

  return stmts
}
