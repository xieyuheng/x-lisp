import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import { importBuiltinMod } from "../../builtin/index.ts"
import * as L from "../index.ts"
import { stageDefine } from "./stageDefine.ts"
import { stageExport } from "./stageExport.ts"
import { stageImport } from "./stageImport.ts"

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
  for (const stmt of mod.stmts) stageDefine(mod, stmt)
  for (const stmt of mod.stmts) stageExport(mod, stmt)
  for (const stmt of mod.stmts) stageImport(mod, stmt)

  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
