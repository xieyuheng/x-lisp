import * as M from "../index.ts"
import { generateCanonicalLabelSubst } from "./generateSubst.ts"

export function typeReify(type: M.Value): M.Value {
  const subst = generateCanonicalLabelSubst([type])
  return M.substDeepWalk(subst, type)
}
