import { stringIsBigInt, stringIsNumber } from "@xieyuheng/std.js/string"
import * as S from "../index.ts"

type Result = { sexp: S.Sexp; next: number }

export type ParserOptions = {
  path: string
}

export class Parser {
  lexer: S.Lexer

  constructor(options: ParserOptions) {
    this.lexer = new S.Lexer(options)
  }

  parse(text: string): Array<S.Sexp> {
    const tokens = this.lexer.lex(text)
    const array: Array<S.Sexp> = []
    let index = 0
    while (index < tokens.length) {
      const { sexp, next } = this.parseTokens(tokens, index)
      array.push(sexp)
      index = next
    }

    return array
  }

  private parseTokens(tokens: Array<S.Token>, index: number): Result {
    const token = tokens[index]
    if (token === undefined) {
      let message = "I expect a token, but there is no token remain\n"
      throw new Error(message)
    }

    switch (token.kind) {
      case "Symbol": {
        return {
          sexp: S.SymbolSexp(token.value, token.location),
          next: index + 1,
        }
      }

      case "Number": {
        if (stringIsBigInt(token.value)) {
          return {
            sexp: S.IntSexp(BigInt(token.value), token.location),
            next: index + 1,
          }
        }

        if (stringIsNumber(token.value)) {
          return {
            sexp: S.FloatSexp(Number(token.value), token.location),
            next: index + 1,
          }
        }

        let message = `I expect value to be a bigint or number: ${token.value}\n`
        throw new Error(message)
      }

      case "String": {
        return {
          sexp: S.StringSexp(token.value, token.location),
          next: index + 1,
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { sexp, next } = this.parseTokensInBracket(tokens, index, token)
          return {
            sexp: S.ListSexp(
              [
                S.SymbolSexp("@square-bracket", token.location),
                ...S.asListSexp(sexp).elements,
              ],
              sexp.location,
            ),
            next,
          }
        }

        if (token.value === "{") {
          const { sexp, next } = this.parseTokensInBracket(tokens, index, token)
          return {
            sexp: S.ListSexp(
              [
                S.SymbolSexp("@curly-bracket", token.location),
                ...S.asListSexp(sexp).elements,
              ],
              sexp.location,
            ),
            next,
          }
        }

        return this.parseTokensInBracket(tokens, index, token)
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new S.ErrorWithSourceLocation(message, token.location)
      }

      case "QuotationMark": {
        const { sexp, next } = this.parseTokens(tokens, index + 1)

        const quoteTable: Record<string, string> = {
          "'": "@quote",
          ",": "@unquote",
          "`": "@quasiquote",
        }

        const quoteSymbol = S.SymbolSexp(
          quoteTable[token.value],
          token.location,
        )

        return {
          sexp: S.ListSexp([quoteSymbol, sexp], token.location),
          next,
        }
      }
    }
  }

  private parseTokensInBracket(
    tokens: Array<S.Token>,
    startIndex: number,
    start: S.Token,
  ): Result {
    const array: Array<S.Sexp> = []

    let index = startIndex + 1
    while (true) {
      const token = tokens[index]
      if (token === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new S.ErrorWithSourceLocation(message, start.location)
      }

      if (token.kind === "BracketEnd") {
        if (!S.lexerMatchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new S.ErrorWithSourceLocation(message, token.location)
        }

        return {
          sexp: S.ListSexp(array, {
            ...token.location,
            span: S.spanUnion(start.location.span, token.location.span),
          }),
          next: index + 1,
        }
      }

      const head = this.parseTokens(tokens, index)
      array.push(head.sexp)
      index = head.next
    }
  }
}
