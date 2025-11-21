import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function makeCurry(target: Exp, arity: number, args: Array<Exp>): Exp {
  let result = Exps.desugarApply(
    Exps.Function("make-curry", 3, { isPrimitive: true }),
    [target, Exps.Int(arity), Exps.Int(args.length)],
  )

  for (const [index, arg] of args.entries()) {
    result = Exps.desugarApply(
      Exps.Function("curry-put!", 3, { isPrimitive: true }),
      [Exps.Int(index), arg, result],
    )
  }

  return result
}
