import { definePrimitiveFunction, provide } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFunction(mod: Mod) {
  provide(mod, ["apply"])

  definePrimitiveFunction(mod, "apply", 2, (f, args) => {
    return apply(f, Values.asTael(args).elements)
  })

  runCode(
    mod,
    `\
(export pipe-fn)

(define (pipe-fn x fs)
  (cond ((list-empty? fs) x)
        (else (pipe-fn ((list-head fs) x) (list-tail fs)))))
`,
  )
}
