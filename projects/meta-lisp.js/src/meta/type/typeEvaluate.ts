import * as M from "../index.ts"
import { type Type, type TypeEnv } from "../index.ts"

export function typeEvaluate(mod: M.Mod, typeEnv: TypeEnv, exp: M.Exp): Type {
  switch (exp.kind) {
    case "Var": {
      const type = typeLookup(mod, typeEnv, exp.name)
      if (type) return type

      let message = `[typeEvaluate] undefined variable`
      message += `\n  name: ${exp.name}`
      throw new Error(message)
    }

    case "QualifiedVar": {
      const qualifiedMod = M.projectLookupMod(mod.project, exp.modName)
      if (qualifiedMod === undefined) {
        let message = `[typeEvaluate] undefined module prefix`
        message += `\n  module: ${exp.modName}`
        message += `\n  name: ${exp.name}`
        throw new Error(message)
      }

      const type = typeLookup(qualifiedMod, M.emptyTypeEnv(), exp.name)
      if (type) return type

      let message = `[typeEvaluate] undefined qualified variable`
      message += `\n  module: ${exp.modName}`
      message += `\n  name: ${exp.name}`
      throw new Error(message)
    }

    case "Arrow": {
      const argTypes = exp.argTypes.map((argType) =>
        typeEvaluate(mod, typeEnv, argType),
      )
      const retType = typeEvaluate(mod, typeEnv, exp.retType)
      return M.ArrowType(argTypes, retType)
    }

    case "Polymorphic": {
      const varTypes = exp.parameters.map((parameter) =>
        M.VarType(parameter, BigInt(0)),
      )
      const bodyType = typeEvaluate(
        mod,
        M.typeEnvPutMany(typeEnv, exp.parameters, varTypes),
        exp.body,
      )
      return M.PolymorphicType(varTypes, bodyType)
    }

    case "Apply": {
      const target = typeEvaluate(mod, typeEnv, exp.target)
      const args = exp.args.map((arg) => typeEvaluate(mod, typeEnv, arg))
      return M.typeApply(target, args)
    }

    default: {
      let message = `[typeEvaluate] unhandled exp`
      message += `\n  exp kind: ${exp.kind}`
      throw new Error(message)
    }
  }
}

function typeLookup(
  mod: M.Mod,
  typeEnv: TypeEnv,
  name: string,
): M.Type | undefined {
  const fromTypeEnv = M.typeEnvLookup(typeEnv, name)
  if (fromTypeEnv) return fromTypeEnv

  const definition = M.modLookupDefinition(mod, name)
  if (definition) return definitionToType(definition)

  return M.modLookupClaimedType(mod, name)
}

function definitionToType(definition: M.Definition): M.Type {
  M.definitionCheck(definition)

  switch (definition.kind) {
    case "PrimitiveFunctionDeclaration": {
      let message = `[definitionToType] can not handle declared primitive function`
      throw new Error(message)
    }

    case "PrimitiveVariableDeclaration": {
      let message = `[definitionToType] can not handle declared primitive variable`
      throw new Error(message)
    }

    case "PrimitiveFunctionDefinition":
    case "FunctionDefinition":
    case "TestDefinition": {
      return M.DefinitionType(definition)
    }

    case "PrimitiveVariableDefinition": {
      return definition.value
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        return M.typeEvaluate(definition.mod, M.emptyTypeEnv(), definition.body)
      } else {
        return M.DefinitionType(definition)
      }
    }

    case "VariableDefinition": {
      return M.typeEvaluate(definition.mod, M.emptyTypeEnv(), definition.body)
    }

    case "AlgebraicTypeDefinition": {
      if (definition.typeConstructor.parameters.length === 0) {
        return M.AlgebraicDataType(definition, [])
      } else {
        return M.DefinitionType(definition)
      }
    }
  }
}
