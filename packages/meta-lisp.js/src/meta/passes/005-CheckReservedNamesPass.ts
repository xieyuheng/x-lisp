import { writeln } from "@xieyuheng/std.js/file"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../../meta/index.ts"

// CheckReservedNamesPass
//
// 编译器保留全局名前缀 `©`。用户不能定义以 `©` 开头的全局名字。
// 只检查全局名字；局部名字由 fresh-name 机制避让，不需要此限制。

export function CheckReservedNamesPass(pkg: M.Package): M.Outcome {
  let outcome: M.Outcome = "OutcomeOk"

  for (const fragment of pkg.fragments.values()) {
    for (const stmt of fragment.stmts) {
      outcome = M.outcomeConj([outcome, checkStmt(stmt)])
    }
  }

  return outcome
}

function checkStmt(stmt: M.Stmt<M.Exp>): M.Outcome {
  switch (stmt.kind) {
    case "DeclareModuleStmt":
    case "DefineFunctionStmt":
    case "DefineVariableStmt":
    case "DefineTestStmt":
    case "DefineTypeStmt":
    case "ClaimStmt":
    case "ClaimTypeStmt":
    case "AdmitStmt":
    case "DeclarePrimitiveFunctionStmt":
    case "DeclarePrimitiveVariableStmt": {
      return checkName(stmt.name, stmt.location)
    }

    case "ExemptStmt":
    case "PrivateStmt": {
      return M.outcomeConj(
        stmt.names.map((name) => checkName(name, stmt.location)),
      )
    }

    case "ImportAsStmt": {
      return checkName(stmt.prefix, stmt.location)
    }

    case "DefineEnumStmt": {
      return M.outcomeConj([
        checkName(stmt.typeConstructor.name, stmt.typeConstructor.location),
        ...stmt.dataConstructors.map((constructor) =>
          checkName(constructor.name, constructor.location),
        ),
      ])
    }

    case "DefineStructStmt": {
      return checkName(stmt.typeConstructor.name, stmt.typeConstructor.location)
    }

    case "DefineStructTypeStmt": {
      return M.outcomeConj([
        checkName(stmt.typeConstructor.name, stmt.typeConstructor.location),
        checkExplicitDataConstructor(stmt.dataConstructor),
      ])
    }

    case "DefineAlgebraicTypeStmt": {
      return M.outcomeConj([
        checkName(stmt.typeConstructor.name, stmt.typeConstructor.location),
        ...stmt.dataConstructors.map(checkExplicitDataConstructor),
      ])
    }

    case "DefineOpaqueTypeStmt": {
      return M.outcomeConj([
        checkName(stmt.typeConstructor.name, stmt.typeConstructor.location),
        ...stmt.interfaceEntries.map((entry) =>
          checkName(entry.name, entry.location),
        ),
      ])
    }

    default: {
      return "OutcomeOk"
    }
  }
}

function checkExplicitDataConstructor(
  constructor: M.ExplicitDataConstructor<M.Exp>,
): M.Outcome {
  return M.outcomeConj([
    checkName(constructor.name, constructor.location),
    checkName(constructor.predicate, constructor.location),
    ...constructor.fields.flatMap((field) => [
      checkName(field.accessorName, field.location),
      field.modifierName === undefined
        ? "OutcomeOk"
        : checkName(field.modifierName, field.location),
    ]),
  ])
}

function checkName(name: string, location: S.SourceLocation): M.Outcome {
  if (!name.startsWith("©")) return "OutcomeOk"

  writeln(
    S.sourceLocationReport(
      location,
      `reserved global name starts with "©": ${name}`,
    ),
  )
  return "OutcomeError"
}
