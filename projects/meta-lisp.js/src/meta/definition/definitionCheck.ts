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
      const bodyType = M.Interface(
        Object.fromEntries(
          definition.dataConstructors.map((dataConstructor) => [
            dataConstructor.name,
            M.Interface(
              Object.fromEntries(
                dataConstructor.fields.map((field) => [field.name, field.type]),
              ),
              definition.location,
            ),
          ]),
        ),
        definition.location,
      )

      const exp =
        definition.dataTypeConstructor.parameters.length === 0
          ? bodyType
          : M.Lambda(
              definition.dataTypeConstructor.parameters,
              bodyType,
              definition.location,
            )
      checkExp(mod, name, exp)
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

    case "PrimitiveFunctionDeclaration":
    case "PrimitiveVariableDeclaration":
    case "PrimitiveFunctionDefinition":
    case "PrimitiveVariableDefinition": {
      const type = M.modLookupClaimedType(mod, name)
      if (!type) {
        writeln(reportUnclaimedPrimitiveDefinition(definition))
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

    case "TestDefinition": {
      checkExp(mod, name, definition.body)
      definition.isChecked = true
      return null
    }

    case "TypeDefinition": {
      if (definition.parameters.length === 0) {
        checkExp(mod, name, definition.body)
      } else {
        checkExp(
          mod,
          name,
          M.Lambda(definition.parameters, definition.body, definition.location),
        )
      }
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
  const ctx = M.emptyCtx()
  const effect = M.typeCheckAssignable(mod, ctx, exp, type)
  const result = effect(M.emptySubst())
  if (result.kind === "CheckError") {
    writeln(reportTypeCheckError(result.exp, result.message))
  }
}

function checkByInfer(mod: M.Mod, name: string, exp: M.Exp): void {
  const freshVarType = M.createFreshVarType(name)
  // - for recursive function
  const ctx = M.ctxPut(M.emptyCtx(), name, freshVarType)
  // - for mutual recursive function
  M.modPutInferredType(mod, name, freshVarType)
  const effect = M.typeInfer(mod, ctx, exp)
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

function reportUnclaimedPrimitiveDefinition(definition: M.Definition): string {
  const errorMessage = `unclaimed primitive definition: ${definition.name}`
  if (definition.location) {
    return S.sourceLocationReport(definition.location, errorMessage)
  } else {
    return `${pathRelativeToCwd(definition.mod.name)} -- ${errorMessage}`
  }
}
