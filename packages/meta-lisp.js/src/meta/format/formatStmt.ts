import * as S from "@xieyuheng/sexp.js"
import { langKeyword } from "../language/Lang.ts"
import * as M from "../index.ts"

export function formatStmt<E>(
  stmt: M.Stmt<E>,
  formatBody: (body: E) => string,
): string {
  switch (stmt.kind) {
    case "ImportStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return `(${langKeyword("import", "导入")} ${modName} ${stmt.names.join(" ")})`
    }

    case "ImportAsStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return `(${langKeyword("import-as", "导入为")} ${modName} ${stmt.prefix})`
    }

    case "ImportAllStmt": {
      const modName =
        stmt.pkgName === "self"
          ? stmt.modName
          : `${stmt.pkgName}/${stmt.modName}`
      return `(${langKeyword("import-all", "全导入")} ${modName})`
    }

    case "DefineFunctionStmt": {
      const parameters = stmt.parameters.join(" ")
      const body = formatBody(stmt.body)
      return `(${langKeyword("define", "定义")} (${stmt.name} ${parameters}) ${body})`
    }

    case "DefineVariableStmt": {
      const body = formatBody(stmt.body)
      return `(${langKeyword("define", "定义")} ${stmt.name} ${body})`
    }

    case "DefineTestStmt": {
      const body = formatBody(stmt.body)
      return `(${langKeyword("define-test", "定义测试")} ${stmt.name} ${body})`
    }

    case "DefineTypeStmt": {
      const params =
        stmt.parameters.length > 0
          ? `(${stmt.name} ${stmt.parameters.join(" ")})`
          : `(${stmt.name} )`
      const body = formatBody(stmt.body)
      return `(${langKeyword("define-type", "定义类型")} ${params} ${body})`
    }

    case "DefineEnumStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      return `(${langKeyword("define-enum", "定义枚举")} ${type} ${constructors})`
    }

    case "DefineStructStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const fields = stmt.fields.map(formatDataField).join(" ")
      return `(${langKeyword("define-struct", "定义结构")} ${type} ${fields})`
    }

    case "DefineStructTypeStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      return `(${langKeyword("define-struct-type", "定义结构类型")} ${type} ${formatExplicitDataConstructor(stmt.dataConstructor, formatBody)})`
    }

    case "DefineOpaqueTypeStmt": {
      const { name, parameters } = stmt.typeConstructor
      const params =
        parameters.length > 0 ? `(${name} ${parameters.join(" ")})` : name
      const repr = formatBody(stmt.representationType)
      const ifaces = stmt.interfaceEntries
        .map(({ name, type }) => `(${name} ${formatBody(type)})`)
        .join(" ")
      return `(${langKeyword("define-opaque-type", "定义黑盒类型")} ${params} ${repr} ${ifaces})`
    }

    case "DefineAlgebraicTypeStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map((ctor) => formatExplicitDataConstructor(ctor, formatBody))
        .join(" ")
      return `(${langKeyword("define-algebraic-type", "定义代数类型")} ${type} ${constructors})`
    }

    case "ClaimStmt": {
      return `(${langKeyword("claim", "声明")} ${stmt.name} ${formatBody(stmt.type)})`
    }

    case "ClaimTypeStmt": {
      return `(${langKeyword("claim-type", "声明类型")} ${stmt.name})`
    }

    case "AdmitStmt": {
      return `(${langKeyword("admit", "承认")} ${stmt.name} ${formatBody(stmt.type)})`
    }

    case "ExemptStmt": {
      return `(${langKeyword("exempt", "免检")} ${stmt.names.join(" ")})`
    }

    case "PrivateStmt": {
      return `(${langKeyword("private", "私有")} ${stmt.names.join(" ")})`
    }

    case "DeclareModuleStmt": {
      return `(${langKeyword("module", "模块")} ${stmt.name})`
    }

    case "DeclarePrimitiveFunctionStmt": {
      return `(${langKeyword("declare-primitive-function", "声明基本函数")} ${stmt.name} ${stmt.arity})`
    }

    case "DeclarePrimitiveVariableStmt": {
      return `(${langKeyword("declare-primitive-variable", "声明基本变量")} ${stmt.name})`
    }

    case "CommentStmt": {
      if (stmt.sexps.length === 0)
        return `(${langKeyword("@comment", "@注释")})`
      const content = stmt.sexps.map(S.formatSexp).join(" ")
      return `(${langKeyword("@comment", "@注释")} ${content})`
    }
  }
}

function formatTypeConstructor(typeConstructor: M.PreTypeConstructor): string {
  if (typeConstructor.parameters.length === 0) {
    return typeConstructor.name
  } else {
    return `(${typeConstructor.name} ${typeConstructor.parameters.join(" ")})`
  }
}

function formatDataConstructor(ctor: M.PreDataConstructor): string {
  if (ctor.fields.length === 0) {
    return `(${ctor.name})`
  } else {
    const fields = ctor.fields.map(formatDataField).join(" ")
    return `(${ctor.name} ${fields})`
  }
}

function formatDataField(field: M.PreDataField): string {
  return `(${field.name} ${M.formatExp(field.type)})`
}

function formatExplicitDataConstructor<E>(
  ctor: M.ExplicitDataConstructor<E>,
  formatBody: (body: E) => string,
): string {
  const group = `(${ctor.name} ${ctor.fields.map((f) => formatExplicitDataField(f, formatBody)).join(" ")})`
  const accessors = ctor.fields
    .map((field) => {
      if (field.modifierName !== undefined) {
        return `(${field.name} ${field.accessorName} ${field.modifierName})`
      } else {
        return `(${field.name} ${field.accessorName})`
      }
    })
    .join(" ")
  return `(${group} ${ctor.predicate} ${accessors})`
}

function formatExplicitDataField<E>(
  field: M.ExplicitDataField<E>,
  formatBody: (body: E) => string,
): string {
  return `(${field.name} ${formatBody(field.type)})`
}
