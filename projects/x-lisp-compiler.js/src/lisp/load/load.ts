import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import { createMod, type Mod } from "../mod/index.ts"
import { parseStmt } from "../parse/index.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"

export function loadEntry(url: URL): Mod {
  return load(url, new Map())
}

export function load(url: URL, dependencies: Map<string, Mod>): Mod {
  const found = dependencies.get(url.href)
  if (found !== undefined) return found

  const text = loadText(url)
  const mod = createMod(url, dependencies)
  dependencies.set(url.href, mod)

  const sexps = S.parseSexps(text, { url: mod.url })

  mod.stmts = sexps.map(parseStmt)
  for (const stmt of mod.stmts) stage1(mod, stmt)
  for (const stmt of mod.stmts) stage2(mod, stmt)

  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
