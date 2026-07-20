import { formatInstr } from "./formatInstr.ts"
import { type SsaGraph } from "../ssa/index.ts"

export function formatSsaGraph(graph: SsaGraph): Array<string> {
  const lines: Array<string> = []
  lines.push("(cells")

  const sortedCellInfos = [...graph.cellInfos].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  )

  for (const [, info] of sortedCellInfos) {
    lines.push(`  (cell ${info.id}`)
    lines.push(`    (block ${info.block.label})`)
    lines.push(`    (defined-by ${formatInstr(info.definedBy.instr)})`)

    if (info.usedBy.length === 0) {
      lines.push(`    (used-by)`)
    } else {
      lines.push(`    (used-by`)
      for (const use of info.usedBy) {
        lines.push(`      ${formatInstr(use.instr)}`)
      }
      closeTop(lines)
    }

    closeTop(lines)
  }

  closeTop(lines)
  lines.push("(use-sites")

  const sortedUseSiteInfos = [...graph.useSiteInfos].sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
  )

  for (const [, info] of sortedUseSiteInfos) {
    lines.push(`  (use-site ${info.id}`)
    lines.push(`    (block ${info.block.label})`)
    lines.push(`    (use-instr ${formatInstr(info.useInstr)})`)

    if (info.providedBy.length === 0) {
      lines.push(`    (provided-by)`)
    } else {
      lines.push(`    (provided-by`)
      for (const p of info.providedBy) {
        lines.push(`      (${p.block.label} ${formatInstr(p.instr)})`)
      }
      closeTop(lines)
    }

    closeTop(lines)
  }

  closeTop(lines)

  return lines
}

function closeTop(lines: Array<string>): void {
  const i = lines.length - 1
  lines[i] = lines[i] + ")"
}
