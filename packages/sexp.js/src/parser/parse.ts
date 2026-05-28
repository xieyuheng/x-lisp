import * as S from "../index.ts"

export function parseSexps(
  text: string,
  options: S.ParserOptions,
): Array<S.Sexp> {
  return new S.Parser(options).parse(text)
}

export function parseSexp(text: string, options: S.ParserOptions): S.Sexp {
  const array = parseSexps(text, options)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseSexp] expecting one sexp, but found multiple sexp\n`
  throw new Error(message)
}
