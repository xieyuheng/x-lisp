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
