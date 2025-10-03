import { define, definePrimitiveFunction, provide } from "../define/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutNull(mod: Mod) {
  provide(mod, ["null", "null?", "optional?"])

  define(mod, "null", Values.Null())

  definePrimitiveFunction(mod, "null?", 1, (value) => {
    return Values.Bool(Values.isNull(value))
  })

  runCode(
    mod,
    `\n
(define (optional? p x)
  (or (p x)
      (null? x)))
`,
  )
}
