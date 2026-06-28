import * as B from "../index.ts"

export function formatExp(exp: B.Exp): string {
  switch (exp.kind) {
    case "AddressExp":
      return `(address ${exp.name})`
    case "IntExp":
      return `(int ${exp.value.toString()})`
    case "FloatExp":
      return `(float ${exp.value.toString()})`
    case "StringExp":
      return `(string ${JSON.stringify(exp.content)})`
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

export function formatExps(exps: Array<B.Exp>): string {
  return exps.map(formatExp).join(" ")
}
