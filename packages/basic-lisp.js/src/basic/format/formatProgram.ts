import * as B from "../index.ts"
import { formatDefinition } from "./formatDefinition.ts"
import { formatType } from "./formatType.ts"

export function formatProgram(program: B.Program): string {
  const texts: Array<string> = []

  for (const [name, type] of program.claims) {
    texts.push(`(claim ${name} ${formatType(type)})`)
  }

  for (const definition of program.definitions.values()) {
    texts.push(formatDefinition(definition))
  }

  return texts.join("\n") + "\n"
}
