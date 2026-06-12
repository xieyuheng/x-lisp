import * as X86 from "../index.ts"

export function formatType(type: X86.Type): string {
  switch (type.kind) {
    case "AtomType":
      return type.name
    case "PointerType":
      return `(pointer-t ${formatType(type.target)})`
    case "NamedType":
      return type.name
  }
}

export function formatTypeFields(fields: Map<string, X86.Type>): string {
  return Array.from(fields.entries())
    .map(([name, type]) => `(${name} ${formatType(type)})`)
    .join(" ")
}
