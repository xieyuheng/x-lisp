import * as S from "@xieyuheng/sexp.js"
import { arrayConcat, arrayUnzip } from "@xieyuheng/std.js/array"
import * as B from "../../basic2/index.ts"
import * as M from "../index.ts"

export function ExplicateControlPass2(pkg: M.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.mods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateDefinition(definition)) {
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

function explicateDefinition(definition: M.Definition): Array<B.Definition> {
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
  useSites: Set<string>
  blocks: Map<string, B.Block>
}

function createState(pkg: M.Package, usedNames: Set<string>): State {
  return {
    pkg,
    usedNames,
    useSites: new Set(),
    blocks: new Map(),
  }
}

function addBlock(state: State, block: B.Block): void {
  state.blocks.set(block.label, block)
}

function generateCell(state: State, name: string): B.Cell {
  state.usedNames.add(name)
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

function explicateUnnestedTerm(
  state: State,
  term: M.Term,
): [Array<B.Instr>, B.Cell] {
  switch (term.kind) {
    case "SymbolTerm": {
      const value = generateCell(state, "symbol")
      const instrs = [
        B.Instr("symbol-value", [], [value], {
          content: B.SymbolAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "KeywordTerm": {
      const value = generateCell(state, "keyword")
      const instrs = [
        B.Instr("keyword-value", [], [value], {
          content: B.SymbolAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "StringTerm": {
      const value = generateCell(state, "string")
      const instrs = [
        B.Instr("string-value", [], [value], {
          content: B.StringAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "IntTerm": {
      const i64 = generateCell(state, "i64")
      const value = generateCell(state, "int")
      const instrs = [
        B.Instr("int64", [], [i64], {
          content: B.IntAttribute(term.content),
        }),
        B.Instr("tag-int", [i64], [value], {}),
      ]
      return [instrs, value]
    }

    case "FloatTerm": {
      const f64 = generateCell(state, "f64")
      const value = generateCell(state, "float")
      const instrs = [
        B.Instr("float64", [], [f64], {
          content: B.FloatAttribute(term.content),
        }),
        B.Instr("tag-float", [f64], [value], {}),
      ]
      return [instrs, value]
    }

    case "VarTerm": {
      return [[], B.Cell(term.name)]
    }

    case "QualifiedVarTerm": {
      const definition = M.packageLookupDefinition(
        state.pkg,
        term.pkgName,
        term.modName,
        term.name,
      )
      if (definition === undefined) {
        let message = `[explicateUnnestedTerm] undefined qualified variable`
        message += `\n  from package: ${state.pkg.rootDirectory}`
        message += `\n  qualified name: ${term.pkgName}/${term.modName}/${term.name}`
        throw new S.ErrorWithSourceLocation(message, term.location)
      }

      if (
        definition.kind === "PrimitiveVariableDeclaration" ||
        definition.kind === "VariableDefinition"
      ) {
        const prefix = resolvePackageId(state.pkg, term.pkgName)
        const address = generateCell(state, "address")
        const value = generateCell(state, "const")
        const instrs = [
          B.Instr("address", [], [address], {
            name: B.SymbolAttribute(`${prefix}/${term.modName}/${term.name}`),
          }),
          B.Instr("load", [address], [value], {
            type: B.TypeAttribute(B.ValueType()),
          }),
        ]
        return [instrs, value]
      }

      if (
        definition.kind === "PrimitiveFunctionDeclaration" ||
        definition.kind === "FunctionDefinition" ||
        definition.kind === "TestDefinition"
      ) {
        const prefix = resolvePackageId(state.pkg, term.pkgName)
        const value = generateCell(state, "fn")
        const instrs = [
          B.Instr("function-value", [], [value], {
            name: B.SymbolAttribute(`${prefix}/${term.modName}/${term.name}`),
            arity: B.IntAttribute(BigInt(M.definitionArity(definition))),
          }),
        ]
        return [instrs, value]
      }

      let message = `[explicateUnnestedTerm] unhandled definition`
      throw new S.ErrorWithSourceLocation(message, definition.location)
    }

    case "ApplyTerm": {
      // TODO handle direct call
      const pairs = term.args.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
      const value = generateCell(state, "value")
      const instrs = [
        ...arrayConcat(argInstrGroups),
        ...targetInstrs,
        B.Instr("apply", [target, ...args], [value], {}),
      ]
      return [instrs, value]
    }

    default: {
      let message = `[explicateUnnestedTerm] unhandled term`
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

  switch (term.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        term.name,
        term.rhs,
        explicateInTail(state, term.body),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        term.head,
        explicateInTail(state, term.body),
      )
    }

    case "IfTerm": {
      return explicateInIf(
        state,
        term.condition,
        explicateInTail(state, term.consequent),
        explicateInTail(state, term.alternative),
      )
    }

    case "ApplyTerm": {
      // TODO handle direct call
      const pairs = term.args.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
      const instrs = [
        ...arrayConcat(argInstrGroups),
        ...targetInstrs,
        B.Instr("tail-apply", [target, ...args], [], {}),
      ]
      return instrs
    }

    default: {
      const [instrs, cell] = explicateUnnestedTerm(state, term)
      return [...instrs, B.Instr("return", [cell], [], {})]
    }
  }
}

function explicateInLet1(
  state: State,
  name: string,
  rhs: M.Term,
  restInstrs: Array<B.Instr>,
): Array<B.Instr> {
  switch (rhs.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        rhs.name,
        rhs.rhs,
        explicateInLet1(state, name, rhs.body, restInstrs),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        rhs.head,
        explicateInLet1(state, name, rhs.body, restInstrs),
      )
    }

    case "IfTerm": {
      if (state.useSites.has(name)) {
        const gotoBody = B.Instr("goto", [], [], {
          label: B.SymbolAttribute(
            generateLabel(state, "let-body", restInstrs),
          ),
        })
        return explicateInIf(
          state,
          rhs.condition,
          explicateInLet1(state, name, rhs.consequent, [gotoBody]),
          explicateInLet1(state, name, rhs.alternative, [gotoBody]),
        )
      } else {
        state.useSites.add(name)
        const gotoBody = B.Instr("goto", [], [], {
          label: B.SymbolAttribute(
            generateLabel(state, "let-body", [
              B.Instr("use", [], [B.Cell(name)], {}),
              ...restInstrs,
            ]),
          ),
        })
        return explicateInIf(
          state,
          rhs.condition,
          explicateInLet1(state, name, rhs.consequent, [gotoBody]),
          explicateInLet1(state, name, rhs.alternative, [gotoBody]),
        )
      }
    }

    default: {
      const [rhsInstrs, rhsCell] = explicateUnnestedTerm(state, rhs)
      if (state.useSites.has(name)) {
        return [
          ...rhsInstrs,
          B.Instr("provide", [rhsCell], [], {
            "use-site": B.SymbolAttribute(name),
          }),
          ...restInstrs,
        ]
      } else {
        return [
          ...rhsInstrs,
          B.Instr("copy", [rhsCell], [B.Cell(name)], {}),
          ...restInstrs,
        ]
      }
    }
  }
}

function explicateInBegin1(
  state: State,
  head: M.Term,
  restInstrs: Array<B.Instr>,
): Array<B.Instr> {
  switch (head.kind) {
    case "Let1Term": {
      return explicateInLet1(
        state,
        head.name,
        head.rhs,
        explicateInBegin1(state, head.body, restInstrs),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        head.head,
        explicateInBegin1(state, head.body, restInstrs),
      )
    }

    case "IfTerm": {
      const gotoBody = B.Instr("goto", [], [], {
        label: B.SymbolAttribute(
          generateLabel(state, "begin-body", restInstrs),
        ),
      })
      return explicateInIf(
        state,
        head.condition,
        explicateInBegin1(state, head.consequent, [gotoBody]),
        explicateInBegin1(state, head.alternative, [gotoBody]),
      )
    }

    default: {
      const [headInstrs, headCell] = explicateUnnestedTerm(state, head)
      return [...headInstrs, ...restInstrs]
    }
  }
}

function explicateInIf(
  state: State,
  condition: M.Term,
  thenInstrs: Array<B.Instr>,
  elseInstrs: Array<B.Instr>,
): Array<B.Instr> {
  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "builtin" &&
    condition.name === "true"
  ) {
    return thenInstrs
  }

  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "builtin" &&
    condition.name === "false"
  ) {
    return elseInstrs
  }

  if (
    condition.kind === "ApplyTerm" &&
    condition.target.kind === "VarTerm" &&
    condition.target.name === "not" &&
    condition.args.length === 1
  ) {
    const [negatedCondition] = condition.args
    return explicateInIf(state, negatedCondition, elseInstrs, thenInstrs)
  }

  switch (condition.kind) {
    case "VarTerm": {
      const conditionCell = B.Cell(condition.name)
      const bool = generateCell(state, "bool")
      return [
        B.Instr("to-bool", [conditionCell], [bool], {}),
        B.Instr("branch", [bool], [], {
          "then-label": B.SymbolAttribute(
            generateLabel(state, "then", thenInstrs),
          ),
          "else-label": B.SymbolAttribute(
            generateLabel(state, "else", elseInstrs),
          ),
        }),
      ]
    }

    case "ApplyTerm": {
      const [conditionInstrs, conditionCell] = explicateUnnestedTerm(
        state,
        condition,
      )
      const bool = generateCell(state, "bool")
      return [
        ...conditionInstrs,
        B.Instr("to-bool", [conditionCell], [bool], {}),
        B.Instr("branch", [bool], [], {
          "then-label": B.SymbolAttribute(
            generateLabel(state, "then", thenInstrs),
          ),
          "else-label": B.SymbolAttribute(
            generateLabel(state, "else", elseInstrs),
          ),
        }),
      ]
    }

    case "Let1Term": {
      return explicateInLet1(
        state,
        condition.name,
        condition.rhs,
        explicateInIf(state, condition.body, thenInstrs, elseInstrs),
      )
    }

    case "Begin1Term": {
      return explicateInBegin1(
        state,
        condition.head,
        explicateInIf(state, condition.body, thenInstrs, elseInstrs),
      )
    }

    case "IfTerm": {
      const gotoThen = B.Instr("goto", [], [], {
        label: B.SymbolAttribute(generateLabel(state, "then", thenInstrs)),
      })
      const gotoElse = B.Instr("goto", [], [], {
        label: B.SymbolAttribute(generateLabel(state, "else", elseInstrs)),
      })
      return explicateInIf(
        state,
        condition.condition,
        explicateInIf(state, condition.consequent, [gotoThen], [gotoElse]),
        explicateInIf(state, condition.alternative, [gotoThen], [gotoElse]),
      )
    }

    default: {
      let message = `[explicateInIf] unhandled condition`
      message += `\n  condition: ${M.formatTerm(condition)}`
      throw new S.ErrorWithSourceLocation(message, condition.location)
    }
  }
}
