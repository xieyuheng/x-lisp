import * as PPML from "../../utils/ppml/index.ts"
import { type Exp } from "../exp/index.ts"
import { formatAtom } from "../format/index.ts"
import { isAtom } from "../value/index.ts"

export function prettyFormatExp(maxWidth: number, exp: Exp): string {
  return PPML.format(maxWidth, renderExp(exp))
}

export function renderExp(exp: Exp): PPML.Node {
  if (isAtom(exp)) {
    return PPML.TextNode(formatAtom(exp))
  }

  return PPML.NullNode()
}
