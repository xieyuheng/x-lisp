import * as Ppml from "@xieyuheng/ppml.js"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyStmt<E>(
  stmt: M.Stmt<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  switch (stmt.kind) {
    case "ImportStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return Ppml.prettySyntax(
        "import",
        [Ppml.text(modName)],
        stmt.names.map(Ppml.text),
      )
    }

    case "ImportAsStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return Ppml.prettySyntax(
        "import-as",
        [Ppml.text(modName), Ppml.text(stmt.prefix)],
        [],
      )
    }

    case "ImportAllStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return Ppml.prettySyntax("import-all", [Ppml.text(modName)], [])
    }

    case "DefineFunctionStmt": {
      const paramNodes = stmt.parameters.map(Ppml.text)
      const defNode = Ppml.prettyApplication([
        Ppml.text(stmt.name),
        ...paramNodes,
      ])
      return Ppml.prettySyntax("define", [defNode], [prettyBody(stmt.body)])
    }

    case "DefineVariableStmt": {
      return Ppml.prettySyntax(
        "define",
        [Ppml.text(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineTestStmt": {
      return Ppml.prettySyntax(
        "define-test",
        [Ppml.text(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineTypeStmt": {
      return Ppml.prettySyntax(
        "define-type",
        [Ppml.text(stmt.name)],
        [prettyBody(stmt.body)],
      )
    }

    case "DefineEnumStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const ctorNodes = stmt.dataConstructors.map(prettyPreDataConstructor)
      return Ppml.prettySyntax("define-enum", [typeNode], ctorNodes)
    }

    case "DefineStructStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const fieldNodes = stmt.fields.map(prettyPreDataField)
      return Ppml.prettySyntax("define-struct", [typeNode], fieldNodes)
    }

    case "DefineRecordTypeStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      return Ppml.prettySyntax(
        "define-record-type",
        [typeNode],
        [prettyExplicitDataConstructor(stmt.dataConstructor, prettyBody)],
      )
    }

    case "DefineAlgebraicTypeStmt": {
      const typeNode = prettyPreTypeConstructor(stmt.typeConstructor)
      const ctorNodes = stmt.dataConstructors.map((ctor) =>
        prettyExplicitDataConstructor(ctor, prettyBody),
      )
      return Ppml.prettySyntax("define-algebraic-type", [typeNode], ctorNodes)
    }

    case "DefineOpaqueTypeStmt": {
      const { name, parameters } = stmt.typeConstructor
      const paramsNode =
        parameters.length > 0
          ? Ppml.prettyApplication([
              Ppml.text(name),
              ...parameters.map(Ppml.text),
            ])
          : Ppml.text(name)
      const reprNode = prettyBody(stmt.representationType)
      const ifaceNodes = stmt.interfaceEntries.map(({ name, type }) =>
        Ppml.prettyApplication([Ppml.text(name), prettyBody(type)]),
      )
      return Ppml.prettySyntax(
        "define-opaque-type",
        [paramsNode, reprNode],
        ifaceNodes,
      )
    }

    case "ClaimStmt": {
      return Ppml.prettySyntax(
        "claim",
        [Ppml.text(stmt.name)],
        [prettyBody(stmt.type)],
      )
    }

    case "ClaimTypeStmt": {
      return Ppml.prettySyntax("claim-type", [Ppml.text(stmt.name)], [])
    }

    case "AdmitStmt": {
      return Ppml.prettySyntax(
        "admit",
        [Ppml.text(stmt.name)],
        [prettyBody(stmt.type)],
      )
    }

    case "ExemptStmt": {
      return Ppml.prettySyntax("exempt", [], stmt.names.map(Ppml.text))
    }

    case "PrivateStmt": {
      return Ppml.prettySyntax("private", [], stmt.names.map(Ppml.text))
    }

    case "DeclareModuleStmt": {
      return Ppml.prettySyntax("module", [], [Ppml.text(stmt.name)])
    }

    case "DeclarePrimitiveFunctionStmt": {
      return Ppml.prettySyntax(
        "declare-primitive-function",
        [],
        [Ppml.text(stmt.name), Ppml.text(stmt.arity.toString())],
      )
    }

    case "DeclarePrimitiveVariableStmt": {
      return Ppml.prettySyntax(
        "declare-primitive-variable",
        [],
        [Ppml.text(stmt.name)],
      )
    }

    case "CommentStmt": {
      return Ppml.prettySyntax(
        "@comment",
        [],
        stmt.sexps.map((s) => Ppml.text(S.formatSexp(s))),
      )
    }
  }
}

function prettyPreTypeConstructor(tc: M.PreTypeConstructor): Ppml.Node {
  if (tc.parameters.length === 0) {
    return Ppml.text(tc.name)
  } else {
    return Ppml.prettyApplication([
      Ppml.text(tc.name),
      ...tc.parameters.map(Ppml.text),
    ])
  }
}

function prettyPreDataConstructor(ctor: M.PreDataConstructor): Ppml.Node {
  const fieldNodes = ctor.fields.map(prettyPreDataField)
  return Ppml.prettyApplication([Ppml.text(ctor.name), ...fieldNodes])
}

function prettyPreDataField(field: M.PreDataField): Ppml.Node {
  return Ppml.prettyApplication([Ppml.text(field.name), prettyExp(field.type)])
}

function prettyExplicitDataConstructor<E>(
  ctor: M.ExplicitDataConstructor<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  const fieldGroup = Ppml.prettyApplication([
    Ppml.text(ctor.name),
    ...ctor.fields.map((f) => prettyExplicitDataField(f, prettyBody)),
  ])
  const accessorNodes = ctor.fields.map((field) => {
    if (field.modifierName !== undefined) {
      return Ppml.group(
        Ppml.text("("),
        Ppml.text(field.name),
        Ppml.text(" "),
        Ppml.text(field.accessorName),
        Ppml.text(" "),
        Ppml.text(field.modifierName),
        Ppml.text(")"),
      )
    } else {
      return Ppml.group(
        Ppml.text("("),
        Ppml.text(field.name),
        Ppml.text(" "),
        Ppml.text(field.accessorName),
        Ppml.text(")"),
      )
    }
  })
  return Ppml.prettyApplication([
    fieldGroup,
    Ppml.text(ctor.predicate),
    ...accessorNodes,
  ])
}

function prettyExplicitDataField<E>(
  field: M.ExplicitDataField<E>,
  prettyBody: (body: E) => Ppml.Node,
): Ppml.Node {
  return Ppml.prettyApplication([Ppml.text(field.name), prettyBody(field.type)])
}
