import * as S from "@xieyuheng/sexp.js"
import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"
import { arrayConcat, arrayUnzip } from "@xieyuheng/std.js/array"

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

function explicateInBody(
  state: State,
  term: M.Term,
): [Array<B.Instr>, B.Cell] {
  switch (term.kind) {
    case "SymbolTerm": {
      const result = generateCell(state, "symbol")
      const instrs = [
        B.Instr([result], "symbol-value", [], {
          content: B.SymbolAttribute(term.content),
        }),
      ]
      return [instrs, result]
    }

    case "KeywordTerm": {
      const result = generateCell(state, "keyword")
      const instrs = [
        B.Instr([result], "keyword-value", [], {
          content: B.SymbolAttribute(term.content),
        }),
      ]
      return [instrs, result]
    }

    case "StringTerm": {
      const result = generateCell(state, "string")
      const instrs = [
        B.Instr([result], "string-value", [], {
          content: B.StringAttribute(term.content),
        }),
      ]
      return [instrs, result]
    }

    case "IntTerm": {
      const i64 = generateCell(state, "i64")
      const result = generateCell(state, "int")
      const instrs = [
        B.Instr([i64], "int64", [], {
          content: B.IntAttribute(term.content),
        }),
        B.Instr([result], "tag-int", [i64], {}),
      ]
      return [instrs, result]
    }

    case "FloatTerm": {
      const f64 = generateCell(state, "f64")
      const result = generateCell(state, "float")
      const instrs = [
        B.Instr([f64], "float64", [], {
          content: B.FloatAttribute(term.content),
        }),
        B.Instr([result], "tag-float", [f64], {}),
      ]
      return [instrs, result]
    }

    case "VarTerm": {
      return [[], generateCell(state, term.name)]
    }

    case "QualifiedVarTerm": {
      // TODO handle function
      const prefix = resolvePackageId(state.pkg, term.pkgName)
      const address = generateCell(state, "address")
      const result = generateCell(state, "const")
      const instrs = [
        B.Instr([address], "address", [], {
          name: B.SymbolAttribute(`${prefix}/${term.modName}/${term.name}`),
        }),
        B.Instr([result], "load", [address], {}),
      ]
      return [instrs, result]
    }

    case "ApplyTerm": {
      // TODO handle direct call
      const pairs = term.args.map((arg) => explicateInBody(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const [targetInstrs, target] = explicateInBody(state, term.target)
      const result = generateCell(state, "result")
      const instrs = [
        ...arrayConcat(argInstrGroups),
        ...targetInstrs,
        B.Instr([result], "apply", [target, ...args], {}),
      ]
      return [instrs, result]
    }

    default: {
      let message = `[ExplicateControlPass] [toBasicExp] unhandled term`
      message += `\n  term kind: ${term.kind}`
      message += `\n  term: ${M.formatTerm(term)}`
      throw new S.ErrorWithSourceLocation(message, term.location)
    }
  }
}

function resolvePackageId(pkg: M.Package, pkgName: string): string {
  if (pkgName === pkg.id) return pkg.id

  const dep = pkg.dependencies.get(pkgName)
  if (!dep) {
    throw new Error(`[resolvePackageId] unknown package: "${pkgName}"`)
  }
  return dep.id
}

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
