import * as X86 from "../index.ts"

export function formatType(type: X86.Type): string {
  return type.typeConstructor.name
}

export function formatTypeFields(fields: Map<string, X86.Type>): string {
  return Array.from(fields.entries())
    .map(([name, type]) => `(${name} ${formatType(type)})`)
    .join(" ")
}
