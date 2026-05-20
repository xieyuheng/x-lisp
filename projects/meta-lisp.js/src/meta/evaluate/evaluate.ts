import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"
import { type Value } from "../value/Value.ts"
import { type Env } from "./Env.ts"

export type EvaluationMode = "OpaqueMode" | "TransparentMode"

export function evaluate(
  mode: EvaluationMode,
  mod: M.Mod,
  env: Env,
  exp: M.Exp,
): Value {
  switch (exp.kind) {
    case "Var": {
      const fromEnv = M.envLookup(env, exp.name)
      if (fromEnv) return fromEnv

      const definition = M.modLookupDefinition(mod, exp.name)
      if (definition) return definitionToValue(mode, definition)

      let message = `[evaluate] undefined variable`
      message += `\n  module name: ${mod.name}`
      message += `\n  name: ${exp.name}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "QualifiedVar": {
      const qualifiedMod = M.projectLookupMod(mod.project, exp.modName)
      if (qualifiedMod === undefined) {
        let message = `[evaluate] undefined module prefix`
        message += `\n  module: ${exp.modName}`
        message += `\n  name: ${exp.name}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }

      const definition = M.modLookupDefinition(qualifiedMod, exp.name)
      if (definition) return definitionToValue(mode, definition)

      let message = `[evaluate] undefined qualified variable`
      message += `\n  module: ${qualifiedMod.name}`
      message += `\n  name: ${exp.name}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "Arrow": {
      const argTypes = exp.argTypes.map((argType) =>
        M.evaluateType(mode, mod, env, argType),
      )
      const retType = M.evaluateType(mode, mod, env, exp.retType)
      return M.TypeValue(M.ArrowType(argTypes, retType))
    }

    case "Polymorphic": {
      const varTypes = exp.parameters.map((parameter) =>
        M.VarType(parameter, BigInt(0)),
      )
      const bodyType = M.evaluateType(
        mode,
        mod,
        M.envPutMany(
          env,
          exp.parameters,
          varTypes.map((vt) => M.TypeValue(vt)),
        ),
        exp.body,
      )
      return M.TypeValue(M.PolymorphicType(varTypes, bodyType))
    }

    case "Apply": {
      const target = evaluate(mode, mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mode, mod, env, arg))
      return M.apply(mode, target, args)
    }

    default: {
      let message = `[evaluate] unhandled exp`
      message += `\n  exp kind: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

function definitionToValue(
  mode: EvaluationMode,
  definition: M.Definition,
): Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      let message = `[definitionToValue] can not handle declared primitive function`
      throw new Error(message)
    }

    case "PrimitiveVariableDeclaration": {
      let message = `[definitionToValue] can not handle declared primitive variable`
      throw new Error(message)
    }

    case "PrimitiveFunctionDefinition":
    case "FunctionDefinition":
    case "TestDefinition": {
      return M.DefinitionValue(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        const type = M.evaluateType(
          mode,
          definition.mod,
          M.emptyEnv(),
          definition.body,
        )
        return M.TypeValue(type)
      } else {
        return M.DefinitionValue(definition)
      }
    }

    case "VariableDefinition": {
      const type = M.evaluateType(
        mode,
        definition.mod,
        M.emptyEnv(),
        definition.body,
      )
      return M.TypeValue(type)
    }

    case "AlgebraicTypeDefinition": {
      if (definition.typeConstructor.parameters.length === 0) {
        return M.TypeValue(M.AlgebraicType(definition, []))
      } else {
        return M.DefinitionValue(definition)
      }
    }

    case "OpaqueTypeDefinition": {
      if (mode === "TransparentMode") {
        if (definition.typeConstructor.parameters.length === 0) {
          const type = M.evaluateType(
            mode,
            definition.mod,
            M.emptyEnv(),
            definition.representationType,
          )
          return M.TypeValue(type)
        } else {
          return M.DefinitionValue(definition)
        }
      } else {
        if (definition.typeConstructor.parameters.length === 0) {
          return M.TypeValue(M.OpaqueType(definition, []))
        } else {
          return M.DefinitionValue(definition)
        }
      }
    }
  }
}
