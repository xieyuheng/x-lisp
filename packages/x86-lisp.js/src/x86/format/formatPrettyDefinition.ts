import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

export function formatPrettyDefinition(
  width: number,
  definition: X86.Definition,
): string {
  return Ppml.formatNode(X86.prettyDefinition(definition), { width })
}
