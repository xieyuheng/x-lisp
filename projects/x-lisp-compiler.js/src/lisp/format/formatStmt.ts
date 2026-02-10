import type { Stmt } from "../stmt/index.ts"
import * as Stmts from "../stmt/index.ts"
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

    case "DefineData": {
      const predicate = formatDataPredicate(stmt.predicate)
      const constructors = stmt.constructors
        .map(formatDataConstructor)
        .join(" ")
      return `(define-data ${predicate} ${constructors})`
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

function formatDataPredicate(predicate: Stmts.DataPredicateSpec): string {
  if (predicate.parameters.length === 0) {
    return predicate.name
  } else {
    return `(${predicate.name} ${predicate.parameters.join(" ")})`
  }
}

function formatDataConstructor(ctor: Stmts.DataConstructorSpec): string {
  if (ctor.fields.length === 0) {
    return ctor.name
  } else {
    const fields = ctor.fields.map(formatDataField).join(" ")
    return `(${ctor.name} ${fields})`
  }
}

function formatDataField(field: Stmts.DataField): string {
  return `(${field.name} ${formatExp(field.schema)})`
}
