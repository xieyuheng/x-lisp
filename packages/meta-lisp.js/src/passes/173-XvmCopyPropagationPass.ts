import { copyPropagation } from "../basic/optimize/index.ts"
import { type XvmExplicateReport } from "./170-XvmExplicateControlPass.ts"

// 在 XVM 管线（170 之后、175 之前）消除 170-XvmExplicateControlPass
// 生成的冗余 copy 指令。算法见 basic/optimize/copyPropagation.ts。

export function XvmCopyPropagationPass(
  result: XvmExplicateReport,
): XvmExplicateReport {
  copyPropagation(result.mod)

  return result
}
