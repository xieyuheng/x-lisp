import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function makeCurry(target: Exp, arity: number, args: Array<Exp>): Exp {
  let result = Exps.desugarApply(
    Exps.FunctionRef("make-curry", 3, { isPrimitive: true }),
    [target, Exps.Int(BigInt(arity)), Exps.Int(BigInt(args.length))],
  )

  for (const [index, arg] of args.entries()) {
    result = Exps.desugarApply(
      Exps.FunctionRef("curry-put!", 3, { isPrimitive: true }),
      [Exps.Int(BigInt(index)), arg, result],
    )
  }

  return result
}
