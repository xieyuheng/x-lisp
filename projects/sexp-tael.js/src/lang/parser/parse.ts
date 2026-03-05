import { type Sexp } from "../sexp/index.ts"
import { Parser, type ParserMeta } from "./Parser.ts"

export function parseSexps(text: string, meta: ParserMeta = {}): Array<Sexp> {
  return new Parser().parse(text, meta)
}

export function parseSexp(text: string, meta: ParserMeta = {}): Sexp {
  const array = parseSexps(text, meta)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseSexp] expecting one sexp, but found multiple sexp\n`
  throw new Error(message)
}
