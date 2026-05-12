import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ExpandPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
  }
}

function getDataType(stmt: M.DefineEnum): M.Exp {
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
      const stmts: Array<M.Stmt> = [stmt]

      for (const dataConstructor of stmt.dataConstructors) {
        stmts.push(...expandDataConstructor(stmt, dataConstructor))
        stmts.push(...expandDataConstructorPredicate(stmt, dataConstructor))

        for (const [index, field] of dataConstructor.fields.entries()) {
          stmts.push(...expandDataAccessor(stmt, dataConstructor, index, field))
          stmts.push(...expandDataModifier(stmt, dataConstructor, index, field))
        }
      }

      return stmts
    }

    default: {
      return [stmt]
    }
  }
}

function expandDataConstructor(
  stmt: M.DefineEnum,
  dataConstructor: Omit<M.DataConstructor, "definition">,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const parameters = dataConstructor.fields.map((field) => field.name)
  const args = parameters.map((name) => M.Var(name))

  stmts.push(
    admitWithParameters(
      dataConstructor.name,
      stmt.typeConstructor.parameters,
      M.Arrow(
        dataConstructor.fields.map((field) => field.type),
        getDataType(stmt),
      ),
      dataConstructor.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      dataConstructor.name,
      parameters,
      M.LiteralList([M.Symbol(dataConstructor.name), ...args]),
      dataConstructor.location,
    ),
  )

  return stmts
}

export function expandDataConstructorPredicate(
  stmt: M.DefineEnum,
  dataConstructor: Omit<M.DataConstructor, "definition">,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const name = `${dataConstructor.name}?`

  stmts.push(
    admitWithParameters(
      name,
      stmt.typeConstructor.parameters,
      M.Arrow([getDataType(stmt)], M.Var("bool-t")),
      dataConstructor.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      name,
      ["value"],
      M.And([
        M.Apply(M.Var("list?"), [M.Var("value")]),
        M.Apply(M.Var("equal?"), [
          M.Apply(M.Var("list-length"), [M.Var("value")]),
          M.Int(BigInt(dataConstructor.fields.length + 1)),
        ]),
        M.Apply(M.Var("equal?"), [
          M.Apply(M.Var("list-head"), [M.Var("value")]),
          M.Symbol(dataConstructor.name),
        ]),
      ]),
      dataConstructor.location,
    ),
  )

  return stmts
}

function expandDataAccessor(
  stmt: M.DefineEnum,
  dataConstructor: Omit<M.DataConstructor, "definition">,
  index: number,
  field: M.DataField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const name = `${dataConstructor.name}-${field.name}`

  stmts.push(
    admitWithParameters(
      name,
      stmt.typeConstructor.parameters,
      M.Arrow([getDataType(stmt)], field.type),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      name,
      ["target"],
      M.Apply(M.Var("list-get"), [M.Int(BigInt(index + 1)), M.Var("target")]),
      field.location,
    ),
  )

  return stmts
}

function expandDataModifier(
  stmt: M.DefineEnum,
  dataConstructor: Omit<M.DataConstructor, "definition">,
  index: number,
  field: M.DataField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []
  const name = `${dataConstructor.name}-put-${field.name}!`

  stmts.push(
    admitWithParameters(
      name,
      stmt.typeConstructor.parameters,
      M.Arrow([field.type, getDataType(stmt)], getDataType(stmt)),
      field.location,
    ),
  )

  stmts.push(
    M.DefineFunction(
      name,
      ["value", "target"],
      M.Apply(M.Var("list-put!"), [
        M.Int(BigInt(index + 1)),
        M.Var("value"),
        M.Var("target"),
      ]),
      field.location,
    ),
  )

  return stmts
}
