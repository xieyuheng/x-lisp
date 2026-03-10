import * as L from "../index.ts"
import { generateCanonicalLabelSubst } from "./generateSubst.ts"

export function typeReify(type: L.Value): L.Value {
  const subst = generateCanonicalLabelSubst([type])
  return L.substApplyToType(subst, type)
}
