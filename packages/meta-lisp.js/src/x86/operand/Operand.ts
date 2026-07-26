import type { Data } from "../data/index.ts"

export type Operand =
  | RegOperand
  | ImmOperand
  | FloatOperand
  | LabelOperand
  | AddressOperand
  | DerefOperand
  | RegDerefOperand
  | CcOperand
  | VarOperand
  | ExternOperand
  | RelocationOperand
  | DataOperand

export type RegOperand = {
  kind: "RegOperand"
  name: string
}

export function RegOperand(name: string): RegOperand {
  return {
    kind: "RegOperand",
    name,
  }
}

export type ImmOperand = {
  kind: "ImmOperand"
  value: bigint
}

export function ImmOperand(value: bigint): ImmOperand {
  return {
    kind: "ImmOperand",
    value,
  }
}

export type FloatOperand = {
  kind: "FloatOperand"
  value: number
}

export function FloatOperand(value: number): FloatOperand {
  return {
    kind: "FloatOperand",
    value,
  }
}

export type LabelOperand = {
  kind: "LabelOperand"
  name: string
}

export function LabelOperand(name: string): LabelOperand {
  return {
    kind: "LabelOperand",
    name,
  }
}

export type AddressOperand = {
  kind: "AddressOperand"
  name: string
}

export function AddressOperand(name: string): AddressOperand {
  return {
    kind: "AddressOperand",
    name,
  }
}

export type Displacement = IntDisplacement | OffsetOfDisplacement

export type IntDisplacement = {
  kind: "IntDisplacement"
  value: bigint
}

export function IntDisplacement(value: bigint): IntDisplacement {
  return {
    kind: "IntDisplacement",
    value,
  }
}

export type OffsetOfDisplacement = {
  kind: "OffsetOfDisplacement"
  structType: string
  fields: Array<string>
}

export function OffsetOfDisplacement(
  structType: string,
  fields: Array<string>,
): OffsetOfDisplacement {
  return {
    kind: "OffsetOfDisplacement",
    structType,
    fields,
  }
}

export type DerefOperand = {
  kind: "DerefOperand"
  address: AddressOperand
}

export function DerefOperand(address: AddressOperand): DerefOperand {
  return {
    kind: "DerefOperand",
    address,
  }
}

export type RegDerefOperand = {
  kind: "RegDerefOperand"
  base: string
  index: string | undefined
  scale: bigint | undefined
  disp: Displacement | undefined
}

export function RegDerefOperand(
  base: string,
  index: string | undefined,
  scale: bigint | undefined,
  disp: Displacement | undefined,
): RegDerefOperand {
  return {
    kind: "RegDerefOperand",
    base,
    index,
    scale,
    disp,
  }
}

export type CcOperand = {
  kind: "CcOperand"
  code: string
}

export function CcOperand(code: string): CcOperand {
  return {
    kind: "CcOperand",
    code,
  }
}

export type VarOperand = {
  kind: "VarOperand"
  name: string
}

export function VarOperand(name: string): VarOperand {
  return {
    kind: "VarOperand",
    name,
  }
}

export type ExternOperand = {
  kind: "ExternOperand"
  name: string
}

export function ExternOperand(name: string): ExternOperand {
  return {
    kind: "ExternOperand",
    name,
  }
}

export type RelocationOperand = {
  kind: "RelocationOperand"
  type: string
  name: string
}

export function RelocationOperand(
  type: string,
  name: string,
): RelocationOperand {
  return {
    kind: "RelocationOperand",
    type,
    name,
  }
}

export type DataOperand = {
  kind: "DataOperand"
  data: Data
}

export function DataOperand(data: Data): DataOperand {
  return {
    kind: "DataOperand",
    data,
  }
}
