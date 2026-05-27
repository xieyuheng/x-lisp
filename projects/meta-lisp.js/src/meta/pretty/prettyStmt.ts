import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { prettyApplication, prettySyntax, prettyText } from "./layout.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyStmt<E>(
  stmt: M.Stmt<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  switch (stmt.kind) {
    case "ImportStmt": {
      return prettySyntax(
        "import",
        [prettyText(stmt.modName)],
        stmt.names.map(prettyText),
      )
    }

    case "ImportAsStmt": {
      return prettySyntax(
        "import-as",
        [],
        [prettyText(stmt.modName), prettyText(stmt.prefix)],
      )
    }

    case "ImportAllStmt": {
      return prettySyntax("import-all", [], [prettyText(stmt.modName)])
    }

    case "DefineFunctionStmt": {
      const paramNodes = stmt.parameters.map(Ppml.text)
      const defNode = prettyApplication([Ppml.text(stmt.name), ...paramNodes])
      return prettySyntax("define", [defNode], [prettyBody(stmt.body)])
    }

    case "DefineVariableStmt": {
      return prettySyntax(
        "define",
        [prettyText(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineTestStmt": {
      return prettySyntax(
        "define-test",
        [prettyText(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineTypeStmt": {
      return prettySyntax(
        "define-type",
        [prettyText(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineEnumStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const ctorNodes = stmt.dataConstructors.map(prettyPreDataConstructor)
      return prettySyntax("define-enum", [typeNode], ctorNodes)
    }

    case "DefineStructStarStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const ctorNode = prettyPreDataConstructor(stmt.dataConstructor)
      return prettySyntax("define-struct*", [typeNode], [ctorNode])
    }

    case "DefineStructStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const fieldNodes = stmt.fields.map(prettyPreDataField)
      return prettySyntax("define-struct", [typeNode], fieldNodes)
    }

    case "DefineRecordTypeStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      return prettySyntax(
        "define-record-type",
        [typeNode],
        [prettyAlgebraicTypeConstructor(stmt.dataConstructor, prettyBody)],
      )
    }

    case "DefineAlgebraicTypeStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const ctorNodes = stmt.dataConstructors.map((ctor) =>
        prettyAlgebraicTypeConstructor(ctor, prettyBody),
      )
      return prettySyntax("define-algebraic-type", [typeNode], ctorNodes)
    }

    case "DefineOpaqueTypeStmt": {
      const paramsNode =
        stmt.parameters.length > 0
          ? prettyApplication([
              Ppml.text(stmt.name),
              ...stmt.parameters.map(Ppml.text),
            ])
          : prettyText(stmt.name)
      const reprNode = prettyBody(stmt.representationType)
      const ifaceNodes = stmt.interfaceEntries.map(({ name, type }) =>
        prettyApplication([Ppml.text(name), prettyBody(type)]),
      )
      return prettySyntax(
        "define-opaque-type",
        [],
        [paramsNode, reprNode, ...ifaceNodes],
      )
    }

    case "ClaimStmt": {
      return prettySyntax(
        "claim",
        [prettyText(stmt.name)],
        [prettyBody(stmt.type)],
      )
    }

    case "ClaimTypeStmt": {
      return prettySyntax("claim-type", [prettyText(stmt.name)], [])
    }

    case "AdmitStmt": {
      return prettySyntax(
        "admit",
        [prettyText(stmt.name)],
        [prettyBody(stmt.type)],
      )
    }

    case "ExemptStmt": {
      return prettySyntax("exempt", [], stmt.names.map(prettyText))
    }

    case "PrivateStmt": {
      return prettySyntax("private", [], stmt.names.map(prettyText))
    }

    case "DeclareModuleStmt": {
      return prettySyntax("module", [], [prettyText(stmt.name)])
    }

    case "DeclarePrimitiveFunctionStmt": {
      return prettySyntax(
        "declare-primitive-function",
        [],
        [prettyText(stmt.name), prettyText(stmt.arity.toString())],
      )
    }

    case "DeclarePrimitiveVariableStmt": {
      return prettySyntax(
        "declare-primitive-variable",
        [],
        [prettyText(stmt.name)],
      )
    }

    case "CommentStmt": {
      return prettySyntax(
        "@comment",
        [],
        [prettyText(S.formatSexp(stmt.content))],
      )
    }
  }
}

function prettyPreTypeConstructor(tc: M.PreTypeConstructor): Ppml.Node {
  if (tc.parameters.length === 0) {
    return prettyText(tc.name)
  } else {
    return prettyApplication([
      Ppml.text(tc.name),
      ...tc.parameters.map(Ppml.text),
    ])
  }
}

function prettyPreDataConstructor(ctor: M.PreDataConstructor): Ppml.Node {
  if (ctor.fields.length === 0) {
    return prettyText(ctor.name)
  } else {
    const fieldNodes = ctor.fields.map(prettyPreDataField)
    return prettyApplication([prettyText(ctor.name), ...fieldNodes])
  }
}

function prettyPreDataField(field: M.PreDataField): Ppml.Node {
  return prettyApplication([Ppml.text(field.name), prettyExp(field.type)])
}

function prettyAlgebraicTypeConstructor<E>(
  ctor: M.AlgebraicTypeConstructor<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  const fieldGroup = prettyApplication([
    prettyText(ctor.name),
    ...ctor.fields.map((f) => prettyAlgebraicTypeField(f, prettyBody)),
  ])
  const accessorNodes = ctor.fields.map((field) => {
    if (field.modifierName !== undefined) {
      return prettyApplication([
        Ppml.text(field.name),
        Ppml.text(field.accessorName),
        Ppml.text(field.modifierName),
      ])
    } else {
      return prettyApplication([
        Ppml.text(field.name),
        Ppml.text(field.accessorName),
      ])
    }
  })
  return prettyApplication([
    fieldGroup,
    prettyText(ctor.predicate),
    ...accessorNodes,
  ])
}

function prettyAlgebraicTypeField<E>(
  field: M.AlgebraicTypeField<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  return prettyApplication([Ppml.text(field.name), prettyBody(field.type)])
}
