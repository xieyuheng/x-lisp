import { type Sexp } from "../sexp/index.ts"
import { Parser, type ParserOptions } from "./Parser.ts"

export function parseSexps(text: string, options: ParserOptions): Array<Sexp> {
  return new Parser(options).parse(text)
}

export function parseSexp(text: string, options: ParserOptions): Sexp {
  const array = parseSexps(text, options)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseSexp] expecting one sexp, but found multiple sexp\n`
  throw new Error(message)
}
