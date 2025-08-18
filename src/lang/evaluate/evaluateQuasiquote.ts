import * as X from "@xieyuheng/x-data.js"
import { type Effect } from "./evaluate.ts"

export function evaluateQuasiquote(sexp: X.Data): Effect {
  if (X.isAtom(sexp)) {
    return (mod, env) => {
      return [env, sexp]
    }
  }

  throw new Error("TODO")
}
