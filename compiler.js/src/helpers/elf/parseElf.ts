import * as b from "../binary/index.ts"
import type { Elf } from "./Elf.ts"

export function parseElf(buffer: ArrayBuffer): Elf {
  return b.decode(buffer, b.Sequence([]))
}
