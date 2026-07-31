import * as S from "@xieyuheng/sexp.js"
import { arrayConcat, arrayUnzip } from "@xieyuheng/std.js/array"
import { setUnion } from "@xieyuheng/std.js/set"
import * as B from "../basic/index.ts"
import * as C from "../core/index.ts"
import * as M from "../meta/index.ts"
import * as Pkg from "../package/index.ts"

export function ExplicateControlPass2(pkg: Pkg.Package): B.Mod {
  const basicMod = B.createMod()

  for (const orderedPkg of Pkg.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.coreMods.values()) {
      for (const definition of mod.definitions.values()) {
        for (const basicDefinition of explicateDefinition(definition)) {
          basicMod.definitions.set(basicDefinition.name, basicDefinition)
        }
      }
    }
  }

  const variableNames: Array<string> = []
  const testNames: Array<string> = []

  for (const orderedPkg of Pkg.packageClosureInTopologicalOrder(pkg)) {
    for (const mod of orderedPkg.coreMods.values()) {
      for (const definition of mod.definitions.values()) {
        if (definition.kind === "VariableDefinition") {
          variableNames.push(definitionQualifiedName(definition))
        }

        if (definition.kind === "TestDefinition") {
          testNames.push(definitionQualifiedName(definition))
        }
      }
    }
  }

  const setupDefinition = generateSetupVariables(pkg, variableNames)
  basicMod.definitions.set(setupDefinition.name, setupDefinition)

  const runTestsDefinition = generateRunTests(pkg, testNames)
  basicMod.definitions.set(runTestsDefinition.name, runTestsDefinition)

  return basicMod
}

function definitionQualifiedName(definition: C.Definition): string {
  return `${definition.mod.pkg.id}/${definition.mod.name}/${definition.name}`
}

function explicateDefinition(definition: C.Definition): Array<B.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      return [B.ExternFunctionDefinition(definitionQualifiedName(definition))]
    }

    case "PrimitiveVariableDeclaration": {
      return [B.ExternVariableDefinition(definitionQualifiedName(definition))]
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
        B.Instr("argument", [], [B.Cell(name)], {
          index: B.IntAttribute(BigInt(i)),
        }),
      )
      block.instrs = [
        ...argumentInstrs,
        ...explicateInTail(state, definition.body),
      ]

      return [
        B.FunctionDefinition(definitionQualifiedName(definition), state.blocks),
      ]
    }

    case "TestDefinition": {
      const usedNames = C.termOccurredNames(definition.body)
      const state = createState(definition.mod.pkg, usedNames)
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = explicateInTail(state, definition.body)

      return [
        B.FunctionDefinition(definitionQualifiedName(definition), state.blocks),
      ]
    }

    case "VariableDefinition": {
      const usedNames = C.termOccurredNames(definition.body)
      const state = createState(definition.mod.pkg, usedNames)
      const block = B.Block("body", [])
      addBlock(state, block)
      block.instrs = explicateInTail(state, definition.body)

      const qualifiedName = definitionQualifiedName(definition)
      return [
        B.VariableDefinition(qualifiedName, null),
        B.FunctionDefinition(`©setup.${qualifiedName}`, state.blocks),
      ]
    }
  }
}

function generateSetupVariables(
  pkg: Pkg.Package,
  variableNames: Array<string>,
): B.FunctionDefinition {
  const state = createState(pkg, new Set())
  const block = B.Block("body", [])
  addBlock(state, block)

  const instrs: Array<B.Instr> = []

  for (const qualifiedName of variableNames) {
    const setupAddress = generateCell(state, "setup")
    const result = generateCell(state, "result")
    const variableAddress = generateCell(state, "variable")

    instrs.push(
      B.Instr("address", [], [setupAddress], {
        name: B.SymbolAttribute(`©setup.${qualifiedName}`),
      }),
      B.Instr("call", [setupAddress], [result], {}),
      B.Instr("address", [], [variableAddress], {
        name: B.SymbolAttribute(qualifiedName),
      }),
      B.Instr("store", [variableAddress, result], [], {}),
    )
  }

  instrs.push(B.Instr("return", [], [], {}))
  block.instrs = instrs

  return B.FunctionDefinition("©setup-variables", state.blocks)
}

function generateRunTests(
  pkg: Pkg.Package,
  testNames: Array<string>,
): B.FunctionDefinition {
  const state = createState(pkg, new Set())
  const block = B.Block("body", [])
  addBlock(state, block)

  const instrs: Array<B.Instr> = []

  for (const qualifiedName of testNames) {
    const test = generateCell(state, "test")
    const result = generateCell(state, "result")

    instrs.push(
      B.Instr("address", [], [test], {
        name: B.SymbolAttribute(qualifiedName),
      }),
      B.Instr("call", [test], [result], {}),
    )
  }

  instrs.push(B.Instr("return", [], [], {}))
  block.instrs = instrs

  return B.FunctionDefinition("©run-tests", state.blocks)
}

type State = {
  pkg: Pkg.Package
  usedNames: Set<string>
  useSites: Set<string>
  blocks: Map<string, B.Block>
}

function createState(pkg: Pkg.Package, usedNames: Set<string>): State {
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
      const definition = Pkg.packageLookupCoreDefinition(
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

      let message = `[explicateUnnestedTerm] unhandled definition`
      throw new Error(message)
    }

    case "ClosureTerm": {
      const { pkgName, modName, name: funcName, args: freeVarTerms } = term
      const prefix = resolvePackageId(state.pkg, pkgName)
      const qualifiedFuncName = `${prefix}/${modName}/${funcName}`

      const pairs = freeVarTerms.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, freeVarCells] = arrayUnzip(pairs)

      const functionAddress = generateCell(state, "function-address")
      const size = generateCell(state, "closure-size")
      const makeClosureAddress = generateCell(state, "make-closure-address")
      const closure = generateCell(state, "closure")

      const instrs = [
        ...arrayConcat(argInstrGroups),
        B.Instr("address", [], [functionAddress], {
          name: B.SymbolAttribute(qualifiedFuncName),
        }),
        B.Instr("int64", [], [size], {
          content: B.IntAttribute(BigInt(freeVarCells.length)),
        }),
        B.Instr("address", [], [makeClosureAddress], {
          name: B.SymbolAttribute("meta-builtin/builtin/make-closure"),
        }),
        B.Instr(
          "call",
          [makeClosureAddress, functionAddress, size],
          [closure],
          {},
        ),
      ]

      let current = closure
      for (let i = 0; i < freeVarCells.length; i++) {
        const putArgAddress = generateCell(state, "put-arg-address")
        const index = generateCell(state, "index")
        const next = generateCell(state, "closure")
        instrs.push(
          B.Instr("address", [], [putArgAddress], {
            name: B.SymbolAttribute("meta-builtin/builtin/closure-put-arg"),
          }),
          B.Instr("int64", [], [index], {
            content: B.IntAttribute(BigInt(i)),
          }),
          B.Instr(
            "call",
            [putArgAddress, index, freeVarCells[i], current],
            [next],
            {},
          ),
        )
        current = next
      }

      return [instrs, current]
    }

    case "ApplyTerm": {
      const pairs = term.args.map((arg) => explicateUnnestedTerm(state, arg))
      const [argInstrGroups, args] = arrayUnzip(pairs)
      const direct = tryResolveDirectCall(state, term.target, term.args.length)
      if (direct) {
        const address = generateCell(state, "address")
        const value = generateCell(state, "value")
        const instrs = [
          B.Instr("address", [], [address], {
            name: B.SymbolAttribute(direct.qualifiedName),
          }),
          ...arrayConcat(argInstrGroups),
          B.Instr("call", [address, ...args], [value], {}),
        ]
        return [instrs, value]
      } else {
        const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
        const fnGetter = generateCell(state, "fn-getter")
        const fn = generateCell(state, "fn")
        const value = generateCell(state, "value")
        const instrs = [
          ...targetInstrs,
          B.Instr("address", [], [fnGetter], {
            name: B.SymbolAttribute("meta-builtin/builtin/closure-fn"),
          }),
          B.Instr("call", [fnGetter, target], [fn], {}),
          ...arrayConcat(argInstrGroups),
          B.Instr("call", [fn, target, ...args], [value], {}),
        ]
        return [instrs, value]
      }
    }

    default: {
      let message = `[explicateUnnestedTerm] unhandled term`
      throw new S.ErrorWithSourceLocation(message, term.location)
    }
  }
}

function resolvePackageId(pkg: Pkg.Package, pkgName: string): string {
  if (pkgName === pkg.id) return pkg.id

  const dep = pkg.dependencies.get(pkgName)
  if (!dep) {
    throw new Error(`[resolvePackageId] unknown package: "${pkgName}"`)
  }
  return dep.id
}

function tryResolveDirectCall(
  state: State,
  target: C.Term,
  argCount: number,
): { qualifiedName: string } | undefined {
  if (target.kind !== "QualifiedVarTerm") return undefined

  const definition = Pkg.packageLookupCoreDefinition(
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
    (definition.kind === "PrimitiveFunctionDeclaration" ||
      definition.kind === "FunctionDefinition" ||
      definition.kind === "TestDefinition") &&
    C.definitionArity(definition) === argCount
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
      const direct = tryResolveDirectCall(state, term.target, term.args.length)
      if (direct) {
        const address = generateCell(state, "address")
        return [
          B.Instr("address", [], [address], {
            name: B.SymbolAttribute(direct.qualifiedName),
          }),
          ...arrayConcat(argInstrGroups),
          B.Instr("tail-call", [address, ...args], [], {}),
        ]
      } else {
        const [targetInstrs, target] = explicateUnnestedTerm(state, term.target)
        const fnGetter = generateCell(state, "fn-getter")
        const fn = generateCell(state, "fn")
        return [
          ...targetInstrs,
          B.Instr("address", [], [fnGetter], {
            name: B.SymbolAttribute("meta-builtin/builtin/closure-fn"),
          }),
          B.Instr("call", [fnGetter, target], [fn], {}),
          ...arrayConcat(argInstrGroups),
          B.Instr("tail-call", [fn, target, ...args], [], {}),
        ]
      }
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
      const [headInstrs, headCell] = explicateUnnestedTerm(state, head)
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
      message += `\n  condition: ${C.formatTerm(condition)}`
      throw new S.ErrorWithSourceLocation(message, condition.location)
    }
  }
}
