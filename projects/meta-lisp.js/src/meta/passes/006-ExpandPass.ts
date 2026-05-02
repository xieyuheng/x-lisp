import * as M from "../index.ts"

export function ExpandPass(project: M.Project): void {
  for (const fragment of project.fragments.values()) {
    fragment.stmts = fragment.stmts.flatMap(expandStmt)
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

  if (dataConstructor.fields.length === 0) {
    stmts.push(
      M.DefineVariable(
        dataConstructor.name,
        M.Symbol(dataConstructor.name),
        dataConstructor.location,
      ),
    )

    if (stmt.dataTypeConstructor.parameters.length === 0) {
      stmts.push(
        M.Claim(
          dataConstructor.name,
          M.Var(stmt.dataTypeConstructor.name),
          dataConstructor.location,
        ),
      )
    } else {
      stmts.push(
        M.Claim(
          dataConstructor.name,
          M.Polymorphic(
            stmt.dataTypeConstructor.parameters,
            M.Apply(
              M.Var(stmt.dataTypeConstructor.name),
              stmt.dataTypeConstructor.parameters.map((parameter) =>
                M.Var(parameter),
              ),
            ),
          ),
          dataConstructor.location,
        ),
      )
    }
  } else {
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

    if (stmt.dataTypeConstructor.parameters.length === 0) {
      stmts.push(
        M.Claim(
          dataConstructor.name,
          M.Arrow(
            dataConstructor.fields.map((field) => field.type),
            M.Var(stmt.dataTypeConstructor.name),
          ),
          dataConstructor.location,
        ),
      )
    } else {
      stmts.push(
        M.Claim(
          dataConstructor.name,
          M.Polymorphic(
            stmt.dataTypeConstructor.parameters,
            M.Arrow(
              dataConstructor.fields.map((field) => field.type),
              M.Apply(
                M.Var(stmt.dataTypeConstructor.name),
                stmt.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ),
          ),
          dataConstructor.location,
        ),
      )
    }
  }

  return stmts
}

export function expandDataConstructorPredicate(
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  const name = `${dataConstructor.name}?`

  stmts.push(M.Exempt([name], dataConstructor.location))

  if (dataConstructor.fields.length === 0) {
    stmts.push(
      M.DefineFunction(
        name,
        ["value"],
        M.Apply(M.Var("equal?"), [
          M.Var("value"),
          M.Symbol(dataConstructor.name),
        ]),
        dataConstructor.location,
      ),
    )
  } else {
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
  }

  if (stmt.dataTypeConstructor.parameters.length === 0) {
    stmts.push(
      M.Claim(
        name,
        M.Arrow([M.Var(stmt.dataTypeConstructor.name)], M.Var("bool-t")),
        dataConstructor.location,
      ),
    )
  } else {
    stmts.push(
      M.Claim(
        name,
        M.Polymorphic(
          stmt.dataTypeConstructor.parameters,
          M.Arrow(
            [
              M.Apply(
                M.Var(stmt.dataTypeConstructor.name),
                stmt.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ],
            M.Var("bool-t"),
          ),
        ),
        dataConstructor.location,
      ),
    )
  }

  return stmts
}

export function expandDataGetter(
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

  if (stmt.dataTypeConstructor.parameters.length === 0) {
    stmts.push(
      M.Claim(
        name,
        M.Arrow([M.Var(stmt.dataTypeConstructor.name)], field.type),
        field.location,
      ),
    )
  } else {
    stmts.push(
      M.Claim(
        name,
        M.Polymorphic(
          stmt.dataTypeConstructor.parameters,
          M.Arrow(
            [
              M.Apply(
                M.Var(stmt.dataTypeConstructor.name),
                stmt.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ],
            field.type,
          ),
        ),
        field.location,
      ),
    )
  }

  return stmts
}

export function expandDataPutter(
  stmt: M.DefineData,
  dataConstructor: Omit<M.DataConstructor, "definition">,
  index: number,
  field: M.DataField,
): Array<M.Stmt> {
  const stmts: Array<M.Stmt> = []

  {
    const name = `${dataConstructor.name}-put-${field.name}`

    stmts.push(M.Exempt([name], field.location))

    stmts.push(
      M.DefineFunction(
        name,
        ["value", "target"],
        M.Apply(M.Var("list-put"), [
          M.Int(BigInt(index + 1)),
          M.Var("value"),
          M.Var("target"),
        ]),
        field.location,
      ),
    )

    if (stmt.dataTypeConstructor.parameters.length === 0) {
      stmts.push(
        M.Claim(
          name,
          M.Arrow(
            [field.type, M.Var(stmt.dataTypeConstructor.name)],
            M.Var(stmt.dataTypeConstructor.name),
          ),
          field.location,
        ),
      )
    } else {
      stmts.push(
        M.Claim(
          name,
          M.Polymorphic(
            stmt.dataTypeConstructor.parameters,
            M.Arrow(
              [
                field.type,
                M.Apply(
                  M.Var(stmt.dataTypeConstructor.name),
                  stmt.dataTypeConstructor.parameters.map((parameter) =>
                    M.Var(parameter),
                  ),
                ),
              ],
              M.Apply(
                M.Var(stmt.dataTypeConstructor.name),
                stmt.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ),
          ),
          field.location,
        ),
      )
    }
  }

  {
    const name = `${dataConstructor.name}-put-${field.name}!`

    stmts.push(M.Exempt([name], field.location))

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

    if (stmt.dataTypeConstructor.parameters.length === 0) {
      stmts.push(
        M.Claim(
          name,
          M.Arrow(
            [field.type, M.Var(stmt.dataTypeConstructor.name)],
            M.Var(stmt.dataTypeConstructor.name),
          ),
          field.location,
        ),
      )
    } else {
      stmts.push(
        M.Claim(
          name,
          M.Polymorphic(
            stmt.dataTypeConstructor.parameters,
            M.Arrow(
              [
                field.type,
                M.Apply(
                  M.Var(stmt.dataTypeConstructor.name),
                  stmt.dataTypeConstructor.parameters.map((parameter) =>
                    M.Var(parameter),
                  ),
                ),
              ],
              M.Apply(
                M.Var(stmt.dataTypeConstructor.name),
                stmt.dataTypeConstructor.parameters.map((parameter) =>
                  M.Var(parameter),
                ),
              ),
            ),
          ),
          field.location,
        ),
      )
    }
  }

  return stmts
}
