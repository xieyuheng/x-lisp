import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as M from "../index.ts"

export function substDeepWalk(subst: M.Subst, type: M.Value): M.Value {
  return substDeepWalkWithBoundIds(new Set(), subst, type)
}

export function substDeepWalkCtx(subst: M.Subst, ctx: M.Ctx): M.Ctx {
  return mapMapValue(ctx, (t) => M.substDeepWalk(subst, t))
}

function substDeepWalkWithBoundIds(
  boundIds: Set<string>,
  subst: M.Subst,
  type: M.Value,
): M.Value {
  type = M.substWalk(subst, type)

  if (M.isVarType(type)) {
    const id = M.varTypeId(type)
    if (boundIds.has(id)) {
      return type
    }

    const found = M.substLookup(subst, id)
    if (found !== undefined) {
      return found
    }

    return type
  }

  if (M.isCanonicalLabelType(type)) {
    return type
  }

  if (M.isTypeType(type)) {
    return type
  }

  if (M.isAtomType(type)) {
    return type
  }

  if (M.isArrowType(type)) {
    return M.createArrowType(
      M.arrowTypeArgTypes(type).map((t) =>
        substDeepWalkWithBoundIds(boundIds, subst, t),
      ),
      substDeepWalkWithBoundIds(boundIds, subst, M.arrowTypeRetType(type)),
    )
  }

  if (M.isListType(type)) {
    return M.createListType(
      substDeepWalkWithBoundIds(boundIds, subst, M.listTypeElementType(type)),
    )
  }

  if (M.isSetType(type)) {
    return M.createSetType(
      substDeepWalkWithBoundIds(boundIds, subst, M.setTypeElementType(type)),
    )
  }

  if (M.isHashType(type)) {
    return M.createHashType(
      substDeepWalkWithBoundIds(boundIds, subst, M.hashTypeKeyType(type)),
      substDeepWalkWithBoundIds(boundIds, subst, M.hashTypeValueType(type)),
    )
  }

  if (M.isDefinedDataType(type)) {
    return M.createDefinedDataType(
      M.definedDataTypeDefinition(type),
      M.definedDataTypeArgTypes(type).map((t) =>
        substDeepWalkWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isPolymorphicType(type)) {
    // - Be careful about the "name-capture" problem.
    type = M.polymorphicTypeFreshSelf(type)

    const varTypes = M.polymorphicTypeVarTypes(type)
    const bodyType = M.polymorphicTypeBodyType(type)

    return M.createPolymorphicType(
      varTypes,
      substDeepWalkWithBoundIds(
        new Set([...boundIds, ...varTypes.map(M.varTypeId)]),
        subst,
        bodyType,
      ),
    )
  }

  let message = `[substDeepWalkWithBoundIds] unhandled type`
  message += `\n  type: ${M.formatType(type)}`
  throw new Error(message)
}
