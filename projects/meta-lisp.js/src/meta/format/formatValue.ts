import * as M from "../index.ts"

export function formatValue(value: M.Value): string {
  switch (value.kind) {
    case "TypeValue": {
      return M.formatType(value.type)
    }

    case "CurryValue": {
      return `{CurryValue}`
    }

    case "DefinitionValue": {
      return `{DefinitionValue}`
    }
  }
}

export function formatValues(values: Array<M.Value>): string {
  return values.map((v) => formatValue(v)).join(" ")
}
