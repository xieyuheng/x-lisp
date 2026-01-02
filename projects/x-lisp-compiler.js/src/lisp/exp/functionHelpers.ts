import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function makeCurry(target: Exp, arity: number, args: Array<Exp>): Exp {
  let result = Exps.Apply(
    Exps.PrimitiveRef("make-curry", 3,),
    [target, Exps.Int(BigInt(arity)), Exps.Int(BigInt(args.length))],
  )

  for (const [index, arg] of args.entries()) {
    result = Exps.Apply(
      Exps.PrimitiveRef("curry-put!", 3,),
      [Exps.Int(BigInt(index)), arg, result],
    )
  }

  return result
}
