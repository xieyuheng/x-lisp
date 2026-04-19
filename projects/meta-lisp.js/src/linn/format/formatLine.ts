import type { Line } from "../line/index.ts"
import { formatExps } from "./formatExp.ts"

export function formatLine(line: Line): string {
  const args = formatExps(line.args)
  return `${line.op} ${line.path} ${args}`
}
