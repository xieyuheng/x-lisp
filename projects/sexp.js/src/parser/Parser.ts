import { stringIsBigInt, stringIsNumber } from "@xieyuheng/helpers.js/string"
import * as S from "../index.ts"

type Result = { sexp: S.Sexp; remain: Array<S.Token> }

export type ParserOptions = {
  path: string
}

export class Parser {
  lexer: S.Lexer

  constructor(options: ParserOptions) {
    this.lexer = new S.Lexer(options)
  }

  parse(text: string): Array<S.Sexp> {
    let tokens = this.lexer.lex(text)
    const array: Array<S.Sexp> = []
    while (tokens.length > 0) {
      const { sexp, remain } = this.handleTokens(tokens)
      array.push(sexp)
      if (remain.length === 0) return array

      tokens = remain
    }

    return array
  }

  private handleTokens(tokens: Array<S.Token>): Result {
    if (tokens[0] === undefined) {
      let message = "I expect a token, but there is no token remain\n"
      throw new Error(message)
    }

    const token = tokens[0]

    switch (token.kind) {
      case "Symbol": {
        return {
          sexp: S.Symbol(token.value, token.location),
          remain: tokens.slice(1),
        }
      }

      case "Number": {
        if (stringIsBigInt(token.value)) {
          return {
            sexp: S.Int(BigInt(token.value), token.location),
            remain: tokens.slice(1),
          }
        }

        if (stringIsNumber(token.value)) {
          return {
            sexp: S.Float(Number(token.value), token.location),
            remain: tokens.slice(1),
          }
        }

        let message = `I expect value to be a bigint or number: ${token.value}\n`
        throw new Error(message)
      }

      case "String": {
        return {
          sexp: S.String(token.value, token.location),
          remain: tokens.slice(1),
        }
      }

      case "BracketStart": {
        if (token.value === "[") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return {
            sexp: S.List(
              [S.Symbol("@list"), ...S.asList(sexp).elements],
              sexp.location,
            ),
            remain,
          }
        }

        if (token.value === "{") {
          const { sexp, remain } = this.handleTokensInBracket(
            token,
            tokens.slice(1),
          )
          return {
            sexp: S.List(
              [S.Symbol("@record"), ...S.asList(sexp).elements],
              sexp.location,
            ),
            remain,
          }
        }

        return this.handleTokensInBracket(token, tokens.slice(1))
      }

      case "BracketEnd": {
        let message = `I found extra BracketEnd\n`
        throw new S.ErrorWithSourceLocation(message, token.location)
      }

      case "QuotationMark": {
        const { sexp, remain } = this.handleTokens(tokens.slice(1))

        const quoteTable: Record<string, string> = {
          "'": "@quote",
          ",": "@unquote",
          "`": "@quasiquote",
        }

        const quoteSymbol = S.Symbol(quoteTable[token.value], token.location)

        return {
          sexp: S.List([quoteSymbol, sexp], token.location),
          remain,
        }
      }

      case "Keyword": {
        return {
          sexp: S.Keyword(token.value, token.location),
          remain: tokens.slice(1),
        }
      }
    }
  }

  private handleTokensInBracket(
    start: S.Token,
    tokens: Array<S.Token>,
  ): Result {
    const array: Array<S.Sexp> = []

    while (true) {
      if (tokens[0] === undefined) {
        let message = `I found missing BracketEnd\n`
        throw new S.ErrorWithSourceLocation(message, start.location)
      }

      const token = tokens[0]

      if (token.kind === "BracketEnd") {
        if (!S.lexerMatchBrackets(start.value, token.value)) {
          let message = `I expect a matching BracketEnd\n`
          throw new S.ErrorWithSourceLocation(message, token.location)
        }

        return {
          sexp: S.List(array, {
            ...token.location,
            span: S.spanUnion(start.location.span, token.location.span),
          }),
          remain: tokens.slice(1),
        }
      }

      const head = this.handleTokens(tokens)
      array.push(head.sexp)
      tokens = head.remain
    }
  }
}
