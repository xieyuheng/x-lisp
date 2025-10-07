import { provide } from "../define/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutOptional(mod: Mod) {
  provide(mod, ["optional?"])

  runCode(
    mod,
    `\n
(define (optional? p x)
  (or (p x)
      (null? x)))
`,
  )
}
