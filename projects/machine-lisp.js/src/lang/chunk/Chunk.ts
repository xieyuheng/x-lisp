import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Directive } from "../directive/index.ts"

export type Chunk = {
  label: string
  directives: Array<Directive>
  meta?: Meta
}

export function Chunk(
  label: string,
  directives: Array<Directive>,
  meta?: Meta,
): Chunk {
  return {
    label,
    directives,
    meta,
  }
}
