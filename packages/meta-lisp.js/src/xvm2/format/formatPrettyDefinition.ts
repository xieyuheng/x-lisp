import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function formatPrettyDefinition(
  width: number,
  definition: B.Definition,
): string {
  return Ppml.formatNode(B.prettyDefinition(definition), { width })
}