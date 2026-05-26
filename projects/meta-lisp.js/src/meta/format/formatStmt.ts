import * as M from "../index.ts"

export function formatStmt<E>(
  stmt: M.Stmt<E>,
  formatBody: (body: E) => string,
): string {
  switch (stmt.kind) {
    case "ImportStmt": {
      return `(import ${stmt.modName} ${stmt.names.join(" ")})`
    }

    case "ImportAsStmt": {
      return `(import-as ${stmt.modName} ${stmt.prefix})`
    }

    case "ImportAllStmt": {
      return `(import-all ${stmt.modName})`
    }

    case "DefineFunctionStmt": {
      const parameters = stmt.parameters.join(" ")
      const body = formatBody(stmt.body)
      return `(define (${stmt.name} ${parameters}) ${body})`
    }

    case "DefineVariableStmt": {
      const body = formatBody(stmt.body)
      return `(define ${stmt.name} ${body})`
    }

    case "DefineTestStmt": {
      const body = formatBody(stmt.body)
      return `(define-test ${stmt.name} ${body})`
    }

    case "DefineTypeStmt": {
      const body = formatBody(stmt.body)
      return `(define-type ${stmt.name} ${body})`
    }

    case "DefineEnumStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      return `(define-enum ${type} ${constructors})`
    }

    case "DefineStructStarStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructor = formatDataConstructor(stmt.dataConstructor)
      return `(define-struct* ${type} ${constructor})`
    }

    case "DefineStructStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const fields = stmt.fields.map(formatDataField).join(" ")
      return `(define-struct ${type} ${fields})`
    }

    case "DefineRecordTypeStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      return `(define-record-type ${type} ${formatAlgebraicTypeConstructor(stmt.dataConstructor, formatBody)})`
    }

    case "DefineOpaqueTypeStmt": {
      const params =
        stmt.parameters.length > 0
          ? `(${stmt.name} ${stmt.parameters.join(" ")})`
          : stmt.name
      const repr = formatBody(stmt.representationType)
      const ifaces = stmt.interfaceFunctions
        .map(({ name, type }) => `(${name} ${formatBody(type)})`)
        .join(" ")
      return `(define-opaque-type ${params} ${repr} ${ifaces})`
    }

    case "DefineAlgebraicTypeStmt": {
      const type = formatTypeConstructor(stmt.typeConstructor)
      const constructors = stmt.dataConstructors
        .map((ctor) => formatAlgebraicTypeConstructor(ctor, formatBody))
        .join(" ")
      return `(define-algebraic-type ${type} ${constructors})`
    }

    case "ClaimStmt": {
      return `(claim ${stmt.name} ${formatBody(stmt.type)})`
    }

    case "ClaimTypeStmt": {
      return `(claim-type ${stmt.name})`
    }

    case "AdmitStmt": {
      return `(admit ${stmt.name} ${formatBody(stmt.type)})`
    }

    case "ExemptStmt": {
      return `(exempt ${stmt.names.join(" ")})`
    }

    case "PrivateStmt": {
      return `(private ${stmt.names.join(" ")})`
    }

    case "DeclareModuleStmt": {
      return `(module ${stmt.name})`
    }

    case "DeclarePrimitiveFunctionStmt": {
      return `(declare-primitive-function ${stmt.name} ${stmt.arity})`
    }

    case "DeclarePrimitiveVariableStmt": {
      return `(declare-primitive-variable ${stmt.name})`
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
    return ctor.name
  } else {
    const fields = ctor.fields.map(formatDataField).join(" ")
    return `(${ctor.name} ${fields})`
  }
}

function formatDataField(field: M.PreDataField): string {
  return `(${field.name} ${M.formatExp(field.type)})`
}

function formatAlgebraicTypeConstructor<E>(
  ctor: M.AlgebraicTypeConstructor<E>,
  formatBody: (body: E) => string,
): string {
  const group = `(${ctor.name} ${ctor.fields.map((f) => formatAlgebraicTypeField(f, formatBody)).join(" ")})`
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

function formatAlgebraicTypeField<E>(
  field: M.AlgebraicTypeField<E>,
  formatBody: (body: E) => string,
): string {
  return `(${field.name} ${formatBody(field.type)})`
}
