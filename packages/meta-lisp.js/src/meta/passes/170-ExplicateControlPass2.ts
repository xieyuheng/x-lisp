import * as S from "@xieyuheng/sexp.js"
import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass2(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateControlDefinition(
          basicMod,
          definition,
        )) {
          basicMod.definitions.set(basicDefinition.name, basicDefinition)
        }
      }
    }
  }

  return basicMod
}

function definitionQualifiedName(definition: M.Definition): string {
  return `${definition.mod.pkg.id}/${definition.mod.name}/${definition.name}`
}

function explicateControlDefinition(
  basicMod: B.Mod,
  definition: M.Definition,
): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [B.ExternFunctionDefinition(definitionQualifiedName(definition))]
    }

    case "PrimitiveVariableDeclaration": {
      return [B.ExternVariableDefinition(definitionQualifiedName(definition))]
    }

    // - do not generate code for type.
    case "AlgebraicTypeDefinition":
    case "OpaqueTypeDefinition":
    case "TypeDefinition": {
      return []
    }

    case "FunctionDefinition": {
      const state = createState(definition.mod.pkg)
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = explicateControlInTail(state, definition.body)
      return [
        B.FunctionDefinition(
          definitionQualifiedName(definition),
          state.blocks,
        ),
      ]
    }

    case "TestDefinition": {
      return []
    }

    case "VariableDefinition": {
      return []
    }
  }
}

type State = {
  pkg: M.Package
  blocks: Map<string, B.Block>
}

function createState(pkg: M.Package): State {
  return { pkg, blocks: new Map() }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function generateLabel(
  state: State,
  name: string,
  instrs: Array<B.Instr>,
): string {
  const label = `${name}.${state.blocks.size}`
  const block = B.Block(label, instrs)
  addBlock(state, block)
  return label
}

function explicateControlInTail(state: State, term: M.Term): Array<B.Instr> {
  if (!M.isAtomOperandTerm(term)) {
    let message = `[explicateControlInTail] expect AtomOperandTerm`
    throw new S.ErrorWithSourceLocation(message, term.location)
  }

  return []

  // switch (term.kind) {
  //   case "Let1Term": {
  //     return explicateControlInLet1(
  //       state,
  //       term.name,
  //       term.rhs,
  //       explicateControlInTail(state, term.body),
  //     )
  //   }

  //   case "Begin1Term": {
  //     return explicateControlInBegin1(
  //       state,
  //       term.head,
  //       explicateControlInTail(state, term.body),
  //     )
  //   }

  //   case "IfTerm": {
  //     return explicateControlInIf(
  //       state,
  //       term.condition,
  //       explicateControlInTail(state, term.consequent),
  //       explicateControlInTail(state, term.alternative),
  //     )
  //   }

  //   default: {
  //     return [B.ReturnInstr(toBasicExp(term, state.pkg), term.location)]
  //   }
  // }
}
