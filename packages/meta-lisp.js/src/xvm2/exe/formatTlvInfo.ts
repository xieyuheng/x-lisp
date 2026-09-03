import { decodeTlv } from "../../tlv/index.ts"
import {
  decodeFunctionDefinition,
  decodeFunctionFixupTable,
  decodeNameTable,
  decodePrimitiveFunctionDeclaration,
  decodePrimitiveVariableDeclaration,
  decodeVariableDeclaration,
} from "./decodeExe.ts"
import { ExeTags, type NameTable } from "./Exe.ts"

const TagNames: Record<number, string> = {
  [ExeTags.NameTable]: "name-table",
  [ExeTags.FunctionDefinition]: "function-definition",
  [ExeTags.VariableDeclaration]: "variable-declaration",
  [ExeTags.PrimitiveFunctionDeclaration]: "primitive-function-declaration",
  [ExeTags.PrimitiveVariableDeclaration]: "primitive-variable-declaration",
  [ExeTags.FunctionFixupTable]: "function-fixup-table",
}

export function formatTlvInfo(bytes: Uint8Array): string {
  const tlv = decodeTlv(bytes)
  const nameTable = findNameTable(tlv.entries)

  const lines: Array<string> = []
  for (const entry of tlv.entries) {
    const tagName = TagNames[entry.tag] ?? "unknown"
    lines.push(`0x${entry.tag.toString(16).padStart(2, "0")} ${tagName} ${entry.value.byteLength}`)

    switch (entry.tag) {
      case ExeTags.NameTable: {
        if (nameTable !== undefined) {
          for (const name of nameTable.names) {
            lines.push(`  "${name}"`)
          }
        }
        break
      }

      case ExeTags.FunctionDefinition: {
        if (nameTable === undefined) break
        const fn = decodeFunctionDefinition(nameTable, entry.value)
        lines.push(`  name: ${fn.name}`)
        lines.push(`  arity: ${fn.arity}`)
        lines.push(`  local-count: ${fn.localNames.length}`)
        lines.push(`  code-length: ${fn.code.byteLength}`)
        lines.push(`  local-names: (${fn.localNames.join(" ")})`)
        lines.push(`  labels: (${fn.labels.map((label) => `${label.name} ${label.offset}`).join(" ")})`)
        break
      }

      case ExeTags.VariableDeclaration: {
        break
      }

      case ExeTags.PrimitiveFunctionDeclaration: {
        break
      }

      case ExeTags.PrimitiveVariableDeclaration: {
        break
      }

      case ExeTags.FunctionFixupTable: {
        if (nameTable === undefined) break
        const table = decodeFunctionFixupTable(nameTable, entry.value)
        for (const fixup of table.fixups) {
          lines.push(`  (fixup ${fixup.type} ${fixup.name}) -> ${fixup.destName}:${fixup.destOffset}`)
        }
        break
      }
    }
  }

  return lines.join("\n") + "\n"
}

function findNameTable(
  entries: Array<{ tag: number; value: Uint8Array }>,
): NameTable | undefined {
  const entry = entries.find((candidate) => candidate.tag === ExeTags.NameTable)
  if (entry === undefined) {
    return undefined
  }

  return decodeNameTable(entry.value)
}