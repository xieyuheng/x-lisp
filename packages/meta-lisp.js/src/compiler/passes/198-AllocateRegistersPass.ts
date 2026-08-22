import * as X86 from "../../x86/index.ts"

export type HomeInfo = {
  locations: Map<string, X86.Operand>
}

export function AllocateRegistersPass(mod: X86.Mod): void {
  //
}
