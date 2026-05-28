import * as Ppml from "@xieyuheng/ppml.js"
import type { Definition } from "../definition/index.ts"
import { prettyDefinition } from "./prettyDefinition.ts"

export function formatPrettyDefinition(
  width: number,
  definition: Definition,
): string {
  return Ppml.formatNode(prettyDefinition(definition), { width })
}
