import * as M from "../index.ts"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"

export function createFreshVar(
  name: string,
  location?: S.SourceLocation,
): M.Var {
  const subscript = stringToSubscript(generateVarSerialNumber(name).toString())
  return M.Var(`${name}${subscript}`, location)
}

const serialNumberMap: Map<string, bigint> = new Map()

function generateVarSerialNumber(name: string): bigint {
  const count = serialNumberMap.get(name)
  if (count) {
    serialNumberMap.set(name, count + 1n)
    return count + 1n
  } else {
    serialNumberMap.set(name, 1n)
    return 1n
  }
}
