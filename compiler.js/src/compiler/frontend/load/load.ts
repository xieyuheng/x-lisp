import * as X from "@xieyuheng/x-sexp.js"
import fs from "node:fs"
import { createMod, type Mod } from "../mod/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { matchStmt } from "../syntax/index.ts"
import { stage1 } from "./stage1.ts"

export function load(url: URL): Mod {
  const mod = createMod(url)
  const text = loadText(url)

  const sexps = X.parseSexps(text, { url: mod.url })
  const stmts = sexps.map<Stmt>(matchStmt)
  for (const stmt of stmts) stage1(mod, stmt)

  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
