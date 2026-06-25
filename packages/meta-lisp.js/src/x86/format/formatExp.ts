import * as X86 from "../index.ts"

export function formatExp(exp: X86.Exp): string {
  switch (exp.kind) {
    case "VarExp":
      return exp.name
    case "IntExp":
      return exp.value.toString()
    case "StringExp":
      return JSON.stringify(exp.content)
    case "StructExp": {
      const prefix = exp.name ? `${exp.name} ` : ""
      const fields = exp.fields
        .map((f) => `(${f.name} ${formatExp(f.exp)})`)
        .join(" ")
      return `(struct ${prefix}${fields})`
    }
    case "PointerExp":
      return `(pointer ${formatExp(exp.target)})`
    case "AddressExp":
      return `(address ${exp.name})`
  }
}
