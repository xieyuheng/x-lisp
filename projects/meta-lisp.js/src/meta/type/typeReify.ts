import * as M from "../index.ts"
import { generateCanonicalLabelSubst } from "./generateSubst.ts"

export function typeReify(type: M.Type): M.Type {
  const subst = generateCanonicalLabelSubst([type])
  return M.substDeepWalk(subst, type)
}
