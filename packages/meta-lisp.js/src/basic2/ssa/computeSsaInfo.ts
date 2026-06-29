import { type FunctionDefinition } from "../definition/index.ts"
import { type SsaInfo, type SsaNode } from "./SsaInfo.ts"

export function computeSsaInfo(fn: FunctionDefinition): SsaInfo {
  const nodes = new Map<string, SsaNode>()
  const providers = new Map<string, string[]>()

  for (const block of fn.blocks) {
    for (const instr of block.instrs) {
      nodes.set(instr.id, {
        instr,
        label: block.label,
        usedBy: [],
      })
    }
  }

  for (const block of fn.blocks) {
    for (const instr of block.instrs) {
      for (const op of instr.operands) {
        if (op.kind === "VarOperand" || op.kind === "AddressOperand") {
          const targetNode = nodes.get(op.name)
          if (targetNode) {
            targetNode.usedBy.push(instr.id)
          }
        }
      }
    }
  }

  for (const block of fn.blocks) {
    for (const instr of block.instrs) {
      if (instr.op === "provide") {
        const useSiteAttr = instr.attributes[":use-site"]
        if (useSiteAttr && useSiteAttr.kind === "SymbolAttribute") {
          const site = useSiteAttr.value
          if (!providers.has(site)) {
            providers.set(site, [])
          }
          providers.get(site)!.push(instr.id)
        }
      }
    }
  }

  return { nodes, providers }
}
