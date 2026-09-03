import * as Ppml from "@xieyuheng/ppml.js"
import { prettyProgram } from "../pretty/prettyProgram.ts"
import { type Program } from "../program/Program.ts"

export function formatProgram(program: Program): string {
  return Ppml.formatNode(prettyProgram(program), { width: 80 }) + "\n"
}
