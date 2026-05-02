import { setAdd, setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as M from "../index.ts"
import { projectDumpMods } from "../project/projectDumpMods.ts"

export function LiftLambdaPass(
  project: M.Project,
  options: { dump: boolean },
): void {
  for (const mod of project.mods.values()) {
    mod.definitions = new Map(
      mod.definitions
        .values()
        .flatMap((definition) => onDefinition(mod, definition))
        .map((definition) => [definition.name, definition]),
    )
  }

  if (options.dump) projectDumpMods(project, "070-lift-lambda")
}

type State = {
  mod: M.Mod
  lifted: Array<M.Definition>
  definition: M.Definition
}

function onDefinition(
  mod: M.Mod,
  definition: M.Definition,
): Array<M.Definition> {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition":
    case "DataDefinition":
    case "InterfaceDefinition": {
      return [definition]
    }

    case "FunctionDefinition":
    case "VariableDefinition":
    case "TestDefinition":
    case "TypeDefinition": {
      const lifted: Array<M.Definition> = []
      const state = { mod, lifted, definition }
      definition.body = onExp(state, definition.body)
      return [
        definition,
        ...lifted.flatMap((definition) => onDefinition(mod, definition)),
      ]
    }
  }
}

function onExp(state: State, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar":
    case "Var": {
      return exp
    }

    case "Lambda": {
      const freeNames = Array.from(expFreeNames(new Set(), exp))
      const liftedCount = state.lifted.length + 1
      const newFunctionName = `${state.definition.name}©λ${liftedCount}`
      const newParameters = [...freeNames, ...exp.parameters]
      const arity = newParameters.length
      assert(exp.location)
      state.lifted.push(
        M.FunctionDefinition(
          state.mod,
          newFunctionName,
          newParameters,
          exp.body,
          exp.location,
        ),
      )

      const qualifiedFunctionName = `${state.mod.name}/${newFunctionName}`

      if (freeNames.length == 0) {
        return M.Var(qualifiedFunctionName)
      } else {
        return M.Apply(
          M.Var(qualifiedFunctionName),
          freeNames.map((name) => M.Var(name)),
        )
      }
    }

    default: {
      return M.expTraverse((e) => onExp(state, e), exp)
    }
  }
}

function expFreeNames(boundNames: Set<string>, exp: M.Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Keyword":
    case "String":
    case "Int":
    case "Float":
    case "QualifiedVar": {
      return new Set()
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return new Set()
      } else {
        return new Set([exp.name])
      }
    }

    case "Lambda": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "Polymorphic": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "Let1": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return setUnionMany([
        expFreeNames(boundNames, exp.rhs),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "Apply": {
      const children = [exp.target, ...exp.args]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "Begin1": {
      const children = [exp.head, exp.body]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "If": {
      const children = [exp.condition, exp.consequent, exp.alternative]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "Arrow": {
      const children = [...exp.argTypes, exp.retType]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "Interface": {
      const children = Object.values(exp.attributeTypes)
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    case "ExtendInterface": {
      const children = [exp.baseType, ...Object.values(exp.attributeTypes)]
      return setUnionMany(children.map((e) => expFreeNames(boundNames, e)))
    }

    default: {
      let message = `[LiftLambdaPass / expFreeNames] unhandled exp`
      if (exp.location)
        throw new S.ErrorWithSourceLocation(message, exp.location)
      else throw new Error(message)
    }
  }
}
