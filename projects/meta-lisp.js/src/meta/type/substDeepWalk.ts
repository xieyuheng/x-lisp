import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as M from "../index.ts"

export function substDeepWalk(subst: M.Subst, type: M.Type): M.Type {
  return substDeepWalkWithBoundIds(new Set(), subst, type)
}

export function substDeepWalkCtx(subst: M.Subst, ctx: M.Ctx): M.Ctx {
  return mapMapValue(ctx, (t) => M.substDeepWalk(subst, t))
}

function substDeepWalkWithBoundIds(
  boundIds: Set<string>,
  subst: M.Subst,
  type: M.Type,
): M.Type {
  type = M.substWalk(subst, type)

  switch (type.kind) {
    case "VarType": {
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

    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType":
      return type

    case "ArrowType":
      return M.ArrowType(
        type.argTypes.map((t) => substDeepWalkWithBoundIds(boundIds, subst, t)),
        substDeepWalkWithBoundIds(boundIds, subst, type.retType),
      )

    case "ListType":
      return M.ListType(
        substDeepWalkWithBoundIds(boundIds, subst, type.elementType),
      )

    case "SetType":
      return M.SetType(
        substDeepWalkWithBoundIds(boundIds, subst, type.elementType),
      )

    case "HashType":
      return M.HashType(
        substDeepWalkWithBoundIds(boundIds, subst, type.keyType),
        substDeepWalkWithBoundIds(boundIds, subst, type.valueType),
      )

    case "DefinedDataType":
      return M.DefinedDataType(
        type.definition,
        type.argTypes.map((t) => substDeepWalkWithBoundIds(boundIds, subst, t)),
      )

    case "PolymorphicType": {
      const freshened = M.polymorphicTypeFreshSelf(type)
      const newVarTypes = freshened.varTypes
      const newBodyType = substDeepWalkWithBoundIds(
        new Set([...boundIds, ...newVarTypes.map(M.varTypeId)]),
        subst,
        freshened.bodyType,
      )
      return M.PolymorphicType(newVarTypes, newBodyType)
    }

    case "CurryType":
      return M.CurryType(
        substDeepWalkWithBoundIds(boundIds, subst, type.target),
        type.arity,
        type.args.map((t) => substDeepWalkWithBoundIds(boundIds, subst, t)),
      )

    case "DefinitionType":
      return type
  }
}
