import { type Attribute } from "../attribute/index.ts"
import { type Cell } from "../cell/index.ts"

export type Instr = {
  op: string
  input: Array<Cell>
  output: Array<Cell>
  attributes: Record<string, Attribute>
}

export function Instr(
  op: string,
  input: Array<Cell>,
  output: Array<Cell>,
  attributes: Record<string, Attribute>,
): Instr {
  return { op, input, output, attributes }
}
