import * as S from "@xieyuheng/x-sexp.js"
import type { Definition } from "../definition/index.ts"
import { modDefinitions, type Mod } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"
import * as Stmts from "../stmt/index.ts"
import { transpileBlock } from "./transpileBlock.ts"
import { transpileChunk } from "./transpileChunk.ts"
import { transpileIdentifier } from "./transpileIdentifier.ts"

const indentation = " ".repeat(8)

export function transpileToX86Assembly(mod: Mod): string {
  let code = ""

  const moduleStmts = mod.stmts

  for (const stmt of mod.stmts) {
    if (Stmts.isAboutModule(stmt)) {
      code += transpileModuleStmt(stmt)
      code += "\n"
    }
  }

  for (const definition of modDefinitions(mod)) {
    code += "\n"
    code += transpileDefinition(definition)
    code += "\n"
  }

  return code
}

function transpileModuleStmt(stmt: Stmt): string {
  if (!Stmts.isAboutModule(stmt)) {
    let message = `[transpileModuleStmt] non module stmt`
    message += `\n  stmt kind: ${stmt.kind}`
    throw new S.ErrorWithMeta(message, stmt.meta)
  }

  switch (stmt.kind) {
    case "Export": {
      return stmt.names
        .map((name) => `${indentation}.global ${transpileIdentifier([name])}`)
        .join("\n")
    }
  }
}

function transpileDefinition(definition: Definition): string {
  switch (definition.kind) {
    case "CodeDefinition": {
      const name = transpileIdentifier([definition.name])
      const blocks = Array.from(definition.blocks.values())
        .map((block) => transpileBlock({ definition }, block))
        .join("\n")
      return `.text\n${name}:\n${blocks}`
    }

    case "DataDefinition": {
      const name = transpileIdentifier([definition.name])
      const chunks = Array.from(definition.chunks.values())
        .map((chunk) => transpileChunk({ definition }, chunk))
        .join("\n")
      return `.data\n${name}:\n${chunks}`
    }
  }
}
