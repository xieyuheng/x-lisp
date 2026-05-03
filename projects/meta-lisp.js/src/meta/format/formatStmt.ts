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

    case "DefineData": {
      const type = formatDataTypeConstructor(stmt.dataTypeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      return `(define-data ${type} ${constructors})`
    }

    case "DefineInterface": {
      const type = formatInterfaceTypeConstructor(stmt.interfaceConstructor)
      const attributeTypes = M.formatExpAttributes(stmt.attributeTypes)
      return `(define-interface ${type} ${attributeTypes})`
    }

    case "Claim": {
      return `(claim ${stmt.name} ${M.formatExp(stmt.type)})`
    }

    case "Exempt": {
      return `(exempt ${stmt.names.join(" ")})`
    }

    case "DeclareModule": {
      return `(module ${stmt.name})`
    }

    case "DeclareTypeErrorModule": {
      return `(type-error-module ${stmt.name})`
    }

    case "DeclarePrimitiveFunction": {
      return `(declare-primitive-function ${stmt.name} ${stmt.arity})`
    }

    case "DeclarePrimitiveVariable": {
      return `(declare-primitive-variable ${stmt.name})`
    }
  }
}

function formatDataTypeConstructor(
  dataTypeConstructor: Omit<M.DataTypeConstructor, "definition">,
): string {
  if (dataTypeConstructor.parameters.length === 0) {
    return dataTypeConstructor.name
  } else {
    return `(${dataTypeConstructor.name} ${dataTypeConstructor.parameters.join(" ")})`
  }
}

function formatInterfaceTypeConstructor(
  interfaceConstructor: Omit<M.InterfaceConstructor, "definition">,
): string {
  if (interfaceConstructor.parameters.length === 0) {
    return interfaceConstructor.name
  } else {
    return `(${interfaceConstructor.name} ${interfaceConstructor.parameters.join(" ")})`
  }
}

function formatDataConstructor(
  ctor: Omit<M.DataConstructor, "definition">,
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
