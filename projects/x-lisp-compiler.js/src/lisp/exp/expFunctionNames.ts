import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import { type Exp } from "./Exp.ts"
import { expChildren } from "./index.ts"

export function expFunctionNames(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "FunctionRef": {
      return new Set([exp.name])
    }

    default: {
      return setUnionMany(expChildren(exp).map(expFunctionNames))
    }
  }
}
