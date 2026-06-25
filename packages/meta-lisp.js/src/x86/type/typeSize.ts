import { type Type } from "./Type.ts"

export function typeSize(type: Type): number {
  return type.typeConstructor.size()
}
