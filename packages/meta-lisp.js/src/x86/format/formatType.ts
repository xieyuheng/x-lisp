import * as X86 from "../index.ts"

export function formatType(type: X86.Type): string {
  switch (type.kind) {
    case "VarType":
      return type.name
    case "DataType": {
      const typeCtorName = type.typeConstructor.name
      if (type.argTypes.length === 0) return typeCtorName
      const argStrings = type.argTypes.map(formatType).join(" ")
      return `(${typeCtorName} ${argStrings})`
    }
  }
}

export function formatTypeFields(fields: Map<string, X86.Type>): string {
  return Array.from(fields.entries())
    .map(([name, type]) => `(${name} ${formatType(type)})`)
    .join(" ")
}
