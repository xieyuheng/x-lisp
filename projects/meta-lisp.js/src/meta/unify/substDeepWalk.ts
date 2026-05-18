import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as M from "../index.ts"

export function substDeepWalk(subst: M.Subst, type: M.Type): M.Type {
  return substDeepWalkWithBoundIds(new Set(), subst, type)
}

export function substDeepWalkCtx(subst: M.Subst, ctx: M.Ctx): M.Ctx {
  return {
    ...ctx,
    bindings: mapMapValue(ctx.bindings, (t) => M.substDeepWalk(subst, t)),
  }
}

interface Frame {
  state: "enter" | "exit"
  type: M.Type
  boundIds: Set<string>
  childResults: M.Type[]
  processedType?: M.Type
  children?: M.Type[]
  childIndex?: number
  freshenedVarTypes?: M.VarType[]
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
  }

  const stack: Frame[] = [
    { state: "enter", type, boundIds, childResults: [] },
  ]

  while (stack.length > 0) {
    const frame = stack[stack.length - 1]

    if (frame.state === "enter") {
      const processedType = M.substWalk(subst, frame.type)
      frame.processedType = processedType

      switch (processedType.kind) {
        case "VarType": {
          const id = M.varTypeId(processedType)
          let result: M.Type

          if (frame.boundIds.has(id)) {
            result = processedType
          } else {
            const found = M.substLookup(subst, id)
            result = found !== undefined ? found : processedType
          }

          stack.pop()
          if (stack.length > 0) {
            stack[stack.length - 1].childResults.push(result)
          } else {
            return result
          }
          break
        }

        case "CanonicalLabelType":
        case "TypeType":
        case "AtomType":
          stack.pop()
          if (stack.length > 0) {
            stack[stack.length - 1].childResults.push(processedType)
          } else {
            return processedType
          }
          break

        case "ArrowType":
          if (frame.children === undefined) {
            frame.children = [
              ...processedType.argTypes,
              processedType.retType,
            ]
            frame.childIndex = 0
          }
          break

        case "ListType":
          if (frame.children === undefined) {
            frame.children = [processedType.elementType]
            frame.childIndex = 0
          }
          break

        case "SetType":
          if (frame.children === undefined) {
            frame.children = [processedType.elementType]
            frame.childIndex = 0
          }
          break

        case "HashType":
          if (frame.children === undefined) {
            frame.children = [
              processedType.keyType,
              processedType.valueType,
            ]
            frame.childIndex = 0
          }
          break

        case "AlgebraicType":
          if (frame.children === undefined) {
            frame.children = [...processedType.argTypes]
            frame.childIndex = 0
          }
          break

        case "OpaqueType":
          if (frame.children === undefined) {
            frame.children = [...processedType.argTypes]
            frame.childIndex = 0
          }
          break

        case "PolymorphicType": {
          if (frame.children === undefined) {
            const freshened = M.polymorphicTypeFreshSelf(processedType)
            frame.freshenedVarTypes = freshened.varTypes
            const newVarTypes = freshened.varTypes
            frame.boundIds = new Set([
              ...frame.boundIds,
              ...newVarTypes.map(M.varTypeId),
            ])
            frame.children = [freshened.bodyType]
            frame.childIndex = 0
          }
          break
        }
      }

      if (frame.children !== undefined) {
        if (frame.childIndex! < frame.children!.length) {
          const childType = frame.children![frame.childIndex!]
          frame.childIndex!++
          stack.push({
            state: "enter",
            type: childType,
            boundIds: frame.boundIds,
            childResults: [],
          })
        } else {
          frame.state = "exit"
        }
      }
    } else {
      stack.pop()
      const childResults = frame.childResults
      const processedType = frame.processedType!

      let result: M.Type

      switch (processedType.kind) {
        case "ArrowType": {
          const argCount = processedType.argTypes.length
          result = M.ArrowType(
            childResults.slice(0, argCount),
            childResults[argCount],
          )
          break
        }

        case "ListType":
          result = M.ListType(childResults[0])
          break

        case "SetType":
          result = M.SetType(childResults[0])
          break

        case "HashType":
          result = M.HashType(childResults[0], childResults[1])
          break

        case "AlgebraicType":
          result = M.AlgebraicType(
            (processedType as M.AlgebraicType).definition,
            childResults,
          )
          break

        case "OpaqueType":
          result = M.OpaqueType(
            (processedType as M.OpaqueType).definition,
            childResults,
          )
          break

        case "PolymorphicType":
          result = M.PolymorphicType(
            frame.freshenedVarTypes!,
            childResults[0],
          )
          break

        default:
          throw new Error(
            `[substDeepWalkWithBoundIds] unexpected exit kind: ${processedType.kind}`,
          )
      }

      if (stack.length > 0) {
        stack[stack.length - 1].childResults.push(result)
      } else {
        return result
      }
    }
  }

  throw new Error(
    "[substDeepWalkWithBoundIds] unexpected end of iteration",
  )
}
