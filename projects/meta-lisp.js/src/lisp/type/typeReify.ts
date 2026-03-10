import * as L from "../index.ts"
import { typeCanonicalLabelSubst } from "./typeCanonicalLabelSubst.ts"

export function typeReify(type: L.Value): L.Value {
  const subst = typeCanonicalLabelSubst(type)
  return L.substApplyToType(subst, type)
}
