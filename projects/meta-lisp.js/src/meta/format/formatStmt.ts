import * as M from "../index.ts"

export function formatStmt(stmt: M.Stmt): string {
  switch (stmt.kind) {
    case "Import": {
      return `(import ${stmt.modName} ${stmt.names.join(" ")})`
    }

    case "ImportAs": {
      return `(import-as ${stmt.modName} ${stmt.prefix})`
    }

    case "ImportAll": {
      return `(import-all ${stmt.modName})`
    }

    case "DefineFunction": {
      const parameters = stmt.parameters.join(" ")
      const body = M.formatBody(stmt.body)
      return `(define (${stmt.name} ${parameters}) ${body})`
    }

    case "DefineVariable": {
      const body = M.formatBody(stmt.body)
      return `(define ${stmt.name} ${body})`
    }

    case "DefineTest": {
      const body = M.formatBody(stmt.body)
      return `(define-test ${stmt.name} ${body})`
    }

    case "DefineType": {
      const body = M.formatBody(stmt.body)
      return `(define-type ${stmt.name} ${body})`
    }

    case "DefineEnum": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      return `(define-enum ${type} ${constructors})`
    }

    case "DefineStructStar": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructor = formatDataConstructor(stmt.dataConstructor)
      return `(define-struct* ${type} ${constructor})`
    }

    case "DefineStruct": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const fields = stmt.fields.map(formatDataField).join(" ")
      return `(define-struct ${type} ${fields})`
    }

    case "DefineRecordType": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      return `(define-record-type ${type} ${formatAlgebraicTypeConstructor(stmt.dataConstructor)})`
    }

    case "DefineOpaqueType": {
      const params =
        stmt.parameters.length > 0
          ? `(${stmt.name} ${stmt.parameters.join(" ")})`
          : stmt.name
      const repr = M.formatExp(stmt.representationType)
      const ifaces = stmt.interfaceFunctions
        .map(({ name, type }) => `(${name} ${M.formatExp(type)})`)
        .join(" ")
      return `(define-opaque-type ${params} ${repr} ${ifaces})`
    }

    case "DefineAlgebraicType": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatAlgebraicTypeConstructor)
        .join(" ")
      return `(define-algebraic-type ${type} ${constructors})`
    }

    case "Claim": {
      return `(claim ${stmt.name} ${M.formatExp(stmt.type)})`
    }

    case "ClaimType": {
      return `(claim-type ${stmt.name})`
    }

    case "Admit": {
      return `(admit ${stmt.name} ${M.formatExp(stmt.type)})`
    }

    case "Exempt": {
      return `(exempt ${stmt.names.join(" ")})`
    }

    case "Private": {
      return `(private ${stmt.names.join(" ")})`
    }

    case "DeclareModule": {
      return `(module ${stmt.name})`
    }

    case "DeclareErrorModule": {
      return `(error-module ${stmt.name})`
    }

    case "DeclarePrimitiveFunction": {
      return `(declare-primitive-function ${stmt.name} ${stmt.arity})`
    }

    case "DeclarePrimitiveVariable": {
      return `(declare-primitive-variable ${stmt.name})`
    }
  }
}

function formatTypeConstructor(typeConstructor: M.TypeConstructor): string {
  if (typeConstructor.parameters.length === 0) {
    return typeConstructor.name
  } else {
    return `(${typeConstructor.name} ${typeConstructor.parameters.join(" ")})`
  }
}

function formatDataConstructor(
  ctor: Omit<M.DataConstructor, "mod" | "typeName">,
): string {
  if (ctor.fields.length === 0) {
    return ctor.name
  } else {
    const fields = ctor.fields.map(formatDataField).join(" ")
    return `(${ctor.name} ${fields})`
  }
}

function formatDataField(field: M.DataField): string {
  return `(${field.name} ${M.formatExp(field.type)})`
}

function formatAlgebraicTypeConstructor(
  ctor: M.AlgebraicTypeConstructor,
): string {
  const group = `(${ctor.name} ${ctor.fields.map(formatAlgebraicTypeField).join(" ")})`
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

function formatAlgebraicTypeField(field: M.AlgebraicTypeField): string {
  return `(${field.name} ${M.formatExp(field.type)})`
}
