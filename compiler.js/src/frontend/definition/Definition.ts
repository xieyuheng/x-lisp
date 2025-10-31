import type { Exp } from "../exp/index.ts"

export type Definition = FunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  parameters: Array<string>
  body: Exp
}

export function FunctionDefinition(
  name: string,
  parameters: Array<string>,
  body: Exp,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    parameters,
    body,
  }
}
