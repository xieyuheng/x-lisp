import type { Instr } from "../instr/index.ts"
import type { CellInfo, SsaGraph } from "./SsaGraph.ts"

export type Use = {
  instr: Instr
  inputIndex: number
}

export function ssaGetCellInfo(
  graph: SsaGraph,
  cellId: string,
): CellInfo | undefined {
  return graph.cellInfos.get(cellId)
}

export function ssaGetSoleUser(
  graph: SsaGraph,
  cellId: string,
): Instr | undefined {
  const info = graph.cellInfos.get(cellId)
  if (info && info.usedBy.length === 1) {
    return info.usedBy[0].instr
  }
  return undefined
}

export function ssaGetSoleUse(
  graph: SsaGraph,
  cellId: string,
): Use | undefined {
  const info = graph.cellInfos.get(cellId)
  if (info && info.usedBy.length === 1) {
    return info.usedBy[0]
  }
  return undefined
}

export function ssaGetUsers(graph: SsaGraph, cellId: string): Array<Instr> {
  const info = graph.cellInfos.get(cellId)
  if (!info) return []
  return info.usedBy.map((use) => use.instr)
}

export function ssaGetUses(graph: SsaGraph, cellId: string): Array<Use> {
  const info = graph.cellInfos.get(cellId)
  if (!info) return []
  return info.usedBy
}
