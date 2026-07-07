import { type Attribute } from "../attribute/index.ts"
import { type Cell } from "../cell/index.ts"
import {
  ArrowType,
  BoolType,
  Float64Type,
  Int64Type,
  PointerType,
  ValueType,
} from "../type/index.ts"

export type Instr = {
  output: Array<Cell>
  op: string
  input: Array<Cell>
  attributes: Record<string, Attribute>
}

export function Instr(
  output: Array<Cell>,
  op: string,
  input: Array<Cell>,
  attributes: Record<string, Attribute>,
): Instr {
  return { output, op, input, attributes }
}

export const knownOps: Record<string, ArrowType> = {
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
  not: ArrowType([BoolType()], BoolType()),
  "tag-int": ArrowType([Int64Type()], ValueType()),
  "tag-float": ArrowType([Float64Type()], ValueType()),
  "tag-bool": ArrowType([BoolType()], ValueType()),
  "to-int64": ArrowType([ValueType()], Int64Type()),
  "to-float64": ArrowType([ValueType()], Float64Type()),
  "to-bool": ArrowType([ValueType()], BoolType()),
  int64: ArrowType([], Int64Type()),
  float64: ArrowType([], Float64Type()),
  bool: ArrowType([], BoolType()),
  address: ArrowType([], PointerType()),
  symbol: ArrowType([], PointerType()),
  keyword: ArrowType([], PointerType()),
  string: ArrowType([], PointerType()),
  "symbol-value": ArrowType([], ValueType()),
  "keyword-value": ArrowType([], ValueType()),
  "string-value": ArrowType([], ValueType()),
}
