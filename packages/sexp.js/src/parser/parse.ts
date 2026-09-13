import * as S from "../index.ts"

export function parseSexps(
  config: S.ParserConfig,
  text: string,
): Array<S.Sexp> {
  return new S.Parser(config).parse(text)
}

export function parseSexp(config: S.ParserConfig, text: string): S.Sexp {
  const array = parseSexps(config, text)
  if (array.length === 1) {
    return array[0]
  }

  let message = `[parseSexp] expecting one sexp, but found multiple sexp\n`
  throw new Error(message)
}
