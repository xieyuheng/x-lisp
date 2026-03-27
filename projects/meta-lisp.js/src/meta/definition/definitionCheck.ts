import { writeln } from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function definitionCheck(definition: M.Definition): null {
  if (definition.isChecked) {
    return null
  }

  const mod = definition.mod
  const name = definition.name

  if (mod.exempted.has(name)) {
    definition.isChecked = true
    return null
  }

  switch (definition.kind) {
    case "DataDefinition": {
      definition.isChecked = true
      return null
    }

    case "InterfaceDefinition": {
      const exp =
        definition.interfaceConstructor.parameters.length === 0
          ? M.Interface(definition.attributeTypes, definition.location)
          : M.Lambda(
              definition.interfaceConstructor.parameters,
              M.Interface(definition.attributeTypes, definition.location),
              definition.location,
            )
      checkExp(mod, name, exp)
      definition.isChecked = true
      return null
    }

    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = M.modLookupClaimedType(mod, name)
      if (!type) {
        writeln(reportUnclaimedDefinition(definition))
        return null
      }

      definition.isChecked = true
      return null
    }

    case "VariableDefinition": {
      checkExp(mod, name, definition.body)
      definition.isChecked = true
      return null
    }

    case "FunctionDefinition": {
      checkExp(
        mod,
        name,
        M.Lambda(definition.parameters, definition.body, definition.location),
      )
      definition.isChecked = true
      return null
    }
  }
}

function checkExp(mod: M.Mod, name: string, exp: M.Exp): void {
  const type = M.modLookupClaimedType(mod, name)
  if (type) {
    checkClaimedType(mod, exp, type)
  } else {
    checkByInfer(mod, name, exp)
  }
}

function checkClaimedType(mod: M.Mod, exp: M.Exp, type: M.Value): void {
  const effect = M.typeCheckAssignable(mod, M.emptyCtx(), exp, type)
  const result = effect(M.emptySubst())
  if (result.kind === "CheckError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  }
}

function checkByInfer(mod: M.Mod, name: string, exp: M.Exp): void {
  const effect = M.typeInfer(mod, M.emptyCtx(), exp)
  const result = effect(M.emptySubst())
  if (result.kind === "InferError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  } else {
    let inferredType = M.substApplyToType(result.subst, result.type)
    inferredType = M.typeGeneralizeInCtx(M.emptyCtx(), inferredType)
    M.modPutInferredType(mod, name, inferredType)
  }
}

function reportTypeCheckError(exp: M.Exp, errorMessage: string): string {
  if (exp.location) {
    return S.sourceLocationReport(exp.location, errorMessage)
  } else {
    let message = `-- ${errorMessage}`
    message += `\n  exp: ${M.formatExp(exp)}`
    return message
  }
}

function reportUnclaimedDefinition(definition: M.Definition): string {
  const errorMessage = `unclaimed definition: ${definition.name}`
  if (definition.location) {
    return S.sourceLocationReport(definition.location, errorMessage)
  } else {
    return `${pathRelativeToCwd(definition.mod.path)} -- ${errorMessage}`
  }
}
