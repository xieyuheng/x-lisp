import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import { importBuiltinMod } from "../../builtin/index.ts"
import * as L from "../index.ts"
import { stage1 } from "./stage1.ts"
import { stage2 } from "./stage2.ts"

export function loadEntry(url: URL): L.Mod {
  return load(url, new Map())
}

export function load(url: URL, dependencies: Map<string, L.Mod>): L.Mod {
  const found = dependencies.get(url.href)
  if (found !== undefined) return found

  const text = loadText(url)
  const mod = L.createMod(url, dependencies)
  dependencies.set(url.href, mod)

  importBuiltinMod(mod)
  const sexps = S.parseSexps(text, { url: mod.url })

  mod.stmts = sexps.map(L.parseStmt)
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
