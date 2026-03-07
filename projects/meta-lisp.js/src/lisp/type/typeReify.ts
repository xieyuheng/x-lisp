import * as L from "../index.ts"
import { typeCanonicalLabelSubst } from "./typeCanonicalLabelSubst.ts"
import { typeFreshen } from "./typeFreshen.ts"

export function typeReify(type: L.Value): L.Value {
  type = typeFreshen(type)
  const subst = typeCanonicalLabelSubst(type)(L.emptySubst())
  return L.substApplyToType(subst, type)
}
