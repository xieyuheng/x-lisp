import * as B from "../../basic/index.ts"

// copy propagation：消除冗余的 copy 指令。
//
// basic IR 是 SSA 形式（每个 cell 单次定义），let 绑定被编译为 copy：
//   (= unnested.1 (copy value.4))
//   (= value.3 (call unnested.1 ...))
// 当 copy 的源 cell 只被这一条 copy 使用（usedBy.length === 1）时，
// src 的定义点支配 dst 的所有使用点，替换是安全的：
// 把 dst 的所有 use 替换为 src，删除该 copy。
// 链式 copy（a → b → c）随遍历顺序累积消除。
//
// 不处理 provide/use：
//   provide/use 是跨分支汇合点（phi），其值由运行时分支决定，
//   无法静态替换为单一来源，需寄存器合并（coalescing）消除。

export function CopyPropagationPass(mod: B.Mod): void {
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "FunctionDefinition") continue
    copyPropagateFunction(definition)
  }
}

function copyPropagateFunction(definition: B.FunctionDefinition): void {
  const blocks = Array.from(definition.blocks.values())
  const graph = B.buildSsaGraph(blocks)

  for (const block of blocks) {
    const newInstrs: Array<B.Instr> = []
    for (const instr of block.instrs) {
      if (instr.op !== "copy") {
        newInstrs.push(instr)
        continue
      }

      const src = instr.input[0]
      const dst = instr.output[0]
      const srcInfo = graph.cellInfos.get(src.id)
      if (srcInfo === undefined || srcInfo.usedBy.length !== 1) {
        newInstrs.push(instr)
        continue
      }

      const dstInfo = graph.cellInfos.get(dst.id)
      if (dstInfo === undefined) {
        newInstrs.push(instr)
        continue
      }

      for (const { instr: user, inputIndex } of dstInfo.usedBy) {
        user.input[inputIndex] = src
      }
    }
    block.instrs = newInstrs
  }
}
