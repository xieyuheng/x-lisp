import { type Block } from "../block/index.ts"
import { type Cell } from "../cell/index.ts"
import { type Instr } from "../instr/index.ts"

export type CellInfo = {
  id: string
  block: Block
  definedBy: { instr: Instr; outputIndex: number }
  usedBy: Array<{ instr: Instr; inputIndex: number }>
}

export type UseSiteInfo = {
  id: string
  block: Block
  useInstr: Instr
  providedBy: Array<{ instr: Instr; block: Block }>
}

export type SsaGraph = {
  cellInfos: Map<string, CellInfo>
  useSiteInfos: Map<string, UseSiteInfo>
}
