import * as S from "@xieyuheng/sexp.js"
import * as Pkg from "../../package/index.ts"
import * as M from "../index.ts"
import { type Env, type EvaluationMode } from "./Env.ts"

export function evaluate(mod: M.Mod, env: Env, exp: M.Term): M.Value {
  switch (exp.kind) {
    case "VarTerm": {
      const fromEnv = M.envLookup(env, exp.name)
      if (fromEnv) return fromEnv

      const definition = M.modLookupDefinition(mod, exp.name)
      if (definition) return definitionToValue(M.envMode(env), definition)

      let message = `[evaluate] undefined variable`
      message += `\n  package name: ${mod.pkg.config.name}`
      message += `\n  package id: ${mod.pkg.id}`
      message += `\n  module name: ${mod.name}`
      message += `\n  name: ${exp.name}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }

    case "QualifiedVarTerm": {
      const definition = Pkg.packageLookupDefinition(
        mod.pkg,
        exp.pkgName,
        exp.modName,
        exp.name,
      )
      if (definition === undefined) {
        let message = `[evaluate] undefined qualified variable`
        message += `\n  from package: ${mod.pkg.rootDirectory}`
        message += `\n  name: ${exp.name}`
        throw new S.ErrorWithSourceLocation(message, exp.location)
      }

      return definitionToValue(M.envMode(env), definition)
    }

    case "ArrowTerm": {
      const argTypes = exp.argTypes.map((argType) =>
        M.evaluateType(mod, env, argType),
      )
      const retType = M.evaluateType(mod, env, exp.retType)
      return M.TypeValue(M.ArrowType(argTypes, retType))
    }

    case "PolymorphicTerm": {
      const varTypes = exp.parameters.map((parameter) =>
        M.VarType(parameter, BigInt(0)),
      )
      const bodyType = M.evaluateType(
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

    case "ApplyTerm": {
      const target = evaluate(mod, env, exp.target)
      const args = exp.args.map((arg) => evaluate(mod, env, arg))
      return M.apply(M.envMode(env), target, args)
    }

    default: {
      let message = `[evaluate] unhandled term`
      message += `\n  term kind: ${exp.kind}`
      throw new S.ErrorWithSourceLocation(message, exp.location)
    }
  }
}

function definitionToValue(
  mode: EvaluationMode,
  definition: M.Definition,
): M.Value {
  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      const fn = M.lookupPrimitiveFunction(definition.name)
      if (fn === undefined) {
        let message = `[definitionToValue] no JS implementation for primitive function: ${definition.name}`
        throw new Error(message)
      }
      return M.DefinitionValue(definition)
    }

    case "PrimitiveVariableDeclaration": {
      const value = M.lookupPrimitiveVariable(definition.name)
      if (value === undefined) {
        let message = `[definitionToValue] no JS value for primitive variable: ${definition.name}`
        throw new Error(message)
      }
      return value
    }

    case "FunctionDefinition":
    case "TestDefinition": {
      return M.DefinitionValue(definition)
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        const type = M.evaluateType(
          definition.mod,
          M.emptyEnv(mode),
          definition.body,
        )
        return M.TypeValue(type)
      } else {
        return M.DefinitionValue(definition)
      }
    }

    case "VariableDefinition": {
      const type = M.evaluateType(
        definition.mod,
        M.emptyEnv(mode),
        definition.body,
      )
      return M.TypeValue(type)
    }

    case "AlgebraicTypeDefinition": {
      if (definition.typeConstructor.parameters.length === 0) {
        return M.TypeValue(M.DataType(definition.typeConstructor, []))
      } else {
        return M.DefinitionValue(definition)
      }
    }

    case "OpaqueTypeDefinition": {
      if (mode === "TransparentMode") {
        if (definition.typeConstructor.parameters.length === 0) {
          const type = M.evaluateType(
            definition.mod,
            M.emptyEnv(mode),
            definition.representationType,
          )
          return M.TypeValue(type)
        } else {
          return M.DefinitionValue(definition)
        }
      }

      if (definition.typeConstructor.parameters.length === 0) {
        return M.TypeValue(M.DataType(definition.typeConstructor, []))
      } else {
        return M.DefinitionValue(definition)
      }
    }
  }
}
