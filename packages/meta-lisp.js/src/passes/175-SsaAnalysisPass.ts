import fs from "node:fs"
import Path from "node:path"
import * as B from "../basic/index.ts"
import * as Pkg from "../package/index.ts"

export type SsaAnalysisReport = {
  ssaGraphs: Map<string, B.SsaGraph>
}

export function SsaAnalysisPass(
  pkg: Pkg.Package,
  basicMod: B.Mod,
): SsaAnalysisReport {
  const ssaGraphs = new Map<string, B.SsaGraph>()

  for (const definition of basicMod.definitions.values()) {
    if (definition.kind === "FunctionDefinition") {
      const blocks = Array.from(definition.blocks.values())
      const graph = B.buildSsaGraph(blocks)
      ssaGraphs.set(definition.name, graph)
    }
  }

  const report: SsaAnalysisReport = { ssaGraphs }

  if (pkg.config.compiler.dump) {
    dumpSsaAnalysisReport(report, pkg)
  }

  return report
}

function dumpSsaAnalysisReport(
  report: SsaAnalysisReport,
  pkg: Pkg.Package,
): void {
  const dir = Path.join(Pkg.packageOutputDirectory(pkg), "dump")
  fs.mkdirSync(dir, { recursive: true })
  const file = Path.join(dir, "175-ssa-analysis-report.huge.dump")
  const content = formatSsaAnalysisReport(report)
  fs.writeFileSync(file, content + "\n", "utf-8")
}

function formatSsaAnalysisReport(report: SsaAnalysisReport): string {
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
