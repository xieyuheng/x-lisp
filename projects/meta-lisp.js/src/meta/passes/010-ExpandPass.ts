import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ExpandPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
  }

  if (options.dump) M.projectDumpFragments(project, "010-expand")
}

function getDataType(stmt: M.DefineAlgebraicType): M.Exp {
  if (stmt.typeConstructor.parameters.length === 0) {
    return M.Var(stmt.typeConstructor.name)
  } else {
    return M.Apply(
      M.Var(stmt.typeConstructor.name),
      stmt.typeConstructor.parameters.map((parameter) => M.Var(parameter)),
    )
  }
}

function admitWithParameters(
  name: string,
  parameters: Array<string>,
  type: M.Exp,
  location?: S.SourceLocation,
): M.Stmt {
  if (parameters.length === 0) {
    return M.Admit(name, type, location)
  } else {
    return M.Admit(name, M.Polymorphic(parameters, type), location)
  }
}

function expandStmt(stmt: M.Stmt): Array<M.Stmt> {
  switch (stmt.kind) {
    case "DefineEnum": {
      const algebraicType = desugarDefineEnum(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineStructStar": {
      const algebraicType = desugarDefineStructStar(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineStruct": {
      const algebraicType = desugarDefineStruct(stmt)
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineRecordType": {
      const algebraicType = M.DefineAlgebraicType(
        stmt.typeConstructor,
        [stmt.dataConstructor],
        stmt.location,
      )
      return expandDefineAlgebraicType(algebraicType)
    }

    case "DefineAlgebraicType": {
      return expandDefineAlgebraicType(stmt)
    }

    default: {
      return [stmt]
    }
  }
}

function desugarDefineEnum(stmt: M.DefineEnum): M.DefineAlgebraicType {
  const dataConstructors = stmt.dataConstructors.map((ctor) => {
    const fields = ctor.fields.map((field) => ({
      name: field.name,
      type: field.type,
      accessorName: `${ctor.name}-${field.name}`,
      modifierName: `${ctor.name}-put-${field.name}!`,
      location: field.location,
    }))

    return {
      name: ctor.name,
      fields,
      predicate: `${ctor.name}?`,
      location: ctor.location,
    }
  })

  return M.DefineAlgebraicType(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function desugarDefineStructStar(
  stmt: M.DefineStructStar,
): M.DefineAlgebraicType {
  const typeName = stmt.typeConstructor.name

  if (!typeName.endsWith("-t")) {
    let message = `[desugarDefineStruct] type name must end with "-t"`
    message += `\n  type name: ${typeName}`
    message += `\n  hint: use the explicit (define-algebraic-type) syntax instead`
    throw new Error(message)
  }

  const base = typeName.slice(0, -2)
  const ctor = stmt.dataConstructor

  const fields = ctor.fields.map((field) => ({
    name: field.name,
    type: field.type,
    accessorName: `${base}-${field.name}`,
    modifierName: `${base}-put-${field.name}!`,
    location: field.location,
  }))

  const dataConstructors = [
    {
      name: ctor.name,
      fields,
      predicate: `${base}?`,
      location: ctor.location,
    },
  ]

  return M.DefineAlgebraicType(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function desugarDefineStruct(stmt: M.DefineStruct): M.DefineAlgebraicType {
  const typeName = stmt.typeConstructor.name

  if (!typeName.endsWith("-t")) {
    let message = `[desugarDefineStruct] type name must end with "-t"`
    message += `\n  type name: ${typeName}`
    message += `\n  hint: use the explicit (define-algebraic-type) syntax instead`
    throw new Error(message)
  }

  const base = typeName.slice(0, -2)

  const fields = stmt.fields.map((field) => ({
    name: field.name,
    type: field.type,
    accessorName: `${base}-${field.name}`,
    modifierName: `${base}-put-${field.name}!`,
    location: field.location,
  }))

  const dataConstructors = [
    {
      name: `make-${base}`,
      fields,
      predicate: `${base}?`,
      location: stmt.location,
    },
  ]

  return M.DefineAlgebraicType(
    stmt.typeConstructor,
    dataConstructors,
    stmt.location,
  )
}

function expandDefineAlgebraicType(stmt: M.DefineAlgebraicType): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = [stmt]

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
  stmt: M.DefineAlgebraicType,
  ctor: M.AlgebraicTypeConstructor,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const parameters = ctor.fields.map((field) => field.name)
  const args = ctor.fields.map((field) => M.Var(field.name, field.location))

  stmts.push(
    admitWithParameters(
      ctor.name,
      stmt.typeConstructor.parameters,
      M.Arrow(
        ctor.fields.map((field) => field.type),
        getDataType(stmt),
        ctor.location,
      ),
      ctor.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      ctor.name,
      parameters,
      M.LiteralList([M.Symbol(ctor.name), ...args], ctor.location),
      ctor.location,
    ),
  )

  return stmts
}

function expandPredicate(
  stmt: M.DefineAlgebraicType,
  ctor: M.AlgebraicTypeConstructor,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  stmts.push(
    admitWithParameters(
      ctor.predicate,
      stmt.typeConstructor.parameters,
      M.Arrow([getDataType(stmt)], M.Var("bool-t"), ctor.location),
      ctor.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      ctor.predicate,
      ["value"],
      M.And([
        M.Apply(M.Var("list?"), [M.Var("value")]),
        M.Apply(M.Var("equal?"), [
          M.Apply(M.Var("list-length"), [M.Var("value")]),
          M.Int(BigInt(ctor.fields.length + 1)),
        ]),
        M.Apply(M.Var("equal?"), [
          M.Apply(M.Var("list-head"), [M.Var("value")]),
          M.Symbol(ctor.name),
        ]),
      ]),
      ctor.location,
    ),
  )

  return stmts
}

function expandAccessor(
  stmt: M.DefineAlgebraicType,
  ctor: M.AlgebraicTypeConstructor,
  index: number,
  field: M.AlgebraicTypeField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  stmts.push(
    admitWithParameters(
      field.accessorName,
      stmt.typeConstructor.parameters,
      M.Arrow([getDataType(stmt)], field.type, field.location),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      field.accessorName,
      ["target"],
      M.Apply(
        M.Var("list-get", field.location),
        [M.Int(BigInt(index + 1)), M.Var("target", field.location)],
        field.location,
      ),
      field.location,
    ),
  )

  return stmts
}

function expandModifier(
  stmt: M.DefineAlgebraicType,
  ctor: M.AlgebraicTypeConstructor,
  index: number,
  field: M.AlgebraicTypeField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  if (field.modifierName === undefined) return stmts

  stmts.push(
    admitWithParameters(
      field.modifierName,
      stmt.typeConstructor.parameters,
      M.Arrow(
        [field.type, getDataType(stmt)],
        getDataType(stmt),
        field.location,
      ),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      field.modifierName,
      ["value", "target"],
      M.Apply(
        M.Var("list-put!"),
        [
          M.Int(BigInt(index + 1), field.location),
          M.Var("value", field.location),
          M.Var("target", field.location),
        ],
        field.location,
      ),
      field.location,
    ),
  )

  return stmts
}
