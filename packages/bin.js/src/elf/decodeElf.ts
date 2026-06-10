import * as Bin from "../bin/index.ts"
import type { Elf } from "./Elf.ts"
import { ElfSchema } from "./ElfSchema.ts"

export function decodeElf(buffer: ArrayBuffer): Elf {
  return Bin.decode(buffer, ElfSchema)
}
