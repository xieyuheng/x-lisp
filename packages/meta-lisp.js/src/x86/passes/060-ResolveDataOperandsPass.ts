import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

let anonCounter = 0

export function ResolveDataOperandsPass(mod: X86.Mod): void {
  for (const definition of mod.definitions.values()) {
    if (definition.kind !== "CodeDefinition") continue
    for (const block of definition.blocks) {
      for (let i = 0; i < block.instrs.length; i++) {
        const instr = block.instrs[i]
        const newOperands = instr.operands.map((op) =>
          resolveDataOperand(mod, op),
        )
        block.instrs[i] = X86.Instr(instr.op, newOperands, instr.location)
      }
    }
  }
}

function resolveDataOperand(mod: X86.Mod, op: X86.Operand): X86.Operand {
  if (op.kind !== "DataOperand") return op

  const value = X86.evaluate(mod, X86.emptyEnv(), op.exp)

  if (value.kind === "IntValue") {
    return X86.ImmOperand(value.value, op.location)
  }

  if (value.kind === "AddressValue") {
    return X86.AddressOperand(value.name, op.location)
  }

  if (value.kind === "StringValue") {
    const anonName = `%data-${anonCounter++}`
    mod.definitions.set(
      anonName,
      X86.DataDefinition(
        anonName,
        X86.PointerExp(op.exp, op.location),
        op.location,
      ),
    )
    return X86.DerefOperand(
      X86.AddressOperand(anonName, op.location),
      op.location,
    )
  }

  if (value.kind === "PointerValue") {
    const anonName = `%data-${anonCounter++}`
    mod.definitions.set(
      anonName,
      X86.DataDefinition(anonName, op.exp, op.location),
    )
    return X86.DerefOperand(
      X86.AddressOperand(anonName, op.location),
      op.location,
    )
  }
  if (value.kind === "StructValue") {
    let message =
      `bare struct in operand is not supported; use (pointer (struct ...)) or (address name)`
    throw new S.ErrorWithSourceLocation(message, op.location)
  }

  if (value.kind === "ArrayValue") {
    let message =
      `bare array in operand is not supported; use (pointer (array ...)) or (address name)`
    throw new S.ErrorWithSourceLocation(message, op.location)
  }
  if (value.kind === "TypeValue") {
    let message = `type values are not allowed in operand position`
    throw new S.ErrorWithSourceLocation(message, op.location)
  }

  let message = `unexpected value kind in data operand`
  throw new S.ErrorWithSourceLocation(message, op.location)
}
