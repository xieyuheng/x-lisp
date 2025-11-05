import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { stringToSubscript } from "../../../helpers/string/stringToSubscript.ts"
import * as B from "../../backend/index.ts"
import type { Definition } from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"

export function ExplicateControlPass(mod: Mod): B.Mod {
  const backendMod = B.createMod(mod.url)
  for (const definition of mod.definitions.values()) {
    if (definition.kind === "FunctionDefinition") {
      onDefinition(backendMod, definition)
    }
  }

  return backendMod
}

type State = {
  fn: B.FunctionDefinition
}

function onDefinition(backendMod: B.Mod, definition: Definition): void {
  const fn = B.FunctionDefinition(definition.name, new Map())
  backendMod.definitions.set(definition.name, fn)
  const state = { fn }
  const instrs = inTail(state, definition.body)
  const block = B.Block("entry", instrs)
  addBlock(state, block)
}

function addBlock(state: State, block: B.Block): void {
  // B.checkBlockTerminator(block)
  state.fn.blocks.set(block.label, block)
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
): string {
  const subscript = stringToSubscript(state.fn.blocks.size.toString())
  const label = `${state.fn.name}/${name}${subscript}`
  const block = B.Block(label, instrs)
  addBlock(state, block)
  return label
}

function atomToValue(exp: Exp): B.Value {
  assert(Exps.isAtom(exp))
  return exp
}

function inTail(state: State, exp: Exp): Array<B.Instr> {
  switch (exp.kind) {
    case "Var": {
      return [B.Return([exp.name])]
    }

    default: {
      let message = `[inTail] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new X.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
