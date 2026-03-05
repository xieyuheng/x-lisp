import * as L from "../index.ts"
import type { Stmt } from "../stmt/index.ts"
import { formatBody, formatExp } from "./formatExp.ts"

export function formatStmt(stmt: Stmt): string {
  switch (stmt.kind) {
    case "DefineFunction": {
      const parameters = stmt.parameters.join(" ")
      const body = formatBody(stmt.body)
      return `(define (${stmt.name} ${parameters}) ${body})`
    }

    case "DefineVariable": {
      const body = formatBody(stmt.body)
      return `(define ${stmt.name} ${body})`
    }

    case "DefineType": {
      const body = formatBody(stmt.body)
      return `(define-type ${stmt.name} ${body})`
    }

    case "DefineDatatype": {
      const type = formatDataPredicate(stmt.datatypeConstructor)
      const constructors = stmt.dataConstructors
        .map(formatDataConstructor)
        .join(" ")
      return `(define-datatype ${type} ${constructors})`
    }

    case "Claim": {
      return `(claim ${stmt.name} ${formatExp(stmt.type)})`
    }

    case "Export": {
      return `(export ${stmt.names.join(" ")})`
    }

    case "ExportAll": {
      return `(export-all)`
    }

    case "ExportExcept": {
      return `(export-except ${stmt.names.join(" ")})`
    }

    case "Import": {
      return `(import "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "ImportAll": {
      return `(import-all "${stmt.path}")`
    }

    case "ImportExcept": {
      return `(import-except "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "ImportAs": {
      return `(import-as "${stmt.path}" ${stmt.prefix})`
    }

    case "Include": {
      return `(include "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "IncludeAll": {
      return `(include-all "${stmt.path}")`
    }

    case "IncludeExcept": {
      return `(include-except "${stmt.path}" ${stmt.names.join(" ")})`
    }

    case "IncludeAs": {
      return `(include-as "${stmt.path}" ${stmt.prefix})`
    }
  }
}

function formatDataPredicate(predicate: L.DatatypeConstructorSpec): string {
  if (predicate.parameters.length === 0) {
    return predicate.name
  } else {
    return `(${predicate.name} ${predicate.parameters.join(" ")})`
  }
}

function formatDataConstructor(ctor: L.DataConstructorSpec): string {
  if (ctor.fields.length === 0) {
    return ctor.name
  } else {
    const fields = ctor.fields.map(formatDataField).join(" ")
    return `(${ctor.name} ${fields})`
  }
}

function formatDataField(field: L.DataField): string {
  return `(${field.name} ${formatExp(field.type)})`
}
