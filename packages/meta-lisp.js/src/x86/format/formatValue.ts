import * as X86 from "../index.ts"

export function formatValue(value: X86.Value): string {
  switch (value.kind) {
    case "IntValue":
      return value.value.toString()
    case "StringValue":
      return JSON.stringify(value.content)
    case "LabelValue":
      if (value.path.length === 0) return `(label ${value.name})`
      return `(label ${[value.name, ...value.path].join(" ")})`
    case "StructValue": {
      const prefix = value.name ? `${value.name} ` : ""
      const fields = formatFields(value.fields)
      return `(struct ${prefix}${fields})`
    }
    case "PointerValue":
      return `(pointer ${formatValue(value.target)})`
    case "TypeValue":
      return X86.formatType(value.type)
    case "TypeConstructorValue":
      return value.typeConstructor.name
  }
}

export function formatFields(fields: Map<string, X86.Value>): string {
  return Array.from(fields.entries())
    .map(([name, value]) => `(${name} ${formatValue(value)})`)
    .join(" ")
}
