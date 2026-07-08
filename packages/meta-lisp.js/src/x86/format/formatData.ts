import * as X86 from "../index.ts"

export function formatData(data: X86.Data): string {
  switch (data.kind) {
    case "AddressData":
      return `(address ${data.name})`
    case "IntData":
      return data.value.toString()
    case "StringData":
      return JSON.stringify(data.content)
    case "StructData": {
      const fields = Object.entries(data.fields)
        .map(([fname, fexp]) => `(${fname} ${formatData(fexp)})`)
        .join(" ")
      return `(struct ${data.name} ${fields})`
    }
    case "PointerData":
      return `(pointer ${formatData(data.target)})`
    case "ArrayData": {
      const elements = data.elements.map(formatData).join(" ")
      return `(array ${elements})`
    }
  }
}
