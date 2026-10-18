import * as M from "../index.ts"

export function formatValue(value: M.Value): string {
  switch (value.kind) {
    case "TypeValue": {
      return M.formatType(value.type)
    }

    case "CurryValue": {
      const args = M.formatValues(value.args)
      const target = formatValue(value.target)
      if (args.length === 0) {
        return target
      } else {
        return `(${target} ${args})`
      }
    }

    case "DefinitionValue": {
      return `${value.definition.mod.name}/${value.definition.name}`
    }
  }
}

export function formatValues(values: Array<M.Value>): string {
  return values.map((v) => formatValue(v)).join(" ")
}
