import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function ExpandPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
  }
}

function getDataType(stmt: M.DefineData): M.Exp {
  if (stmt.dataTypeConstructor.parameters.length === 0) {
    return M.Var(stmt.dataTypeConstructor.name)
  } else {
    return M.Apply(
      M.Var(stmt.dataTypeConstructor.name),
      stmt.dataTypeConstructor.parameters.map((parameter) => M.Var(parameter)),
    )
  }
}

function claimWithParameters(
  name: string,
  parameters: Array<string>,
  type: M.Exp,
  location?: S.SourceLocation,
): M.Stmt {
  if (parameters.length === 0) {
    return M.Claim(name, type, location)
  } else {
    return M.Claim(name, M.Polymorphic(parameters, type), location)
  }
}

function expandStmt(stmt: M.Stmt): Array<M.Stmt> {
  switch (stmt.kind) {
    case "DefineData": {
      const stmts: Array<M.Stmt> = [stmt]

      for (const dataConstructor of stmt.dataConstructors) {
        stmts.push(...expandDataConstructor(stmt, dataConstructor))
        stmts.push(...expandDataConstructorPredicate(stmt, dataConstructor))

        for (const [index, field] of dataConstructor.fields.entries()) {
          stmts.push(...expandDataGetter(stmt, dataConstructor, index, field))
          stmts.push(...expandDataPutter(stmt, dataConstructor, index, field))
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
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  stmts.push(M.Exempt([dataConstructor.name], dataConstructor.location))

  const parameters = dataConstructor.fields.map((field) => field.name)
  const args = parameters.map((name) => M.Var(name))

  stmts.push(
    M.DefineFunction(
      dataConstructor.name,
      parameters,
      M.LiteralList([M.Symbol(dataConstructor.name), ...args]),
      dataConstructor.location,
    ),
  )

  stmts.push(
    claimWithParameters(
      dataConstructor.name,
      stmt.dataTypeConstructor.parameters,
      M.Arrow(
        dataConstructor.fields.map((field) => field.type),
        getDataType(stmt),
      ),
      dataConstructor.location,
    ),
  )

  return stmts
}

export function expandDataConstructorPredicate(
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const name = `${dataConstructor.name}?`

  stmts.push(M.Exempt([name], dataConstructor.location))

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

  stmts.push(
    claimWithParameters(
      name,
      stmt.dataTypeConstructor.parameters,
      M.Arrow([getDataType(stmt)], M.Var("bool-t")),
      dataConstructor.location,
    ),
  )

  return stmts
}

function expandDataGetter(
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
  index: number,
  field: M.DataField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const name = `${dataConstructor.name}-${field.name}`

  stmts.push(M.Exempt([name], field.location))

  stmts.push(
    M.DefineFunction(
      name,
      ["target"],
      M.Apply(M.Var("list-get"), [M.Int(BigInt(index + 1)), M.Var("target")]),
      field.location,
    ),
  )

  stmts.push(
    claimWithParameters(
      name,
      stmt.dataTypeConstructor.parameters,
      M.Arrow([getDataType(stmt)], field.type),
      field.location,
    ),
  )

  return stmts
}

function expandDataPutter(
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
  index: number,
  field: M.DataField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  stmts.push(
    ...expandDataPutterHelper(
      stmt,
      index,
      field,
      `${dataConstructor.name}-put-${field.name}`,
      "list-put",
    ),
  )

  stmts.push(
    ...expandDataPutterHelper(
      stmt,
      index,
      field,
      `${dataConstructor.name}-put-${field.name}!`,
      "list-put!",
    ),
  )

  return stmts
}

function expandDataPutterHelper(
  stmt: M.DefineData,
  index: number,
  field: M.DataField,
  name: string,
  builtinFn: string,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  stmts.push(M.Exempt([name], field.location))

  stmts.push(
    M.DefineFunction(
      name,
      ["value", "target"],
      M.Apply(M.Var(builtinFn), [
        M.Int(BigInt(index + 1)),
        M.Var("value"),
        M.Var("target"),
      ]),
      field.location,
    ),
  )

  stmts.push(
    claimWithParameters(
      name,
      stmt.dataTypeConstructor.parameters,
      M.Arrow([field.type, getDataType(stmt)], getDataType(stmt)),
      field.location,
    ),
  )

  return stmts
}
