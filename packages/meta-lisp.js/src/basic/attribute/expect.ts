import type { Type } from "../type/index.ts"
import type { Attribute } from "./Attribute.ts"

function expectAttribute(
  attributes: Record<string, Attribute>,
  key: string,
): Attribute {
  const attribute = attributes[key]
  if (!attribute) {
    throw new Error(`[expectAttribute] missing attribute "${key}"`)
  }
  return attribute
}

export function expectInt(
  attributes: Record<string, Attribute>,
  key: string,
): bigint {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "IntAttribute") {
    throw new Error(
      `[expectInt] expected IntAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}

export function expectBool(
  attributes: Record<string, Attribute>,
  key: string,
): boolean {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "BoolAttribute") {
    throw new Error(
      `[expectBool] expected BoolAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}

export function expectSymbol(
  attributes: Record<string, Attribute>,
  key: string,
): string {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "SymbolAttribute") {
    throw new Error(
      `[expectSymbol] expected SymbolAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}

export function expectString(
  attributes: Record<string, Attribute>,
  key: string,
): string {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "StringAttribute") {
    throw new Error(
      `[expectString] expected StringAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}

export function expectFloat(
  attributes: Record<string, Attribute>,
  key: string,
): number {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "FloatAttribute") {
    throw new Error(
      `[expectFloat] expected FloatAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}

export function expectType(
  attributes: Record<string, Attribute>,
  key: string,
): Type {
  const attribute = expectAttribute(attributes, key)
  if (attribute.kind !== "TypeAttribute") {
    throw new Error(
      `[expectType] expected TypeAttribute for "${key}", got ${attribute.kind}`,
    )
  }
  return attribute.content
}
