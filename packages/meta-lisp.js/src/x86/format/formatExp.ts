import * as X86 from "../index.ts"

export function formatExp(exp: X86.Exp): string {
  switch (exp.kind) {
    case "AddressExp":
      return `(address ${exp.name})`
    case "IntExp":
      return exp.value.toString()
    case "StringExp":
      return JSON.stringify(exp.content)
    case "StructExp": {
      const fields = Object.entries(exp.fields)
        .map(([fname, fexp]) => `(${fname} ${formatExp(fexp)})`)
        .join(" ")
      return `(struct ${exp.name} ${fields})`
    }
    case "PointerExp":
      return `(pointer ${formatExp(exp.target)})`
    case "ArrayExp": {
      const elements = exp.elements.map(formatExp).join(" ")
      return `(array ${elements})`
    }
  }
}
