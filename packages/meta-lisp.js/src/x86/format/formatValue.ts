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
      const fields = Array.from(value.fields.entries())
        .map(([name, v]) => `(${name} ${formatValue(v)})`)
        .join(" ")
      return `(struct ${prefix}${fields})`
    }
    case "PointerValue":
      return `(pointer ${formatValue(value.target)})`
  }
}
