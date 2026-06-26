import * as B from "../index.ts"
import { formatOperand } from "./formatOperand.ts"
import { formatType } from "./formatType.ts"

export function formatInstr(instr: B.Instr): string {
  switch (instr.kind) {
    case "BinaryInstr":
      return `(= ${instr.dest} ${formatType(instr.type)} (${instr.op} ${formatOperand(instr.left)} ${formatOperand(instr.right)}))`

    case "UnaryInstr":
      return `(= ${instr.dest} ${formatType(instr.type)} (${instr.op} ${formatOperand(instr.operand)}))`

    case "LoadInstr":
      return `(= ${instr.dest} ${formatType(instr.type)} (load ${formatOperand(instr.pointer)}))`

    case "StoreInstr":
      return `(store ${formatType(instr.type)} ${formatOperand(instr.pointer)} ${formatOperand(instr.value)})`

    case "CallInstr":
      return `(= ${instr.dest} ${formatType(instr.type)} (call ${formatOperand(instr.target)} ${instr.operands.map(formatOperand).join(" ")}))`

    case "ApplyInstr":
      return `(= ${instr.dest} ${formatType(instr.type)} (apply ${formatOperand(instr.target)} ${instr.operands.map(formatOperand).join(" ")}))`

    case "SizeOfInstr":
      return `(= ${instr.dest} int64-t (size-of ${formatType(instr.targetType)}))`

    case "OffsetOfInstr":
      return `(= ${instr.dest} int64-t (offset-of ${formatType(instr.structType)} (${instr.path.join(" ")})))`
  }
}
