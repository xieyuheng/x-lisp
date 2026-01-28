import { type Line, type Stmt } from "../stmt/index.ts"
import { formatInstr } from "./formatInstr.ts"

export function formatStmt(stmt: Stmt): string {
  switch (stmt.kind) {
    case "Export": {
      return `(export ${stmt.names.join(" ")})`
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

    case "DefineFunction": {
      const name = stmt.name
      const parameters = stmt.parameters.join(" ")
      const lines = stmt.lines.map(formatLine).join(" ")
      return `(define-function (${name} ${parameters}) ${lines})`
    }

    case "DefineVariable": {
      const name = stmt.name
      const lines = stmt.lines.map(formatLine).join(" ")
      return `(define-variable ${name} ${lines})`
    }
  }
}

function formatLine(line: Line): string {
  switch (line.kind) {
    case "Label": {
      return line.name
    }

    default: {
      return formatInstr(line)
    }
  }
}
