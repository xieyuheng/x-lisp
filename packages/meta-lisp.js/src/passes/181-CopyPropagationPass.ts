import * as B from "../basic/index.ts"
import { copyPropagation } from "../basic/optimize/index.ts"

// 在 x86 管线（180 之后、185 之前）消除 180-ExplicateControlPass2
// 生成的冗余 copy 指令。算法见 basic/optimize/copyPropagation.ts。
// 必须在 185-SsaAnalysisPass 之前运行，使 SSA 图基于传播后的 IR 构建。

export function CopyPropagationPass(basicMod: B.Mod): B.Mod {
  copyPropagation(basicMod)

  return basicMod
}
