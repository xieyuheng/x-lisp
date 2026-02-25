import * as L from "../index.ts"

export type Subst = Map<bigint, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(serialNumber: bigint, type: L.Value): Subst {
  return new Map([[serialNumber, type]])
}

export function substApplyToType(subst: Subst, type: L.Value): L.Value {
  if (L.isVarType(type)) {
    const serialNumber = L.varTypeSerialNumber(type)
    const found = subst.get(serialNumber)
    if (found) {
      return found
    } else {
      return type
    }
  }

  return L.typeTraverse((type) => substApplyToType(subst, type), type)
}
