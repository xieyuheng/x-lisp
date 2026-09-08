import * as B from "../../basic/index.ts"

export type SsaAnalysisReport = {
  ssaGraphs: Map<string, B.SsaGraph>
}

export function SsaAnalysisPass(program: B.Program): SsaAnalysisReport {
  const ssaGraphs = new Map<string, B.SsaGraph>()

  for (const definition of program.definitions.values()) {
    if (definition.kind === "FunctionDefinition") {
      const blocks = Array.from(definition.blocks.values())
      const graph = B.buildSsaGraph(blocks)
      ssaGraphs.set(definition.name, graph)
    }
  }

  return { ssaGraphs }
}

export function formatSsaAnalysisReport(report: SsaAnalysisReport): string {
  const lines: Array<string> = []
  lines.push("(ssa-analysis-report")

  const entries = [...report.ssaGraphs].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  )

  for (const [name, graph] of entries) {
    lines.push(`  (ssa-graph ${name}`)
    const graphLines = B.formatSsaGraph(graph)
    for (const line of graphLines) {
      lines.push(`    ${line}`)
    }
    closeTop(lines)
  }

  closeTop(lines)

  return lines.join("\n")
}

function closeTop(lines: Array<string>): void {
  const i = lines.length - 1
  lines[i] = lines[i] + ")"
}
