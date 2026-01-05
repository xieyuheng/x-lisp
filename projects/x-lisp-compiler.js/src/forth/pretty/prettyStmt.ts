import type { Stmt } from "../stmt/index.ts"
import { prettyExp } from "./prettyExp.ts"

export function prettyStmt(stmt: Stmt, options: { width: number }): string {
  switch (stmt.kind) {
    case "Export": {
      return `@export ${stmt.names.join(" ")} @end`
    }

    case "Import": {
      return `@import "${stmt.path}" ${stmt.names.join(" ")} @end`
    }

    case "ImportAll": {
      return `@import-all "${stmt.path}"`
    }

    case "ImportExcept": {
      return `@import-except "${stmt.path}" ${stmt.names.join(" ")} @end`
    }

    case "ImportAs": {
      return `@import-as "${stmt.path}" ${stmt.prefix}`
    }

    case "Include": {
      return `@include "${stmt.path}" ${stmt.names.join(" ")} @end`
    }

    case "IncludeAll": {
      return `@include-all "${stmt.path}"`
    }

    case "IncludeExcept": {
      return `@include-except "${stmt.path}" ${stmt.names.join(" ")} @end`
    }

    case "IncludeAs": {
      return `@include-as "${stmt.path}" ${stmt.prefix}`
    }

    case "DefineFunction": {
      let s = `@define-function ${stmt.name}`
      s +=
        `\n  ` + prettyExp(stmt.body, { width: options.width, indentation: 2 })
      s += `\n` + `@end`
      return s
    }

    case "DefineVariable": {
      let s = `@define-variable ${stmt.name}`
      s +=
        `\n  ` + prettyExp(stmt.body, { width: options.width, indentation: 2 })
      s += `\n` + `@end`
      return s
    }
  }
}
