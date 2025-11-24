import * as S from "@xieyuheng/sexp.js"
import fs from "node:fs"
import { createMod, type Mod } from "../mod/index.ts"
import { parseStmt } from "../parse/index.ts"
import { stage1 } from "./stage1.ts"

export function loadEntry(url: URL): Mod {
  return load(url)
}

export function load(url: URL): Mod {
  const text = loadText(url)
  const mod = createMod(url)

  const sexps = S.parseSexps(text, { url: mod.url })
  const stmts = sexps.map(parseStmt)

  for (const stmt of stmts) stage1(mod, stmt)

  return mod
}

function loadText(url: URL): string {
  if (url.protocol === "file:") {
    return fs.readFileSync(url.pathname, "utf8")
  }

  throw new Error(`[loadText] not supported protocol: ${url}`)
}
