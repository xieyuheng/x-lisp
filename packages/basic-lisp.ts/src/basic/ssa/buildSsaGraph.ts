import { expectSymbol } from "../attribute/index.ts"
import { type Block } from "../block/index.ts"
import { type CellInfo, type SsaGraph, type UseSiteInfo } from "./SsaGraph.ts"

export function buildSsaGraph(blocks: Array<Block>): SsaGraph {
  const cellInfos: Map<string, CellInfo> = new Map()
  const useSiteInfos: Map<string, UseSiteInfo> = new Map()

  for (const block of blocks) {
    setupCells(block, cellInfos)
    setupUseSites(block, useSiteInfos)
  }

  for (const block of blocks) {
    setupUses(block, cellInfos)
    setupProvides(block, useSiteInfos)
  }

  return { cellInfos, useSiteInfos }
}

function setupCells(block: Block, cellInfos: Map<string, CellInfo>): void {
  for (const instr of block.instrs) {
    for (let i = 0; i < instr.output.length; i++) {
      const cell = instr.output[i]
      cellInfos.set(cell.id, {
        id: cell.id,
        block,
        definedBy: { instr, outputIndex: i },
        usedBy: [],
      })
    }
  }
}

function setupUseSites(
  block: Block,
  useSiteInfos: Map<string, UseSiteInfo>,
): void {
  for (const instr of block.instrs) {
    if (instr.op === "use" && instr.output.length === 1) {
      const cell = instr.output[0]
      useSiteInfos.set(cell.id, {
        id: cell.id,
        block,
        useInstr: instr,
        providedBy: [],
      })
    }
  }
}

function setupUses(block: Block, cellInfos: Map<string, CellInfo>): void {
  for (const instr of block.instrs) {
    for (let i = 0; i < instr.input.length; i++) {
      const cell = instr.input[i]
      const info = cellInfos.get(cell.id)
      if (info) {
        info.usedBy.push({ instr, inputIndex: i })
      }
    }
  }
}

function setupProvides(
  block: Block,
  useSiteInfos: Map<string, UseSiteInfo>,
): void {
  for (const instr of block.instrs) {
    if (instr.op === "provide" && instr.input.length >= 1) {
      const siteId = expectSymbol(instr.attributes, "use-site")
      const siteInfo = useSiteInfos.get(siteId)
      if (siteInfo) {
        siteInfo.providedBy.push({ instr, block })
      }
    }
  }
}
