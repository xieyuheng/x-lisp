import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as S from "@xieyuheng/sexp.js"
import * as L from "../index.ts"

export function createFreshVar(name: string, meta?: S.TokenMeta): L.Var {
  const subscript = stringToSubscript(generateVarSerialNumber(name).toString())
  return L.Var(`${name}${subscript}`, meta)
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
