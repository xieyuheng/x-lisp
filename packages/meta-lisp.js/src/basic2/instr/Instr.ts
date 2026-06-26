import { type Operand } from "../operand/index.ts"
import {
  type Type,
  ArrowType,
  BoolType,
  Float64Type,
  Int64Type,
  PointerType,
  ValueType,
  VoidType,
} from "../type/index.ts"

export type Instr =
  | BinaryInstr
  | UnaryInstr
  | LoadInstr
  | StoreInstr
  | CallInstr
  | ApplyInstr
  | SizeOfInstr
  | OffsetOfInstr

export type BinaryInstr = {
  kind: "BinaryInstr"
  dest: string
  type: Type
  op: string
  left: Operand
  right: Operand
}

export function BinaryInstr(
  dest: string,
  type: Type,
  op: string,
  left: Operand,
  right: Operand,
): BinaryInstr {
  return { kind: "BinaryInstr", dest, type, op, left, right }
}

export type UnaryInstr = {
  kind: "UnaryInstr"
  dest: string
  type: Type
  op: string
  operand: Operand
}

export function UnaryInstr(
  dest: string,
  type: Type,
  op: string,
  operand: Operand,
): UnaryInstr {
  return { kind: "UnaryInstr", dest, type, op, operand }
}

export type LoadInstr = {
  kind: "LoadInstr"
  dest: string
  type: Type
  pointer: Operand
}

export function LoadInstr(
  dest: string,
  type: Type,
  pointer: Operand,
): LoadInstr {
  return { kind: "LoadInstr", dest, type, pointer }
}

export type StoreInstr = {
  kind: "StoreInstr"
  type: Type
  pointer: Operand
  value: Operand
}

export function StoreInstr(
  type: Type,
  pointer: Operand,
  value: Operand,
): StoreInstr {
  return { kind: "StoreInstr", type, pointer, value }
}

export type CallInstr = {
  kind: "CallInstr"
  dest: string
  type: Type
  target: Operand
  operands: Array<Operand>
}

export function CallInstr(
  dest: string,
  type: Type,
  target: Operand,
  operands: Array<Operand>,
): CallInstr {
  return { kind: "CallInstr", dest, type, target, operands }
}

export type ApplyInstr = {
  kind: "ApplyInstr"
  dest: string
  type: Type
  target: Operand
  operands: Array<Operand>
}

export function ApplyInstr(
  dest: string,
  type: Type,
  target: Operand,
  operands: Array<Operand>,
): ApplyInstr {
  return { kind: "ApplyInstr", dest, type, target, operands }
}

export type SizeOfInstr = {
  kind: "SizeOfInstr"
  dest: string
  targetType: Type
}

export function SizeOfInstr(dest: string, targetType: Type): SizeOfInstr {
  return { kind: "SizeOfInstr", dest, targetType }
}

export type OffsetOfInstr = {
  kind: "OffsetOfInstr"
  dest: string
  structType: Type
  path: Array<string>
}

export function OffsetOfInstr(
  dest: string,
  structType: Type,
  path: Array<string>,
): OffsetOfInstr {
  return { kind: "OffsetOfInstr", dest, structType, path }
}

export const binaryOpNames: Set<string> = new Set([
  "iadd",
  "isub",
  "imul",
  "idiv",
  "fadd",
  "fsub",
  "fmul",
  "fdiv",
  "shl",
  "shr",
  "bitand",
  "bitor",
  "bitxor",
  "padd",
  "and",
  "or",
  "xor",
  "icmp-eq",
  "icmp-ne",
  "icmp-lt",
  "icmp-le",
  "icmp-gt",
  "icmp-ge",
  "fcmp-eq",
  "fcmp-ne",
  "fcmp-lt",
  "fcmp-le",
  "fcmp-gt",
  "fcmp-ge",
  "bool-eq",
  "bool-ne",
  "pointer-eq",
  "pointer-ne",
  "value-eq",
  "value-ne",
])

export const knownBinaryOps: Record<string, Type> = {
  iadd: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  isub: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  imul: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  idiv: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  fadd: ArrowType([Float64Type(), Float64Type()], Float64Type()),
  fsub: ArrowType([Float64Type(), Float64Type()], Float64Type()),
  fmul: ArrowType([Float64Type(), Float64Type()], Float64Type()),
  fdiv: ArrowType([Float64Type(), Float64Type()], Float64Type()),
  shl: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  shr: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  bitand: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  bitor: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  bitxor: ArrowType([Int64Type(), Int64Type()], Int64Type()),
  padd: ArrowType([PointerType(), Int64Type()], PointerType()),
  and: ArrowType([BoolType(), BoolType()], BoolType()),
  or: ArrowType([BoolType(), BoolType()], BoolType()),
  xor: ArrowType([BoolType(), BoolType()], BoolType()),
  "icmp-eq": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "icmp-ne": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "icmp-lt": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "icmp-le": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "icmp-gt": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "icmp-ge": ArrowType([Int64Type(), Int64Type()], BoolType()),
  "fcmp-eq": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "fcmp-ne": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "fcmp-lt": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "fcmp-le": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "fcmp-gt": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "fcmp-ge": ArrowType([Float64Type(), Float64Type()], BoolType()),
  "bool-eq": ArrowType([BoolType(), BoolType()], BoolType()),
  "bool-ne": ArrowType([BoolType(), BoolType()], BoolType()),
  "pointer-eq": ArrowType([PointerType(), PointerType()], BoolType()),
  "pointer-ne": ArrowType([PointerType(), PointerType()], BoolType()),
  "value-eq": ArrowType([ValueType(), ValueType()], BoolType()),
  "value-ne": ArrowType([ValueType(), ValueType()], BoolType()),
}

export const unaryOpNames: Set<string> = new Set([
  "not",
  "tag-int",
  "tag-float",
  "tag-bool",
  "to-int64",
  "to-float64",
  "to-bool",
  "const",
])

export const knownUnaryOps: Record<string, Type> = {
  not: ArrowType([BoolType()], BoolType()),
  "tag-int": ArrowType([Int64Type()], ValueType()),
  "tag-float": ArrowType([Float64Type()], ValueType()),
  "tag-bool": ArrowType([BoolType()], ValueType()),
  "to-int64": ArrowType([ValueType()], Int64Type()),
  "to-float64": ArrowType([ValueType()], Float64Type()),
  "to-bool": ArrowType([ValueType()], BoolType()),
  const: ArrowType([VoidType()], VoidType()),
}
