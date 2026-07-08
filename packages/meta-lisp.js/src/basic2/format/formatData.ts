import * as B from "../index.ts"

export function formatData(data: B.Data): string {
  switch (data.kind) {
    case "AddressData":
      return `(address ${data.name})`
    case "IntData":
      return data.content.toString()
    case "FloatData":
      return data.content.toString()
    case "StringData":
      return JSON.stringify(data.content)
    case "StructData": {
      const fields = Object.entries(data.fields)
        .map(([fname, fdata]) => `(${fname} ${formatData(fdata)})`)
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

export function formatDatas(datas: Array<B.Data>): string {
  return datas.map(formatData).join(" ")
}
