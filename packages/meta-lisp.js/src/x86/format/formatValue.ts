import * as X86 from "../index.ts"

export function formatValue(value: X86.Value): string {
  switch (value.kind) {
    case "IntValue":
      return value.value.toString()
    case "StringValue":
      return JSON.stringify(value.content)
    case "AddressValue":
      return `(@address ${value.name})`
    case "StructValue": {
      const prefix = value.name ? `${value.name} ` : ""
      const fields = formatFields(value.fields)
      return `(@struct ${prefix}${fields})`
    }
    case "PointerValue":
      return `(@pointer ${formatValue(value.target)})`
    case "TypeValue":
      return X86.formatType(value.type)
    case "ArrayValue": {
      const elements = value.elements.map(formatValue).join(" ")
      return `(@array ${elements})`
    }
  }
}

export function formatFields(fields: Map<string, X86.Value>): string {
  return Array.from(fields.entries())
    .map(([name, value]) => `(${name} ${formatValue(value)})`)
    .join(" ")
}
