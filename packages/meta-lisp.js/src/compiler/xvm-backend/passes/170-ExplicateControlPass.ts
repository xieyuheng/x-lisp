import * as S from "@xieyuheng/sexp.js"
import { arrayConcat, arrayUnzip } from "@xieyuheng/std.js/array"
import { setUnion } from "@xieyuheng/std.js/set"
import * as B from "../../../basic/index.ts"
import * as C from "../../../core/index.ts"
import * as M from "../../../meta/index.ts"

export type ExplicateReport = {
  program: B.Program
  testNames: Set<string>
  variableNames: Set<string>
  primitiveFunctions: Map<string, number>
  primitiveVariables: Set<string>
}

export function ExplicateControlPass(pkg: M.Package): ExplicateReport {
  const basicProgram = B.createProgram()
  const testNames = new Set<string>()
  const variableNames = new Set<string>()
  const primitiveFunctions = new Map<string, number>()
  const primitiveVariables = new Set<string>()

  for (const orderedPkg of M.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.coreMods.values()) {
      for (const definition of mod.definitions.values()) {
        switch (definition.kind) {
          case "PrimitiveFunctionDeclaration": {
            primitiveFunctions.set(
              definitionQualifiedName(definition),
              definition.arity,
            )
            break
          }

          case "PrimitiveVariableDeclaration": {
            primitiveVariables.add(definitionQualifiedName(definition))
            break
          }

          case "FunctionDefinition": {
            const usedNames = setUnion(
              C.termOccurredNames(definition.body),
              new Set(definition.parameters),
            )
            const state = createState(definition.mod.pkg, usedNames)
            const block = B.Block("body", [])
            addBlock(state, block)

            const argumentInstrs = definition.parameters.map((name, i) =>
              B.Instr("argument", [B.Cell(name)], [], {
                index: B.IntAttribute(BigInt(i)),
              }),
            )
            block.instrs = [
              ...argumentInstrs,
              ...explicateInTail(state, definition.body),
            ]

            basicProgram.definitions.set(
              definitionQualifiedName(definition),
              B.FunctionDefinition(
                definitionQualifiedName(definition),
                definition.parameters,
                state.blocks,
              ),
            )
            break
          }

          case "TestDefinition": {
            const qname = definitionQualifiedName(definition)
            testNames.add(qname)

            const usedNames = C.termOccurredNames(definition.body)
            const state = createState(definition.mod.pkg, usedNames)
            const block = B.Block("body", [])
            addBlock(state, block)
            block.instrs = explicateInTail(state, definition.body)

            basicProgram.definitions.set(
              qname,
              B.FunctionDefinition(qname, [], state.blocks),
            )
            break
          }

          case "VariableDefinition": {
            const qname = definitionQualifiedName(definition)
            variableNames.add(qname)

            const usedNames = C.termOccurredNames(definition.body)
            const state = createState(definition.mod.pkg, usedNames)
            const block = B.Block("body", [])
            addBlock(state, block)
            block.instrs = explicateInTail(state, definition.body)

            basicProgram.definitions.set(
              qname,
              B.FunctionDefinition(qname, [], state.blocks),
            )
            break
          }
        }
      }
    }
  }

  return {
    program: basicProgram,
    testNames,
    variableNames,
    primitiveFunctions,
    primitiveVariables,
  }
}

function definitionQualifiedName(definition: C.Definition): string {
  return `${definition.mod.pkg.id}/${definition.mod.name}/${definition.name}`
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
  term: C.Term,
): [Array<B.Instr>, B.Cell] {
  switch (term.kind) {
    case "SymbolTerm": {
      const value = generateCell(state, "symbol")
      const instrs = [
        B.Instr("symbol", [value], [], {
          content: B.SymbolAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "StringTerm": {
      const value = generateCell(state, "text")
      const instrs = [
        B.Instr("text", [value], [], {
          content: B.StringAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "IntTerm": {
      const value = generateCell(state, "int")
      const instrs = [
        B.Instr("int", [value], [], {
          content: B.IntAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "FloatTerm": {
      const value = generateCell(state, "float")
      const instrs = [
        B.Instr("float", [value], [], {
          content: B.FloatAttribute(term.content),
        }),
      ]
      return [instrs, value]
    }

    case "VarTerm": {
      return [[], B.Cell(term.name)]
    }

    case "QualifiedVarTerm": {
      const definition = M.packageLookupCoreDefinition(
        state.pkg,
        term.pkgName,
        term.modName,
        term.name,
      )
      if (definition === undefined) {
        let message = `[explicateUnnestedTerm/QualifiedVarTerm] undefined qualified variable`
        message += `\n  from package: ${state.pkg.rootDirectory}`
        message += `\n  qualified name: ${term.pkgName}/${term.modName}/${term.name}`
        throw new S.ErrorWithSourceLocation(message, term.location)
      }

      const prefix = resolvePackageId(state.pkg, term.pkgName)
      const qualifiedName = `${prefix}/${term.modName}/${term.name}`

      if (
        definition.kind === "PrimitiveVariableDeclaration" ||
        definition.kind === "VariableDefinition"
      ) {
        const value = generateCell(state, "value")
        const instrs = [
          B.Instr("global-load", [value], [], {
            name: B.SymbolAttribute(qualifiedName),
          }),
        ]
        return [instrs, value]
      }

      const value = generateCell(state, "ref")
      const instrs = [
        B.Instr("ref", [value], [], {
          name: B.SymbolAttribute(qualifiedName),
        }),
      ]
      return [instrs, value]
    }

    case "ClosureTerm": {
      const { pkgName, modName, name: funcName, args: freeVarTerms } = term
      const prefix = resolvePackageId(state.pkg, pkgName)
      const qualifiedFuncName = `${prefix}/${modName}/${funcName}`

      const pairs = freeVarTerms.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, freeVarCells] = arrayUnzip(pairs)

      const funcRef = generateCell(state, "func-ref")
      const size = generateCell(state, "size")
      const closure = generateCell(state, "closure")

      const instrs = [
        ...arrayConcat(argInstrGroups),
        B.Instr("ref", [funcRef], [], {
          name: B.SymbolAttribute(qualifiedFuncName),
        }),
        B.Instr("int", [size], [], {
          content: B.IntAttribute(BigInt(freeVarCells.length)),
        }),
        B.Instr("call", [closure], [funcRef, size], {
          name: B.SymbolAttribute("meta-builtin/builtin/make-closure"),
        }),
      ]

      let current = closure
      for (let i = 0; i < freeVarCells.length; i++) {
        const index = generateCell(state, "index")
        const next = generateCell(state, "closure")
        instrs.push(
          B.Instr("int", [index], [], {
            content: B.IntAttribute(BigInt(i)),
          }),
          B.Instr("call", [next], [index, freeVarCells[i], current], {
            name: B.SymbolAttribute("meta-builtin/builtin/closure-put-arg"),
          }),
        )
        current = next
      }

      return [instrs, current]
    }

    case "ApplyTerm": {
      const pairs = term.args.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const direct = tryResolveDirectCall(state, term.target)
      if (direct) {
        const op = INT_ARITH_OPS[direct.qualifiedName]
        if (op) {
          const value = generateCell(state, "value")
          const instrs = [
            ...arrayConcat(argInstrGroups),
            B.Instr(op, [value], args, {}),
          ]
          return [instrs, value]
        }

        const value = generateCell(state, "value")
        const instrs = [
          ...arrayConcat(argInstrGroups),
          B.Instr("call", [value], args, {
            name: B.SymbolAttribute(direct.qualifiedName),
          }),
        ]
        return [instrs, value]
      }

      const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
      const value = generateCell(state, "value")
      const instrs = [
        ...targetInstrs,
        ...arrayConcat(argInstrGroups),
        B.Instr("apply", [value], [target, ...args], {}),
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

const INT_ARITH_OPS: Record<string, string> = {
  "meta-builtin/builtin/iadd": "iadd",
  "meta-builtin/builtin/isub": "isub",
  "meta-builtin/builtin/imul": "imul",
  "meta-builtin/builtin/idiv": "idiv",
  "meta-builtin/builtin/imod": "imod",
  "meta-builtin/builtin/ineg": "ineg",
  "meta-builtin/builtin/int-greater": "int-greater",
  "meta-builtin/builtin/int-less": "int-less",
  "meta-builtin/builtin/int-greater-or-equal": "int-greater-or-equal",
  "meta-builtin/builtin/int-less-or-equal": "int-less-or-equal",
  "meta-builtin/builtin/int-is-positive": "int-is-positive",
  "meta-builtin/builtin/int-is-non-negative": "int-is-non-negative",
  "meta-builtin/builtin/int-is-non-zero": "int-is-non-zero",
  "meta-builtin/内置/整数加": "iadd",
  "meta-builtin/内置/整数减": "isub",
  "meta-builtin/内置/整数乘": "imul",
  "meta-builtin/内置/整数除": "idiv",
  "meta-builtin/内置/整数模": "imod",
  "meta-builtin/内置/整数负": "ineg",
  "meta-builtin/内置/整数大于": "int-greater",
  "meta-builtin/内置/整数小于": "int-less",
  "meta-builtin/内置/整数大于等于": "int-greater-or-equal",
  "meta-builtin/内置/整数小于等于": "int-less-or-equal",
  "meta-builtin/内置/整数为正": "int-is-positive",
  "meta-builtin/内置/整数非负": "int-is-non-negative",
  "meta-builtin/内置/整数非零": "int-is-non-zero",
}

function tryResolveDirectCall(
  state: State,
  target: C.Term,
): { qualifiedName: string } | undefined {
  if (target.kind !== "QualifiedVarTerm") return undefined

  const definition = M.packageLookupCoreDefinition(
    state.pkg,
    target.pkgName,
    target.modName,
    target.name,
  )

  if (definition === undefined) {
    let message = `[tryResolveDirectCall] undefined qualified variable`
    message += `\n  from package: ${state.pkg.rootDirectory}`
    message += `\n  qualified name: ${target.pkgName}/${target.modName}/${target.name}`
    throw new S.ErrorWithSourceLocation(message, target.location)
  }

  if (
    definition.kind === "PrimitiveFunctionDeclaration" ||
    definition.kind === "FunctionDefinition" ||
    definition.kind === "TestDefinition"
  ) {
    const prefix = resolvePackageId(state.pkg, target.pkgName)
    return {
      qualifiedName: `${prefix}/${target.modName}/${target.name}`,
    }
  }

  return undefined
}

function explicateInTail(state: State, term: C.Term): Array<B.Instr> {
  if (!C.isAtomOperandTerm(term)) {
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
      const pairs = term.args.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const direct = tryResolveDirectCall(state, term.target)
      if (direct) {
        return [
          ...arrayConcat(argInstrGroups),
          B.Instr("tail-call", [], args, {
            name: B.SymbolAttribute(direct.qualifiedName),
          }),
        ]
      }

      const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
      return [
        ...targetInstrs,
        ...arrayConcat(argInstrGroups),
        B.Instr("tail-apply", [], [target, ...args], {}),
      ]
    }

    default: {
      const [instrs, cell] = explicateUnnestedTerm(state, term)
      return [...instrs, B.Instr("return", [], [cell], {})]
    }
  }
}

function explicateInLet1(
  state: State,
  name: string,
  rhs: C.Term,
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
      }

      state.useSites.add(name)
      const gotoBody = B.Instr("goto", [], [], {
        label: B.SymbolAttribute(
          generateLabel(state, "let-body", [
            B.Instr("use", [B.Cell(name)], [], {}),
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

    default: {
      const [rhsInstrs, rhsCell] = explicateUnnestedTerm(state, rhs)
      if (state.useSites.has(name)) {
        return [
          ...rhsInstrs,
          B.Instr("provide", [], [rhsCell], {
            "use-site": B.SymbolAttribute(name),
          }),
          ...restInstrs,
        ]
      }

      return [
        ...rhsInstrs,
        B.Instr("copy", [B.Cell(name)], [rhsCell], {}),
        ...restInstrs,
      ]
    }
  }
}

function explicateInBegin1(
  state: State,
  head: C.Term,
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
      const [headInstrs] = explicateUnnestedTerm(state, head)
      return [...headInstrs, ...restInstrs]
    }
  }
}

function explicateInIf(
  state: State,
  condition: C.Term,
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
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "内置" &&
    condition.name === "真"
  ) {
    return thenInstrs
  }

  if (
    condition.kind === "QualifiedVarTerm" &&
    condition.modName === "内置" &&
    condition.name === "假"
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
      return [
        B.Instr("branch", [], [conditionCell], {
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
      return [
        ...conditionInstrs,
        B.Instr("branch", [], [conditionCell], {
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
      message += `\n  condition: ${C.formatTerm(condition)}`
      throw new S.ErrorWithSourceLocation(message, condition.location)
    }
  }
}
