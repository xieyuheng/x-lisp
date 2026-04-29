import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function createFreshVar(
  name: string,
  location?: S.SourceLocation,
): M.Var {
  return M.Var(`${name}.${generateVarSerialNumber(name)}`, location)
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
