import * as S from "@xieyuheng/sexp.js"
import * as C from "../core/index.ts"
import * as Pkg from "../package/index.ts"

// ConvertClosurePass
//
// 将 lexical scope 下的「匿名函数（lambda）」和「函数引用」，
// 统一转换为「顶层全局函数 + 堆分配的环境数据（list）」的组合。
//
// 这个 pass 解决了两个核心问题：
//
// - 生命周期问题：
//   函数的自由变量必须从栈上转移到堆上，
//   因为函数可能作为返回值逃逸出当前作用域。
//
// - 调用统一问题：
//   无论函数是顶层定义的、还是匿名 Lambda，
//   在调用点必须拥有统一的调用方式（即通过闭包对象间接调用）。
//   只有这样，才能以统一的方式生成 x86 的间接函数调用指令。

export function ConvertClosurePass(pkg: Pkg.Package): void {
  for (const coreMod of pkg.coreMods.values()) {
    const names = Array.from(coreMod.definitions.keys())
    for (const name of names) {
      const definition = coreMod.definitions.get(name)!
      convertClosureDefinition(coreMod, definition)
    }
  }

  if (pkg.config.compiler.dump)
    Pkg.packageDumpCoreMods(pkg, "150-convert-closure")
}

type State = {
  coreMod: C.Mod
  localLambdaCount: number
  definition: C.Definition
}

function convertClosureDefinition(
  coreMod: C.Mod,
  definition: C.Definition,
): void {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition": {
      const state = { coreMod, localLambdaCount: 0, definition }
      definition.body = convertClosureTerm(state, definition.body)
      return
    }
  }
}

function wrapParameters(definition: C.Definition): Array<string> {
  switch (definition.kind) {
    case "FunctionDefinition":
      return definition.parameters
    case "PrimitiveFunctionDeclaration":
      return Array.from({ length: definition.arity }, (_, i) => `x${i + 1}`)
    case "TestDefinition":
      return []
    default:
      throw new S.ErrorWithSourceLocation(
        "[wrapParameters] unexpected definition kind",
        definition.location,
      )
  }
}

function definitionIsFunction(definition: C.Definition): boolean {
  return (
    definition.kind === "FunctionDefinition" ||
    definition.kind === "PrimitiveFunctionDeclaration" ||
    definition.kind === "TestDefinition"
  )
}

function liftFunctionReference(
  definition: C.Definition,
  pkgName: string,
  modName: string,
  name: string,
  location: S.SourceLocation,
): C.Term {
  const qualifiedMod = definition.mod

  const wrapName = `${name}©wrap`
  if (!qualifiedMod.definitions.has(wrapName)) {
    const parameters = wrapParameters(definition)
    const wrapFunctionDefinition = C.FunctionDefinition(
      qualifiedMod,
      wrapName,
      ["©closure", ...parameters],
      C.ApplyTerm(
        C.QualifiedVarTerm(pkgName, modName, name, location),
        parameters.map((p) => C.VarTerm(p, location)),
        location,
      ),
      location,
    )
    qualifiedMod.definitions.set(wrapName, wrapFunctionDefinition)
    convertClosureDefinition(qualifiedMod, wrapFunctionDefinition)
  }

  return C.ClosureTerm(pkgName, modName, wrapName, [], location)
}

function convertClosureTerm(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      return liftLambda(state, term.parameters, term.body, term.location)
    }

    case "ApplyTerm": {
      return C.ApplyTerm(
        convertClosureTermInApplyTarget(state, term.target),
        term.args.map((arg) => convertClosureTerm(state, arg)),
        term.location,
      )
    }

    case "QualifiedVarTerm": {
      const qualifiedMod = Pkg.packageLookupCoreMod(
        state.coreMod.pkg,
        term.pkgName,
        term.modName,
      )
      if (qualifiedMod === undefined) {
        throw new S.ErrorWithSourceLocation(
          "[convertClosureTerm] qualifiedMod not found",
          term.location,
        )
      }

      const qualifiedDefinition = qualifiedMod.definitions.get(term.name)
      if (qualifiedDefinition === undefined) {
        throw new S.ErrorWithSourceLocation(
          "[convertClosureTerm] qualifiedDefinition not found",
          term.location,
        )
      }

      if (!definitionIsFunction(qualifiedDefinition)) return term

      return liftFunctionReference(
        qualifiedDefinition,
        term.pkgName,
        term.modName,
        term.name,
        term.location,
      )
    }

    default: {
      return C.termTraverse((e) => convertClosureTerm(state, e), term)
    }
  }
}

function convertClosureTermInApplyTarget(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      return liftLambda(state, term.parameters, term.body, term.location)
    }

    case "ApplyTerm": {
      return C.ApplyTerm(
        convertClosureTermInApplyTarget(state, term.target),
        term.args.map((arg) => convertClosureTerm(state, arg)),
        term.location,
      )
    }

    default: {
      return C.termTraverse(
        (e) => convertClosureTermInApplyTarget(state, e),
        term,
      )
    }
  }
}

function liftLambda(
  state: State,
  parameters: Array<string>,
  body: C.Term,
  location: S.SourceLocation,
): C.Term {
  const lambdaTerm = C.LambdaTerm(parameters, body, location)
  const freeNames = Array.from(C.termFreeNames(new Set(), lambdaTerm))
  state.localLambdaCount++
  const newFunctionName = `${state.definition.name}©λ${state.localLambdaCount}`

  const newParameters = ["©closure", ...parameters]
  const newBody = wrapBodyWithClosureArgs(freeNames, body, location)

  const functionDefinition = C.FunctionDefinition(
    state.coreMod,
    newFunctionName,
    newParameters,
    newBody,
    location,
  )
  state.coreMod.definitions.set(newFunctionName, functionDefinition)
  convertClosureDefinition(state.coreMod, functionDefinition)

  const freeVarTerms = freeNames.map((name) => C.VarTerm(name, location))
  return C.ClosureTerm(
    state.coreMod.pkg.id,
    state.coreMod.name,
    newFunctionName,
    freeVarTerms,
    location,
  )
}

function wrapBodyWithClosureArgs(
  freeNames: Array<string>,
  body: C.Term,
  location: C.Term["location"],
): C.Term {
  let result = body
  for (let i = 0; i < freeNames.length; i++) {
    result = C.Let1Term(
      freeNames[i],
      C.ApplyTerm(
        C.QualifiedVarTerm("meta-builtin", "builtin", "closure-arg", location),
        [C.IntTerm(BigInt(i), location), C.VarTerm("©closure", location)],
        location,
      ),
      result,
      location,
    )
  }
  return result
}
