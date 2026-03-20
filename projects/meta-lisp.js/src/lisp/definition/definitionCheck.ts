import { writeln } from "@xieyuheng/helpers.js/file"
import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function definitionCheck(definition: L.Definition): null {
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
    case "DatatypeDefinition": {
      definition.isChecked = true
      return null
    }

    case "InterfaceDefinition": {
      definition.isChecked = true
      return null
    }

    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = L.modLookupClaimedType(mod, name)
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
        L.Lambda(definition.parameters, definition.body, definition.meta),
      )
      definition.isChecked = true
      return null
    }
  }
}

function checkExp(mod: L.Mod, name: string, exp: L.Exp): void {
  const type = L.modLookupClaimedType(mod, name)
  if (type) {
    checkClaimedType(mod, exp, type)
  } else {
    checkByInfer(mod, name, exp)
  }
}

function checkClaimedType(mod: L.Mod, exp: L.Exp, type: L.Value): void {
  const effect = L.typeCheckAssignable(mod, L.emptyCtx(), exp, type)
  const result = effect(L.emptySubst())
  if (result.kind === "CheckError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  }
}

function checkByInfer(mod: L.Mod, name: string, exp: L.Exp): void {
  const effect = L.typeInfer(mod, L.emptyCtx(), exp)
  const result = effect(L.emptySubst())
  if (result.kind === "InferError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  } else {
    let inferredType = L.substApplyToType(result.subst, result.type)
    inferredType = L.typeGeneralizeInCtx(L.emptyCtx(), inferredType)
    L.modPutInferredType(mod, name, inferredType)
  }
}

function reportTypeCheckError(exp: L.Exp, errorMessage: string): string {
  if (exp.meta) {
    return S.tokenMetaReport(exp.meta, errorMessage)
  } else {
    let message = `-- ${errorMessage}`
    message += `\n  exp: ${L.formatExp(exp)}`
    return message
  }
}

function reportUnclaimedDefinition(definition: L.Definition): string {
  const errorMessage = `unclaimed definition: ${definition.name}`
  if (definition.meta) {
    return S.tokenMetaReport(definition.meta, errorMessage)
  } else {
    return `${pathRelativeToCwd(definition.mod.path)} -- ${errorMessage}`
  }
}
