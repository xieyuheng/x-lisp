import { type Attribute } from "../attribute/index.ts"
import { type Cell } from "../cell/index.ts"

export type Instr = {
  op: string
  output: Array<Cell>
  input: Array<Cell>
  attributes: Record<string, Attribute>
}

export function Instr(
  op: string,
  output: Array<Cell>,
  input: Array<Cell>,
  attributes: Record<string, Attribute>,
): Instr {
  return { op, output, input, attributes }
}
