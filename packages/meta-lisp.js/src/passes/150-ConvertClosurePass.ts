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
    coreMod.definitions = new Map(
      coreMod.definitions
        .values()
        .flatMap((definition) => convertClosureDefinition(coreMod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (pkg.config.compiler.dump)
    Pkg.packageDumpCoreMods(pkg, "150-convert-closure")
}

type State = {
  coreMod: C.Mod
  lifted: Array<C.Definition>
  definition: C.Definition
}

function convertClosureDefinition(
  coreMod: C.Mod,
  definition: C.Definition,
): Array<C.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition": {
      const lifted: Array<C.Definition> = []
      const state = { coreMod, lifted, definition }
      definition.body = convertClosureTerm(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) =>
          convertClosureDefinition(coreMod, definition),
        ),
      ]
    }
  }
}

function convertClosureTerm(state: State, term: C.Term): C.Term {
  switch (term.kind) {
    case "LambdaTerm": {
      const freeNames = Array.from(C.termFreeNames(new Set(), term))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`

      const newParameters = ["©closure", ...term.parameters]
      const newBody = wrapBodyWithClosureArgs(
        freeNames,
        term.body,
        term.location,
      )

      state.lifted.push(
        C.FunctionDefinition(
          state.coreMod,
          newFunctionName,
          newParameters,
          newBody,
          term.location,
        ),
      )

      const freeVarTerms = freeNames.map((name) =>
        C.VarTerm(name, term.location),
      )
      return C.ClosureTerm(
        state.coreMod.pkg.id,
        state.coreMod.name,
        newFunctionName,
        freeVarTerms,
        term.location,
      )
    }

    default: {
      return C.termTraverse((e) => convertClosureTerm(state, e), term)
    }
  }
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
