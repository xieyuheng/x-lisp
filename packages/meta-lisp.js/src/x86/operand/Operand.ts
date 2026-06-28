import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Operand =
  | RegOperand
  | ImmOperand
  | LabelOperand
  | AddressOperand
  | DerefOperand
  | RegDerefOperand
  | CcOperand
  | VarOperand
  | ExternalLabelOperand
  | DataOperand

export type RegOperand = {
  kind: "RegOperand"
  name: string
  location: SourceLocation
}

export function RegOperand(name: string, location: SourceLocation): RegOperand {
  return {
    kind: "RegOperand",
    name,
    location,
  }
}

export type ImmOperand = {
  kind: "ImmOperand"
  value: bigint
  location: SourceLocation
}

export function ImmOperand(
  value: bigint,
  location: SourceLocation,
): ImmOperand {
  return {
    kind: "ImmOperand",
    value,
    location,
  }
}

export type LabelOperand = {
  kind: "LabelOperand"
  name: string
  location: SourceLocation
}

export function LabelOperand(
  name: string,
  location: SourceLocation,
): LabelOperand {
  return {
    kind: "LabelOperand",
    name,
    location,
  }
}

export type AddressOperand = {
  kind: "AddressOperand"
  name: string
  location: SourceLocation
}

export function AddressOperand(
  name: string,
  location: SourceLocation,
): AddressOperand {
  return {
    kind: "AddressOperand",
    name,
    location,
  }
}

export type Displacement = IntDisplacement | OffsetOfDisplacement

export type IntDisplacement = {
  kind: "IntDisplacement"
  value: bigint
  location: SourceLocation
}

export function IntDisplacement(
  value: bigint,
  location: SourceLocation,
): IntDisplacement {
  return {
    kind: "IntDisplacement",
    value,
    location,
  }
}

export type OffsetOfDisplacement = {
  kind: "OffsetOfDisplacement"
  structType: string
  fields: Array<string>
  location: SourceLocation
}

export function OffsetOfDisplacement(
  structType: string,
  fields: Array<string>,
  location: SourceLocation,
): OffsetOfDisplacement {
  return {
    kind: "OffsetOfDisplacement",
    structType,
    fields,
    location,
  }
}

export type DerefOperand = {
  kind: "DerefOperand"
  address: AddressOperand
  location: SourceLocation
}

export function DerefOperand(
  address: AddressOperand,
  location: SourceLocation,
): DerefOperand {
  return {
    kind: "DerefOperand",
    address,
    location,
  }
}

export type RegDerefOperand = {
  kind: "RegDerefOperand"
  base: string
  index: string | undefined
  scale: bigint | undefined
  disp: Displacement | undefined
  location: SourceLocation
}

export function RegDerefOperand(
  base: string,
  index: string | undefined,
  scale: bigint | undefined,
  disp: Displacement | undefined,
  location: SourceLocation,
): RegDerefOperand {
  return {
    kind: "RegDerefOperand",
    base,
    index,
    scale,
    disp,
    location,
  }
}

export type CcOperand = {
  kind: "CcOperand"
  code: string
  location: SourceLocation
}

export function CcOperand(code: string, location: SourceLocation): CcOperand {
  return {
    kind: "CcOperand",
    code,
    location,
  }
}

export type VarOperand = {
  kind: "VarOperand"
  name: string
  location: SourceLocation
}

export function VarOperand(name: string, location: SourceLocation): VarOperand {
  return {
    kind: "VarOperand",
    name,
    location,
  }
}

export type ExternalLabelOperand = {
  kind: "ExternalLabelOperand"
  name: string
  location: SourceLocation
}

export function ExternalLabelOperand(
  name: string,
  location: SourceLocation,
): ExternalLabelOperand {
  return {
    kind: "ExternalLabelOperand",
    name,
    location,
  }
}

export type DataOperand = {
  kind: "DataOperand"
  exp: Exp
  location: SourceLocation
}

export function DataOperand(exp: Exp, location: SourceLocation): DataOperand {
  return {
    kind: "DataOperand",
    exp,
    location,
  }
}
