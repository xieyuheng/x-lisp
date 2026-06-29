import { type Instr } from "../instr/index.ts"

export type SsaInfo = {
  nodes: Map<string, SsaNode>
  providers: Map<string, string[]>
}

export type SsaNode = {
  instr: Instr
  label: string
  usedBy: string[]
}
