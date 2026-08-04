import * as S from "@xieyuheng/sexp.js"
import { type Definition } from "../definition/Definition.ts"
import * as M from "../../meta/index.ts"

export type Mod = {
  name: string
  definitions: Map<string, Definition>
  pkg: M.Package
}

export function createMod(name: string, pkg: M.Package): Mod {
  return {
    name,
    definitions: new Map(),
    pkg,
  }
}

export function modDefine(
  mod: Mod,
  name: string,
  definition: Definition,
): void {
  if (mod.definitions.has(name)) {
    let message = `[modDefine] name already defined`
    message += `\n  name: ${name}`
    throw new S.ErrorWithSourceLocation(message, definition.location)
  }

  mod.definitions.set(name, definition)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}
