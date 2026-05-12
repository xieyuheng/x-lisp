import * as M from "../index.ts"
import { type Type, type TypeEnv } from "../index.ts"

export function typeEvaluate(mod: M.Mod, typeEnv: TypeEnv, exp: M.Exp): Type {
  switch (exp.kind) {
    case "Var": {
      const fromTypeEnv = M.typeEnvLookup(typeEnv, exp.name)
      if (fromTypeEnv) return fromTypeEnv

      const definition = M.modLookupDefinition(mod, exp.name)
      if (definition) {
        const type = M.definitionMeaning(definition)
        if (type) return type
      }

      const claimedType = M.modLookupClaimedType(mod, exp.name)
      if (claimedType) return claimedType

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

      const definition = M.modLookupDefinition(qualifiedMod, exp.name)
      if (definition) {
        const type = M.definitionMeaning(definition)
        if (type) return type
      }

      const claimedType = M.modLookupClaimedType(qualifiedMod, exp.name)
      if (claimedType) return claimedType

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
