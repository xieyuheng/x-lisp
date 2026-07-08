import * as S from "@xieyuheng/sexp.js"
import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass2(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateDefinition(
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

function explicateDefinition(
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
      const usedNames = M.termOccurredNames(definition.body)
      const state = createState(definition.mod.pkg, usedNames)
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = explicateInTail(state, definition.body)
      return [
        B.FunctionDefinition(definitionQualifiedName(definition), state.blocks),
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
  usedNames: Set<string>
  blocks: Map<string, B.Block>
}

function createState(pkg: M.Package, usedNames: Set<string>): State {
  return { pkg, usedNames, blocks: new Map() }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function generateCell(state: State, name: string): B.Cell {
  const id = M.generateRelativeFreshName(state.usedNames, name)
  state.usedNames.add(id)
  return B.Cell(id)
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

// function explicateSimpleTerm(state: State, term: M.Term): [Array<B.Instr>, B.Cell] {
//   switch (term.kind) {
//     case "SymbolTerm": {
//       const cell = generateCell("symbol")
//       return [B.Instr(term.content, term.location)]
//     }

//     case "KeywordTerm": {
//       return B.KeywordExp(term.content, term.location)
//     }

//     case "StringTerm": {
//       return B.StringExp(term.content, term.location)
//     }

//     case "IntTerm": {
//       return B.IntExp(term.content, term.location)
//     }

//     case "FloatTerm": {
//       return B.FloatExp(term.content, term.location)
//     }

//     case "VarTerm": {
//       return B.VarExp(term.name, term.location)
//     }

//     case "QualifiedVarTerm": {
//       const prefix = resolvePackageId(pkg, term.pkgName)
//       return B.VarExp(`${prefix}/${term.modName}/${term.name}`, term.location)
//     }

//     case "ApplyTerm": {
//       return B.ApplyExp(
//         toBasicExp(term.target, pkg),
//         term.args.map((arg) => toBasicExp(arg, pkg)),
//         term.location,
//       )
//     }

//     default: {
//       let message = `[ExplicateControlPass] [toBasicExp] unhandled term`
//       message += `\n  term kind: ${term.kind}`
//       message += `\n  term: ${M.formatTerm(term)}`
//       throw new S.ErrorWithSourceLocation(message, term.location)
//     }
//   }
// }

function explicateInTail(state: State, term: M.Term): Array<B.Instr> {
  if (!M.isAtomOperandTerm(term)) {
    let message = `[explicateInTail] expect AtomOperandTerm`
    throw new S.ErrorWithSourceLocation(message, term.location)
  }

  return []

  // switch (term.kind) {
  //   case "Let1Term": {
  //     return explicateInLet1(
  //       state,
  //       term.name,
  //       term.rhs,
  //       explicateInTail(state, term.body),
  //     )
  //   }

  //   case "Begin1Term": {
  //     return explicateInBegin1(
  //       state,
  //       term.head,
  //       explicateInTail(state, term.body),
  //     )
  //   }

  //   case "IfTerm": {
  //     return explicateInIf(
  //       state,
  //       term.condition,
  //       explicateInTail(state, term.consequent),
  //       explicateInTail(state, term.alternative),
  //     )
  //   }

  //   default: {
  //     return [B.ReturnInstr(toBasicExp(term, state.pkg), term.location)]
  //   }
  // }
}
