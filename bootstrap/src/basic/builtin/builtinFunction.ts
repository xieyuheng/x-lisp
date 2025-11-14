// import { definePrimitiveFunction, provide } from "../define/index.ts"
// import { apply } from "../execute/index.ts"
// import { applyNullary } from "../execute/index.ts"
// import { type Mod } from "../mod/index.ts"
// import * as Values from "../value/index.ts"

// export function builtinFunction(mod: Mod) {
//   provide(mod, ["apply-nullary", "apply-unary"])

//   definePrimitiveFunction(mod, "apply-nullary", 1, (f) => {
//     return applyNullary(f)
//   })

//   definePrimitiveFunction(mod, "apply-unary", 2, (f, arg) => {
//     return apply(f, arg)
//   })
// }
