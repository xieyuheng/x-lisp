import * as L from "../index.ts"

export function unfiyType(subst: L.Subst, lhs: L.Value, rhs: L.Value): L.Subst | undefined {
    lhs = L.substApplyToType(subst, lhs)
    rhs = L.substApplyToType(subst, rhs)

    return undefined

}
