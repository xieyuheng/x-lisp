import * as S from "@xieyuheng/x-sexp.js"
import fs from "node:fs"
import { importBuiltin } from "../builtin/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { parseStmt } from "../parse/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"

export function load(url: URL, dependencies: Map<string, Mod>): Mod {
  const found = dependencies.get(url.href)
  if (found !== undefined) return found

  const text = loadText(url)
  const mod = createMod(url)
  dependencies.set(url.href, mod)

  importBuiltin(mod)

  const sexps = S.parseSexps(text, { url: mod.url })
  const stmts = sexps.map<Stmt>(parseStmt)

  for (const stmt of stmts) stage1(mod, stmt)
  for (const stmt of stmts) stage2(mod, stmt)

  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
